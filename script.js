// Configuration
const CONFIG = {
    BIRTHDAY_DATE: new Date('February 4, 2026 00:00:00').getTime(),
    START_DATE: new Date('December 18, 2025 00:00:00').getTime(),
    PRACHI_NAME: 'Prachi',
    NOTIFICATION_TIME: '09:00', // 9 AM daily
    VAPID_PUBLIC_KEY: 'BLx_fk9K7Y2JtVjJk8eE1XqYQw3z4rT6yHnMpLqWsRtUvXyZaBcDdEfGhIjKlMnOpQrStUvWxYz' // Example key
};

// Romantic Messages Database (50+ messages)
const ROMANTIC_MESSAGES = [
    "Every moment with you is a treasure I cherish deeply.",
    "Your smile is my favorite sight in this entire world.",
    "In your eyes, I found my home and my forever.",
    "My love for you grows stronger with each passing day.",
    "You are the missing piece I never knew I needed.",
    "Being with you feels like a beautiful dream I never want to wake up from.",
    "Your laughter is the sweetest melody my heart knows.",
    "I fall for you more and more with every sunrise.",
    "You make my world brighter just by being in it.",
    "My heart skips a beat every time I think of you.",
    "You are the reason I believe in fairy tales.",
    "With you, every day feels like a blessing.",
    "Your love is the greatest gift I've ever received.",
    "I'm endlessly grateful for your presence in my life.",
    "You are my today and all of my tomorrows.",
    "My love for you is deeper than the ocean and higher than the stars.",
    "You are the most beautiful chapter in my life's story.",
    "Every love song reminds me of you.",
    "Your kindness makes me want to be a better person.",
    "I love you more than words could ever express.",
    "You are my sunshine on the cloudiest of days.",
    "My heart belongs to you, now and forever.",
    "With you, I've found my happily ever after.",
    "You make ordinary moments feel extraordinary.",
    "I cherish every memory we create together.",
    "Your love is the anchor that keeps me grounded.",
    "I'm the luckiest person to have you in my life.",
    "You are my greatest adventure and my safest haven.",
    "My soul recognized yours from the very beginning.",
    "Your love is the greatest blessing of my life.",
    "I love you not only for who you are but for who I am when I'm with you.",
    "You are the dream I never want to wake up from.",
    "Every day with you is a page in our beautiful love story.",
    "Your presence makes everything better.",
    "I love you more than yesterday but less than tomorrow.",
    "You are my favorite thought every morning and my last thought every night.",
    "My heart whispers your name with every beat.",
    "You are my forever and always.",
    "With you, I've found a love I never knew existed.",
    "You are the answer to every prayer I never said.",
    "My love for you is infinite and eternal.",
    "You make my world complete.",
    "Every moment without you feels like a moment wasted.",
    "You are the most beautiful person, inside and out.",
    "I love you to the moon and back, infinitely.",
    "Your love is the greatest journey of my life.",
    "With you, I've found my soulmate and best friend.",
    "You are my greatest treasure.",
    "My heart has found its home in you.",
    "I love you more than all the stars in the sky.",
    "You are my today, my tomorrow, and my forever.",
    "With you, every day is Valentine's Day.",
    "You are the reason my heart beats with joy.",
    "My love for you is as endless as the universe.",
    "You make every day worth living.",
    "I'm forever grateful for your love.",
    "You are my dream come true.",
    "With you, I've found my perfect match.",
    "Your love is the light that guides me.",
    "I love you more than anything in this world."
];

// Special birthday message
const BIRTHDAY_MESSAGE = `My Dearest Prachi,

Happy Birthday, my love! 🎂🎉

On this special day, I want you to know how incredibly grateful I am to have you in my life. You are not just my love, but my best friend, my confidante, and my greatest blessing.

Your smile lights up my world, your laughter is my favorite melody, and your love is the greatest gift I've ever received. Today, I celebrate you - the amazing, beautiful, kind-hearted person you are.

May this year bring you endless joy, success in all your endeavors, and dreams that come true. May every moment be filled with love, laughter, and beautiful memories.

Remember, you are loved more than words could ever express. You deserve all the happiness in the world and so much more.

Here's to celebrating you today and every day. I love you more than yesterday, but less than tomorrow. Happy Birthday, my darling!

Forever yours,
With all my love ❤️`;

// DOM Elements
const countdownEl = document.getElementById('countdown');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const dailyMessageEl = document.getElementById('dailyMessage');
const messageDayEl = document.getElementById('messageDay');
const enableNotificationsBtn = document.getElementById('enableNotifications');
const testNotificationBtn = document.getElementById('testNotification');
const notificationStatusEl = document.getElementById('notificationStatus');
const birthdaySection = document.getElementById('birthdaySection');
const birthdayMessageEl = document.getElementById('birthdayMessage');
const surpriseBtn = document.getElementById('surpriseBtn');
const heartsContainer = document.getElementById('heartsContainer');
const confettiContainer = document.getElementById('confettiContainer');
const bgMusic = document.getElementById('bgMusic');
const notificationSound = document.getElementById('notificationSound');

// State variables
let notificationPermission = 'default';
let serviceWorkerRegistration = null;
let daysUntilBirthday = 0;
let isBirthday = false;

// Initialize the application
function init() {
    createFloatingHearts();
    setupCountdown();
    setupDailyMessage();
    setupNotifications();
    setupEventListeners();
    checkIfBirthday();
}

// Create floating hearts in background
function createFloatingHearts() {
    const heartCount = 50;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        // Random position and animation delay
        const size = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 15;
        
        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.animationDuration = `${duration}s`;
        
        // Random color
        const colors = ['#FF6B6B', '#FFD166', '#4ECDC4', '#FF8E8E', '#FFB8B8'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.color = color;
        
        heartsContainer.appendChild(heart);
    }
}

// Setup countdown timer
function setupCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = CONFIG.BIRTHDAY_DATE - now;
        
        // Check if birthday has arrived
        if (timeLeft <= 0) {
            isBirthday = true;
            showBirthdayCelebration();
            return;
        }
        
        // Calculate days, hours, minutes, seconds
        daysUntilBirthday = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update display
        daysEl.textContent = String(daysUntilBirthday).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
        
        // Special animation when days reduce
        if (seconds === 0) {
            animateCountdown();
        }
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Animate countdown when days reduce
function animateCountdown() {
    const countdownItems = document.querySelectorAll('.countdown-item');
    
    countdownItems.forEach(item => {
        item.style.transform = 'scale(1.1)';
        item.style.boxShadow = '0 10px 25px rgba(139, 0, 0, 0.8)';
        
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.boxShadow = '0 5px 15px rgba(139, 0, 0, 0.4)';
        }, 300);
    });
    
    // Add some floating hearts
    createHeartBurst();
}

// Create heart burst animation
function createHeartBurst() {
    const heartDisplay = document.querySelector('.heart-animation');
    const rect = heartDisplay.getBoundingClientRect();
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.position = 'fixed';
        heart.style.left = `${rect.left + rect.width / 2}px`;
        heart.style.top = `${rect.top + rect.height / 2}px`;
        heart.style.fontSize = '20px';
        heart.style.color = '#FF6B6B';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(heart);
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;
        
        // Animate
        setTimeout(() => {
            heart.style.transform = `translate(${targetX}px, ${targetY}px)`;
            heart.style.opacity = '0';
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(heart);
        }, 1100);
    }
}

// Setup daily message
function setupDailyMessage() {
    const today = new Date();
    const startDate = new Date(CONFIG.START_DATE);
    
    // Calculate days since start
    const timeDiff = today.getTime() - startDate.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Ensure daysSinceStart is not negative
    const dayIndex = Math.max(0, daysSinceStart);
    
    // Get message for today (cycle through messages)
    const messageIndex = dayIndex % ROMANTIC_MESSAGES.length;
    const todayMessage = ROMANTIC_MESSAGES[messageIndex];
    
    // Update display
    dailyMessageEl.textContent = todayMessage;
    messageDayEl.textContent = `Day ${dayIndex + 1}`;
    
    // Store today's message for notifications
    localStorage.setItem('todayMessage', todayMessage);
    localStorage.setItem('messageDay', dayIndex + 1);
}

// Setup notifications
function setupNotifications() {
    // Check if notifications are supported
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        notificationStatusEl.textContent = 'Notifications not supported in your browser';
        enableNotificationsBtn.disabled = true;
        return;
    }
    
    // Check current permission
    notificationPermission = Notification.permission;
    updateNotificationStatus();
    
    // Request permission when button is clicked
    enableNotificationsBtn.addEventListener('click', async () => {
        if (notificationPermission === 'denied') {
            notificationStatusEl.textContent = 'Notifications blocked. Please enable in browser settings.';
            return;
        }
        
        if (notificationPermission === 'granted') {
            notificationStatusEl.textContent = 'Notifications already enabled!';
            return;
        }
        
        // Request permission
        const permission = await Notification.requestPermission();
        notificationPermission = permission;
        updateNotificationStatus();
        
        if (permission === 'granted') {
            // Register service worker
            await registerServiceWorker();
            scheduleDailyNotification();
        }
    });
    
    // Test notification button
    testNotificationBtn.addEventListener('click', () => {
        if (notificationPermission === 'granted') {
            sendTestNotification();
        } else {
            alert('Please enable notifications first');
        }
    });
    
    // Register service worker if already granted
    if (notificationPermission === 'granted') {
        registerServiceWorker();
    }
}

// Update notification status display
function updateNotificationStatus() {
    switch (notificationPermission) {
        case 'granted':
            notificationStatusEl.textContent = '✓ Notifications enabled';
            notificationStatusEl.style.color = '#4CAF50';
            enableNotificationsBtn.innerHTML = '<i class="fas fa-bell"></i> Notifications Enabled';
            enableNotificationsBtn.disabled = true;
            break;
        case 'denied':
            notificationStatusEl.textContent = '✗ Notifications blocked';
            notificationStatusEl.style.color = '#F44336';
            enableNotificationsBtn.innerHTML = '<i class="fas fa-bell-slash"></i> Notifications Blocked';
            enableNotificationsBtn.disabled = true;
            break;
        default:
            notificationStatusEl.textContent = 'Notifications disabled';
            notificationStatusEl.style.color = '#FF9800';
            enableNotificationsBtn.innerHTML = '<i class="fas fa-bell"></i> Enable Daily Notifications';
            enableNotificationsBtn.disabled = false;
    }
}

// Register service worker
async function registerServiceWorker() {
    try {
        serviceWorkerRegistration = await navigator.serviceWorker.register('sw.js');
        console.log('Service Worker registered');
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        notificationStatusEl.textContent = 'Failed to setup notifications';
    }
}

// Schedule daily notification
function scheduleDailyNotification() {
    if (!serviceWorkerRegistration || notificationPermission !== 'granted') return;
    
    // Calculate time until 9 AM
    const now = new Date();
    const [targetHour, targetMinute] = CONFIG.NOTIFICATION_TIME.split(':').map(Number);
    const targetTime = new Date();
    targetTime.setHours(targetHour, targetMinute, 0, 0);
    
    // If already past today's target time, schedule for tomorrow
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const timeUntilNotification = targetTime.getTime() - now.getTime();
    
    // Schedule notification
    setTimeout(() => {
        sendDailyNotification();
        // Schedule next notification (every 24 hours)
        setInterval(sendDailyNotification, 24 * 60 * 60 * 1000);
    }, timeUntilNotification);
    
    console.log(`Next notification scheduled for: ${targetTime}`);
}

// Send daily notification
function sendDailyNotification() {
    if (!serviceWorkerRegistration || notificationPermission !== 'granted') return;
    
    const today = new Date();
    const timeLeft = CONFIG.BIRTHDAY_DATE - today.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    // Don't send notifications after birthday
    if (daysLeft < 0) return;
    
    // Get today's message
    const messageIndex = daysLeft % ROMANTIC_MESSAGES.length;
    const dailyMessage = ROMANTIC_MESSAGES[messageIndex];
    
    const title = `❤️ ${daysLeft} days left for your special day, ${CONFIG.PRACHI_NAME} ❤️`;
    const options = {
        body: dailyMessage,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        tag: 'birthday-countdown',
        renotify: true,
        actions: [
            {
                action: 'open',
                title: 'Open Countdown'
            }
        ],
        vibrate: [200, 100, 200]
    };
    
    // Play notification sound
    if (notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(e => console.log('Could not play notification sound:', e));
    }
    
    // Show notification
    serviceWorkerRegistration.showNotification(title, options);
}

// Send test notification
function sendTestNotification() {
    if (!serviceWorkerRegistration || notificationPermission !== 'granted') return;
    
    const title = `❤️ Test Notification for ${CONFIG.PRACHI_NAME} ❤️`;
    const options = {
        body: 'This is a test notification. You will receive daily countdown messages starting from 18th December, 2025.',
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png'
    };
    
    serviceWorkerRegistration.showNotification(title, options);
}

// Check if today is the birthday
function checkIfBirthday() {
    const now = new Date();
    const birthday = new Date(CONFIG.BIRTHDAY_DATE);
    
    // Check if same day, month, and year
    if (now.getDate() === birthday.getDate() && 
        now.getMonth() === birthday.getMonth() && 
        now.getFullYear() === birthday.getFullYear()) {
        isBirthday = true;
        showBirthdayCelebration();
    }
}

// Show birthday celebration
function showBirthdayCelebration() {
    // Hide countdown sections
    document.querySelector('.countdown-section').style.display = 'none';
    document.querySelector('.message-section').style.display = 'none';
    document.querySelector('.notification-section').style.display = 'none';
    
    // Show birthday section
    birthdaySection.style.display = 'block';
    
    // Set birthday message
    birthdayMessageEl.textContent = BIRTHDAY_MESSAGE;
    
    // Create confetti
    createConfetti();
    
    // Play background music (muted initially)
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log('Could not play background music:', e));
    }
}

// Create confetti animation
function createConfetti() {
    confettiContainer.style.display = 'block';
    const confettiCount = 200;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const left = Math.random() * 100;
        const size = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 3;
        
        // Random color
        const colors = ['#FF6B6B', '#FFD166', '#4ECDC4', '#FF8E8E', '#FFB8B8', '#8B0000', '#B8860B', '#FFD700'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Apply styles
        confetti.style.left = `${left}%`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.animationDelay = `${delay}s`;
        confetti.style.animationDuration = `${duration}s`;
        
        // Random shape (circle or square)
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        confettiContainer.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            if (confetti.parentNode === confettiContainer) {
                confettiContainer.removeChild(confetti);
            }
        }, duration * 1000);
    }
    
    // Keep creating confetti
    setInterval(createConfetti, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Surprise button
    surpriseBtn.addEventListener('click', () => {
        alert('Surprise! This is a placeholder for your actual surprise. You can replace this with a photo gallery, video message, or any other special content for Prachi!');
    });
    
    // Handle notification clicks
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.action === 'notificationClick') {
                // Focus window and scroll to top
                window.focus();
                window.scrollTo(0, 0);
                
                // Add special animation
                createHeartBurst();
            }
        });
    }
    
    // Handle visibility change to check for new notifications
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setupDailyMessage();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
                serviceWorkerRegistration = registration;
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}