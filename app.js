class GestureController {
    constructor() {
        console.log('GestureController initializing...');
        
        // Get button element first
        this.startDemoButton = document.getElementById('startDemo');
        if (!this.startDemoButton) {
            console.error('Start demo button not found!');
            return;
        }
        
        // Add click event listener immediately
        this.startDemoButton.addEventListener('click', () => {
            console.log('Start demo button clicked');
            this.openDemo();
        });

        // Initialize other elements
        this.initializeElements();
        
        // Initialize components if elements are found
        if (this.elementsFound) {
            this.initializeComponents();
        }

        // Gesture states
        this.gestureStates = {
            isScrolling: false,
            isZooming: false,
            isDragging: false,
            lastPinchDistance: 0,
            lastHandPosition: null,
            gestureTimeout: null
        };

        this.initializeFeatureCards();
        this.initializeCloseButtons();
    }

    initializeElements() {
        console.log('Initializing elements...');
        this.elementsFound = true;

        this.video = document.getElementById('videoElement');
        if (!this.video) {
            console.error('Video element not found');
            this.elementsFound = false;
        }

        this.output = document.getElementById('output');
        if (!this.output) {
            console.error('Output element not found');
            this.elementsFound = false;
        }

        this.demoSection = document.getElementById('demo');
        if (!this.demoSection) {
            console.error('Demo section not found');
            this.elementsFound = false;
        }

        this.closeDemoButton = document.getElementById('closeDemo');
        if (!this.closeDemoButton) {
            console.error('Close demo button not found');
            this.elementsFound = false;
        } else {
            this.closeDemoButton.addEventListener('click', () => {
                console.log('Close demo button clicked');
                this.closeDemo();
            });
        }

        this.voiceButton = document.getElementById('startVoice');
        if (!this.voiceButton) console.error('Voice button not found');

        console.log('Elements initialized, found:', this.elementsFound);
    }

    initializeComponents() {
        try {
            // Initialize MediaPipe Hands
            this.hands = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
                maxNumHands: 2
            });

            // Initialize MediaPipe FaceMesh
            this.faceMesh = new FaceMesh({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
            });

            // Initialize Camera
            this.camera = new Camera(this.video, {
                onFrame: async () => {
                    await this.hands.send({image: this.video});
                    await this.faceMesh.send({image: this.video});
                },
                width: 640,
                height: 480
            });

        } catch (error) {
            console.error('Error initializing components:', error);
        }

        this.setupHandTracking();
        this.setupFaceMesh();
        this.setupVoiceRecognition();
    }

    setupEventListeners() {
        // Voice controls
        if (this.voiceButton) {
            this.voiceButton.addEventListener('click', () => {
                this.startVoiceRecognition();
            });
        }
    }

    setupHandTracking() {
        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => {
            this.handleHandResults(results);
        });
    }

    handleHandResults(results) {
        if (results.multiHandLandmarks) {
            if (results.multiHandLandmarks.length === 1) {
                // Single hand gestures
                this.handleSingleHandGestures(results.multiHandLandmarks[0]);
            } else if (results.multiHandLandmarks.length === 2) {
                // Two hand gestures
                this.handleTwoHandGestures(results.multiHandLandmarks[0], results.multiHandLandmarks[1]);
            }
        }
    }

    handleSingleHandGestures(landmarks) {
        const gesture = this.detectGesture(landmarks);
        
        switch(gesture) {
            case 'peace':
                this.handlePeaceSign();
                break;
            case 'palm':
                this.handleScrollGesture(landmarks);
                break;
            case 'fist':
                this.handleFistGesture();
                break;
            case 'pointing':
                this.handlePointingGesture(landmarks);
                break;
        }
    }

    handleTwoHandGestures(hand1, hand2) {
        const distance = this.calculateHandsDistance(hand1[8], hand2[8]);
        
        if (this.gestureStates.lastPinchDistance) {
            const deltaDistance = distance - this.gestureStates.lastPinchDistance;
            if (Math.abs(deltaDistance) > 0.01) {
                this.handleZoomGesture(deltaDistance);
            }
        }
        
        this.gestureStates.lastPinchDistance = distance;
    }

    detectGesture(landmarks) {
        // Peace Sign
        if (this.isPeaceSign(landmarks)) return 'peace';
        
        // Open Palm
        if (this.isOpenPalm(landmarks)) return 'palm';
        
        // Fist
        if (this.isFist(landmarks)) return 'fist';
        
        // Pointing
        if (this.isPointing(landmarks)) return 'pointing';
        
        return null;
    }

    isPeaceSign(landmarks) {
        const indexUp = landmarks[8].y < landmarks[6].y;
        const middleUp = landmarks[12].y < landmarks[10].y;
        const ringDown = landmarks[16].y > landmarks[14].y;
        const pinkyDown = landmarks[20].y > landmarks[18].y;
        
        return indexUp && middleUp && ringDown && pinkyDown;
    }

    isOpenPalm(landmarks) {
        return landmarks.slice(8, 21, 4).every(finger => finger.y < landmarks[0].y);
    }

    isFist(landmarks) {
        return landmarks.slice(8, 21, 4).every(finger => finger.y > landmarks[0].y);
    }

    isPointing(landmarks) {
        const indexUp = landmarks[8].y < landmarks[6].y;
        return indexUp && !this.isPeaceSign(landmarks);
    }

    handlePeaceSign() {
        this.showFeedback('Peace sign detected! ✌️');
        // Add your peace sign action here
    }

    handleScrollGesture(landmarks) {
        if (!this.gestureStates.isScrolling) {
            this.gestureStates.isScrolling = true;
            this.gestureStates.lastHandPosition = landmarks[9].y;
            this.showFeedback('Scroll mode activated 👋');
        } else {
            const deltaY = (landmarks[9].y - this.gestureStates.lastHandPosition) * 1000;
            window.scrollBy(0, deltaY);
            this.gestureStates.lastHandPosition = landmarks[9].y;
        }
    }

    handleFistGesture() {
        this.gestureStates.isScrolling = false;
        this.showFeedback('Gesture canceled ✊');
    }

    handlePointingGesture(landmarks) {
        const x = landmarks[8].x * window.innerWidth;
        const y = landmarks[8].y * window.innerHeight;
        
        // Move cursor to pointing position
        this.moveCursor(x, y);
    }

    handleZoomGesture(deltaDistance) {
        const zoomSpeed = 0.5;
        const zoomAmount = deltaDistance * zoomSpeed;
        
        document.body.style.transform = `scale(${1 + zoomAmount})`;
        this.showFeedback(deltaDistance > 0 ? 'Zooming in 🔍' : 'Zooming out 🔍');
    }

    moveCursor(x, y) {
        const cursor = document.getElementById('virtual-cursor') || this.createVirtualCursor();
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
    }

    createVirtualCursor() {
        const cursor = document.createElement('div');
        cursor.id = 'virtual-cursor';
        document.body.appendChild(cursor);
        return cursor;
    }

    calculateHandsDistance(point1, point2) {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2)
        );
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;

            this.recognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                this.handleVoiceCommand(command);
            };

            document.getElementById('startVoice').addEventListener('click', () => {
                this.recognition.start();
                this.showFeedback('Voice recognition activated');
            });
        } else {
            console.log('Speech recognition not supported');
        }
    }

    handleVoiceCommand(command) {
        if (command.includes('scroll down')) {
            window.scrollBy(0, 100);
            this.showFeedback('Scrolling down... 🔽');
        } else if (command.includes('scroll up')) {
            window.scrollBy(0, -100);
            this.showFeedback('Scrolling up... 🔼');
        }
    }

    setupFaceMesh() {
        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.faceMesh.onResults(this.handleFaceResults.bind(this));
    }

    handleFaceResults(results) {
        if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                const eyeGesture = this.detectEyeGesture(landmarks);
                if (eyeGesture) {
                    this.handleEyeGesture(eyeGesture);
                }
            }
        }
    }

    detectEyeGesture(landmarks) {
        const leftEye = {
            top: landmarks[159],
            bottom: landmarks[145],
            left: landmarks[33],
            right: landmarks[133]
        };

        const rightEye = {
            top: landmarks[386],
            bottom: landmarks[374],
            left: landmarks[362],
            right: landmarks[263]
        };

        const leftEAR = this.calculateEAR(leftEye);
        const rightEAR = this.calculateEAR(rightEye);
        const avgEAR = (leftEAR + rightEAR) / 2;

        if (avgEAR < 0.2) return 'blink';
        return null;
    }

    handleEyeGesture(gesture) {
        if (gesture === 'blink') {
            this.showFeedback('Blink detected! 👁️');
        }
    }

    calculateEAR(eye) {
        return this.distance(eye.top, eye.bottom) / this.distance(eye.left, eye.right);
    }

    distance(point1, point2) {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2)
        );
    }

    async startCamera() {
        console.log('Starting camera...');
        try {
            await this.camera.start();
            console.log('Camera started successfully');
            
            // Initialize features after camera starts
            this.setupHandTracking();
            this.setupFaceMesh();
            this.setupVoiceRecognition();
        } catch (error) {
            console.error('Error starting camera:', error);
            if (this.output) {
                this.output.textContent = 'Error: Could not start camera. Please make sure you have granted camera permissions.';
            }
        }
    }

    openDemo() {
        console.log('Opening demo...');
        if (!this.demoSection) {
            console.error('Cannot open demo - demo section not found');
            return;
        }

        // Remove hidden class and ensure demo is visible
        this.demoSection.classList.remove('hidden');
        this.demoSection.style.display = 'flex';
        
        // Start camera after a short delay to ensure modal is visible
        setTimeout(() => {
            this.startCamera();
        }, 100);
    }

    closeDemo() {
        console.log('Closing demo...');
        if (!this.demoSection) {
            console.error('Cannot close demo - demo section not found');
            return;
        }

        this.demoSection.classList.add('hidden');
        setTimeout(() => {
            this.demoSection.style.display = 'none';
        }, 300); // Match this with your CSS transition time

        if (this.camera) {
            this.camera.stop();
        }
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    showFeedback(message) {
        this.output.textContent = message;
        // Create and show floating feedback
        const feedback = document.createElement('div');
        feedback.className = 'floating-feedback';
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    initializeFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            const button = card.querySelector('.feature-btn');
            button.addEventListener('click', () => {
                const feature = card.dataset.feature;
                this.openFeatureDemo(feature);
            });
        });
    }

    initializeCloseButtons() {
        const closeButtons = document.querySelectorAll('.close-demo');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeAllDemos();
            });
        });
    }

    openFeatureDemo(feature) {
        // Close any open demos first
        this.closeAllDemos();

        // Open the selected demo
        const demoSection = document.getElementById(`${feature}-demo`);
        if (demoSection) {
            demoSection.classList.remove('hidden');
            this.initializeFeature(feature);
        }
    }

    closeAllDemos() {
        const demos = document.querySelectorAll('.feature-demo');
        demos.forEach(demo => {
            demo.classList.add('hidden');
        });
        this.stopAllFeatures();
    }

    initializeFeature(feature) {
        switch(feature) {
            case 'hand-gestures':
                this.initializeHandGestures();
                break;
            case 'eye-tracking':
                this.initializeEyeTracking();
                break;
            case 'voice-commands':
                this.initializeVoiceCommands();
                break;
        }
    }

    stopAllFeatures() {
        // Stop camera if it's running
        if (this.camera) {
            this.camera.stop();
        }
        // Stop voice recognition if it's running
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    // ... rest of your existing feature-specific methods ...
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Ensure the script runs after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    window.gestureController = new GestureController();
});

// Add a backup initialization
window.addEventListener('load', () => {
    console.log('Window loaded');
    if (!window.gestureController) {
        window.gestureController = new GestureController();
    }
});

// Add these functions to your existing JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Handle loading screen
    setTimeout(() => {
        document.querySelector('.loader').classList.add('fade-out');
    }, 1500);

    // Mobile menu handling
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Progress bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.progress-bar').style.width = scrolled + '%';
    });

    // Gesture feedback
    function showGestureFeedback(message) {
        const feedback = document.querySelector('.gesture-feedback');
        const messageSpan = feedback.querySelector('span');
        messageSpan.textContent = message;
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
    }

    // Add smooth reveal animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .tutorial-card').forEach(el => {
        observer.observe(el);
    });
}); 