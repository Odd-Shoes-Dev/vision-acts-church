// ========================================
// MULTI-STEP GIVING FLOW
// ========================================

let currentStep = 1;
let givingData = {
    type: null,
    amount: null,
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    reference: ''
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeStep1();
    initializeStep2();
    initializeStep3();
    initializeNavigation();
    initializeQrDownload();
    setupStickyNavbar();
});

// ========================================
// STEP 1: GIVING TYPE
// ========================================

function initializeStep1() {
    const typeButtons = document.querySelectorAll('.giving-type-btn');
    typeButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
            typeButtons.forEach((b) => b.classList.remove('selected'));
            this.classList.add('selected');
            givingData.type = this.dataset.type;
        });
    });
}

// ========================================
// STEP 2: AMOUNT
// ========================================

function initializeStep2() {
    const amountInput = document.getElementById('amountInput');
    const presetBtns = document.querySelectorAll('.preset-btn');

    presetBtns.forEach((btn) => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const amount = this.dataset.amount;
            amountInput.value = amount;
            givingData.amount = parseFloat(amount);

            presetBtns.forEach((b) => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    amountInput.addEventListener('input', function () {
        givingData.amount = this.value ? parseFloat(this.value) : null;
        presetBtns.forEach((b) => b.classList.remove('selected'));
    });
}

// ========================================
// STEP 3: DONOR INFORMATION
// ========================================

function initializeStep3() {
    const donorName = document.getElementById('donorName');
    const donorEmail = document.getElementById('donorEmail');
    const donorPhone = document.getElementById('donorPhone');

    donorName.addEventListener('input', function () {
        givingData.donorName = this.value.trim();
    });

    donorEmail.addEventListener('input', function () {
        givingData.donorEmail = this.value.trim();
    });

    donorPhone.addEventListener('input', function () {
        givingData.donorPhone = this.value.trim();
    });
}

// ========================================
// QR CODE + PAYMENT PAYLOAD
// ========================================

function buildPaymentPayload() {
    if (!givingData.reference) {
        givingData.reference = 'VOACTS-' + Date.now();
    }

    return {
        type: givingData.type,
        amount: givingData.amount,
        donorName: givingData.donorName,
        email: givingData.donorEmail,
        phone: givingData.donorPhone,
        reference: givingData.reference,
        timestamp: new Date().toISOString()
    };
}

function generateQRCode() {
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';

    const paymentData = buildPaymentPayload();
    const paymentUrl = `${window.location.origin}/payment-processing.html?data=${encodeURIComponent(JSON.stringify(paymentData))}`;

    new QRCode(qrcodeContainer, {
        text: paymentUrl,
        width: 256,
        height: 256,
        colorDark: '#0044CC',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

function initializeQrDownload() {
    const downloadBtn = document.getElementById('downloadQrBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function () {
        const canvas = document.querySelector('#qrcode canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `giving-qr-${givingData.type || 'offering'}-${Date.now()}.png`;
        link.click();
    });
}

// ========================================
// STEP NAVIGATION
// ========================================

function initializeNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', goToPreviousStep);
    nextBtn.addEventListener('click', handleNextAction);
}

function handleNextAction(e) {
    e.preventDefault();

    if (currentStep === 4) {
        completePayment();
        return;
    }

    goToNextStep();
}

function goToNextStep() {
    if (!validateStep(currentStep)) {
        alert(getValidationMessage(currentStep));
        return;
    }

    if (currentStep === 3) {
        generateQRCode();
    }

    if (currentStep < 4) {
        currentStep += 1;
        updateStepDisplay();
    }
}

function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep -= 1;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    const steps = document.querySelectorAll('.step-content');
    steps.forEach((step) => step.classList.remove('active'));

    const currentStepElement = document.querySelector(`.step-content[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    const indicators = document.querySelectorAll('.step-num');
    indicators.forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove('active', 'completed');

        if (stepNum === currentStep) {
            indicator.classList.add('active');
        } else if (stepNum < currentStep) {
            indicator.classList.add('completed');
        }
    });

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    prevBtn.disabled = currentStep === 1;

    if (currentStep === 4) {
        nextBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Checkout';
        updateReviewSection();
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }

    document.querySelector('.multi-step-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateReviewSection() {
    const typeMap = {
        tithe: 'Tithe',
        offertory: 'Offertory',
        donation: 'Donation'
    };

    document.getElementById('reviewType').textContent = typeMap[givingData.type] || '-';
    document.getElementById('reviewAmount').textContent = `MWK ${givingData.amount ? givingData.amount.toLocaleString() : '-'}`;
    document.getElementById('reviewEmail').textContent = givingData.donorEmail || '-';
}

// ========================================
// VALIDATION
// ========================================

function validateStep(step) {
    switch (step) {
        case 1:
            return givingData.type !== null;
        case 2:
            return givingData.amount && givingData.amount >= 100;
        case 3:
            return validateEmail(givingData.donorEmail);
        case 4:
            return true;
        default:
            return false;
    }
}

function getValidationMessage(step) {
    switch (step) {
        case 1:
            return 'Please select a giving type (Tithe, Offertory, or Donation).';
        case 2:
            return 'Please enter an amount of at least MWK 100.';
        case 3:
            return 'Please enter a valid email address.';
        default:
            return 'Please complete this step.';
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email || '');
}

// ========================================
// PAYMENT REDIRECT
// ========================================

function completePayment() {
    const paymentData = buildPaymentPayload();
    const encodedData = encodeURIComponent(JSON.stringify(paymentData));
    window.location.href = `payment-processing.html?data=${encodedData}`;
}

// ========================================
// SMART STICKY NAVBAR
// ========================================

function setupStickyNavbar() {
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
            } else if (isScrollingDown) {
                navbar.classList.remove('navbar-hidden');
                isScrollingDown = false;
            }
        } else {
            navbar.classList.remove('navbar-hidden');
            isScrollingDown = false;
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}
