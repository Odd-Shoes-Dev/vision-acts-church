// ========================================
// SMART STICKY NAVBAR (shared)
// ========================================

let lastScrollY = 0;
let isScrollingDown = false;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
            if (!isScrollingDown) {
                navbar.classList.add('navbar-hidden');
                isScrollingDown = true;
            }
        } else {
            if (isScrollingDown) {
                navbar.classList.remove('navbar-hidden');
                isScrollingDown = false;
            }
        }
    } else {
        navbar.classList.remove('navbar-hidden');
        isScrollingDown = false;
    }
    
    lastScrollY = currentScrollY;
}, { passive: true });

// ========================================
// BIBLE READER
// ========================================

const LOCAL_BIBLE_DATA_PATHS = [
    '/public/data/en_kjv.json',
    'public/data/en_kjv.json',
    './public/data/en_kjv.json'
];
const BIBLE_TRANSLATION = 'KJV';

const bookSelect = document.querySelector('#bookSelect');
const chapterInput = document.querySelector('#chapterInput');
const verseInput = document.querySelector('#verseInput');
const bibleContent = document.querySelector('#bibleContent');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

let currentBook = null;
let bibleData = [];
let bookByName = {};

function cleanVerseText(text) {
    if (!text) {
        return '';
    }

    return text
        // Remove annotation blocks like {firmament: Heb. expansion}
        .replace(/\{[^}]*\}/g, '')
        // Remove trailing shorthand fragments sometimes left from note text
        .replace(/\s*etc\.\s*$/i, '')
        // Normalize spacing around punctuation
        .replace(/\s+([,.;:!?])/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

async function loadBooks() {
    try {
        showLoading('Loading Bible books...');
        let data = null;
        let lastError = null;

        for (const path of LOCAL_BIBLE_DATA_PATHS) {
            try {
                const response = await fetch(path, { cache: 'no-store' });
                if (!response.ok) {
                    lastError = `Request failed for ${path} (${response.status})`;
                    continue;
                }

                data = await response.json();
                break;
            } catch (error) {
                lastError = `Request failed for ${path}`;
            }
        }

        if (!data) {
            throw new Error(lastError || 'Bible data file not found');
        }

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Bible data is invalid');
        }

        bibleData = data;
        bookByName = bibleData.reduce((acc, book) => {
            acc[book.name] = book;
            return acc;
        }, {});

        populateBookSelect();
        bibleContent.innerHTML = '<div class="loading">Select a book and chapter to begin reading</div>';
    } catch (error) {
        console.error('Error loading Bible data:', error);
        showError('Failed to load Bible data. Ensure public/data/en_kjv.json is deployed, then refresh.');
    }
}

function populateBookSelect() {
    // Add popular books first for easy access
    const popularBooks = [
        'Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 'Mark', 'Luke', 'John', 'Romans', '1 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '1 Timothy', 'Hebrews', 'James', '1 Peter', '1 John', 'Revelation'
    ];

    bookSelect.innerHTML = '<option value="">Select a book...</option>';
    
    popularBooks.forEach(name => {
        if (bookByName[name]) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            bookSelect.appendChild(option);
        }
    });

    // Add a separator
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '───────────────────';
    bookSelect.appendChild(separator);

    // Add remaining books
    bibleData.forEach(book => {
        const bookName = book.name;
        if (!popularBooks.includes(bookName)) {
            const option = document.createElement('option');
            option.value = bookName;
            option.textContent = bookName;
            bookSelect.appendChild(option);
        }
    });
}

function updateChapterConstraints(bookName) {
    const selectedBook = bookByName[bookName];
    if (!selectedBook || !Array.isArray(selectedBook.chapters)) {
        chapterInput.removeAttribute('max');
        return;
    }

    const maxChapters = selectedBook.chapters.length;
    chapterInput.max = maxChapters;
    if (parseInt(chapterInput.value, 10) > maxChapters) {
        chapterInput.value = maxChapters;
    }
}

function loadPassage(book, chapter, verse) {
    if (!book) {
        showError('Please select a book first');
        return;
    }

    const selectedBook = bookByName[book];
    if (!selectedBook) {
        showError('Selected book was not found in the Bible data.');
        return;
    }

    const chapterNumber = parseInt(chapter, 10);
    if (!chapterNumber || chapterNumber < 1 || chapterNumber > selectedBook.chapters.length) {
        showError('Invalid chapter. Please enter a valid chapter number.');
        return;
    }

    const chapterVerses = selectedBook.chapters[chapterNumber - 1] || [];
    if (!Array.isArray(chapterVerses) || chapterVerses.length === 0) {
        showError('No verses found for this chapter.');
        return;
    }

    const startVerse = Math.max(1, parseInt(verse, 10) || 1);
    verseInput.max = chapterVerses.length;
    if (startVerse > chapterVerses.length) {
        showError(`This chapter has only ${chapterVerses.length} verses.`);
        return;
    }

    const versesToDisplay = chapterVerses.slice(startVerse - 1).map((text, index) => ({
        verse: startVerse + index,
        text: cleanVerseText(text)
    }));

    displayPassage(book, chapterNumber, versesToDisplay);
    currentBook = book;
    updateNavButtons(chapterNumber, selectedBook.chapters.length);
}

function displayPassage(bookName, chapter, verses) {
    let html = `
        <div class="bible-passage-header">
            <h2>${BIBLE_TRANSLATION}</h2>
            <p>${bookName} ${chapter}</p>
        </div>
        <div class="bible-passage-text">
    `;

    verses.forEach(verseData => {
        html += `
            <div class="bible-verse">
                <span class="bible-verse-number">${verseData.verse}</span>
                <span>${verseData.text}</span>
            </div>
        `;
    });

    html += '</div>';
    bibleContent.innerHTML = html;
}

function showLoading(message) {
    bibleContent.innerHTML = `<div class="loading">${message}</div>`;
}

function showError(message) {
    bibleContent.innerHTML = `<div class="error"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
}

function updateNavButtons(currentChapter, totalChapters) {
    prevBtn.disabled = currentChapter <= 1;
    nextBtn.disabled = currentChapter >= totalChapters;
}

// Event listeners
bookSelect.addEventListener('change', (e) => {
    if (e.target.value) {
        updateChapterConstraints(e.target.value);
        chapterInput.value = 1;
        verseInput.value = 1;
        loadPassage(e.target.value, 1, 1);
    }
});

chapterInput.addEventListener('change', () => {
    verseInput.value = 1;
    if (currentBook) {
        loadPassage(currentBook, parseInt(chapterInput.value, 10), 1);
    }
});

verseInput.addEventListener('change', () => {
    if (currentBook) {
        loadPassage(currentBook, parseInt(chapterInput.value, 10), parseInt(verseInput.value, 10));
    }
});

prevBtn.addEventListener('click', () => {
    if (currentBook && chapterInput.value > 1) {
        chapterInput.value = parseInt(chapterInput.value) - 1;
        verseInput.value = 1;
        loadPassage(currentBook, parseInt(chapterInput.value, 10), 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentBook) {
        chapterInput.value = parseInt(chapterInput.value) + 1;
        verseInput.value = 1;
        loadPassage(currentBook, parseInt(chapterInput.value, 10), 1);
    }
});

// Load books on page load
window.addEventListener('load', () => {
    loadBooks();
    prevBtn.disabled = true;
    nextBtn.disabled = true;
});
