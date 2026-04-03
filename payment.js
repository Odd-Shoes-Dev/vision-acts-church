// ========================================
// PAYMENT PROCESSING
// ========================================

let paymentData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPaymentData();
    setupStickyNavbar();
    attachPaymentHandler();
});

// ========================================
// LOAD PAYMENT DATA FROM URL
// ========================================

function loadPaymentData() {
    // Get data from URL parameters
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');

    if (dataParam) {
        try {
            paymentData = JSON.parse(decodeURIComponent(dataParam));
            displayPaymentSummary();
        } catch (error) {
            console.error('Error parsing payment data:', error);
            alert('Error loading payment data. Please try again.');
            window.location.href = 'giving-payment.html';
        }
    } else {
        alert('No payment data found. Please start from the giving form.');
        window.location.href = 'giving-payment.html';
    }
}

// ========================================
// DISPLAY PAYMENT SUMMARY
// ========================================

function displayPaymentSummary() {
    const typeMap = {
        'tithe': 'Tithe',
        'offertory': 'Offertory',
        'donation': 'Donation'
    };

    document.getElementById('summaryType').textContent = typeMap[paymentData.type] || paymentData.type;
    document.getElementById('summaryAmount').textContent = `MWK ${paymentData.amount?.toLocaleString() || '0'}`;
    document.getElementById('summaryRef').textContent = paymentData.reference || 'N/A';

    // Pre-populate donor email if available
    if (paymentData.email && paymentData.email !== 'no-email@church.com') {
        document.getElementById('donorEmail').value = paymentData.email;
    }
}

// ========================================
// PAYMENT SUBMISSION
// ========================================

function attachPaymentHandler() {
    const paymentBtn = document.getElementById('paymentBtn');
    paymentBtn.addEventListener('click', processPayment);
}

async function processPayment(e) {
    e.preventDefault();

    // Validate required fields
    const donorEmail = document.getElementById('donorEmail').value.trim();
    
    if (!donorEmail) {
        alert('Please enter your email address');
        return;
    }

    if (!validateEmail(donorEmail)) {
        alert('Please enter a valid email address');
        return;
    }

    // Show loading state
    const btn = document.getElementById('paymentBtn');
    const btnText = document.getElementById('btnText');
    btn.disabled = true;
    btn.classList.add('loading');
    btnText.textContent = 'Processing...';

    try {
        // Prepare payment payload
        const payload = {
            type: paymentData.type,
            amount: paymentData.amount,
            method: 'flutterwave_checkout',
            reference: paymentData.reference,
            email: donorEmail,
            currency: 'MWK',
            timestamp: new Date().toISOString()
        };

        // ========================================
        // FLUTTERWAVE INTEGRATION PLACEHOLDER
        // ========================================
        // When you have Flutterwave API keys, replace this section with:
        /*
        const response = await fetch('/api/payment/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Redirect to Flutterwave checkout
            FlutterwaveCheckout({
                public_key: result.public_key,
                tx_ref: result.tx_ref,
                amount: result.amount,
                currency: result.currency,
                payment_options: result.payment_options,
                customer: {
                    email: donorEmail,
                    phone_number: paymentData.phone || ''
                },
                customizations: {
                    title: 'Vision of Acts Giving',
                    description: `${payload.type.charAt(0).toUpperCase() + payload.type.slice(1)} - MWK ${payload.amount}`,
                    logo: 'https://your-domain.com/public/images/logo.png'
                },
                callback: onFlutterwaveClose
            });
        }
        */

        // DEMO MODE: Show success message
        showSuccessMessage(payload);

    } catch (error) {
        console.error('Payment error:', error);
        alert('An error occurred while processing your payment. Please try again.');
        btn.disabled = false;
        btn.classList.remove('loading');
        btnText.textContent = 'Process Payment';
    }
}

function showSuccessMessage(payload) {
    // In production, this would handle Flutterwave's response
    // For now, show a demo success message
    
    const container = document.querySelector('.payment-body');
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: var(--primary-blue); margin-bottom: 0.5rem;">Payment Initiated</h2>
            <p style="color: var(--medium-gray); margin-bottom: 1.5rem;">
                Your payment of <strong>MWK ${payload.amount?.toLocaleString()}</strong> has been initiated.
            </p>
            
            <div style="background: var(--light-gray); padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; text-align: left;">
                <p><strong>Reference:</strong> ${payload.reference}</p>
                <p><strong>Type:</strong> ${payload.type.charAt(0).toUpperCase() + payload.type.slice(1)}</p>
                <p><strong>Email:</strong> ${payload.email}</p>
                <p><strong>Status:</strong> <span style="color: #FFC107;">Pending Confirmation</span></p>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; color: #856404;">
                <i class="fas fa-info-circle"></i>
                <strong>Demo Mode:</strong> This is a demonstration. Add your Flutterwave API keys to enable live payments.
            </div>

            <a href="giving-payment.html" class="submit-btn" style="display: inline-block; text-decoration: none; width: auto;">
                Make Another Donation
            </a>
            <br><br>
            <a href="index.html" style="color: var(--primary-blue); text-decoration: none;">
                Back to Home
            </a>

            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #ddd; color: var(--medium-gray); font-size: 0.9rem;">
                <p>God bless you for your generosity! A receipt will be sent to <strong>${payload.email}</strong></p>
            </div>
        </div>
    `;
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// FLUTTERWAVE CALLBACK (for when integrated)
// ========================================

function onFlutterwaveClose(response) {
    /*
    Handle Flutterwave's response
    - response.status: 'successful', 'cancelled', 'failed'
    - response.transaction_id: Transaction ID from Flutterwave
    */
    console.log('Flutterwave response:', response);
    
    if (response.status === 'successful') {
        // Show success message and save to database
        showSuccessMessage(paymentData);
    } else {
        alert('Payment was not completed. Please try again.');
    }
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
}
