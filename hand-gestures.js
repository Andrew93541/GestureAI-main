class HandGestureController {
    constructor() {
        this.initializeElements();
        this.setupCamera();
        this.setupHandTracking();
        this.setupGestureStates();
    }

    initializeElements() {
        this.video = document.getElementById('videoElement');
        this.output = document.getElementById('output');
        
        if (!this.video || !this.output) {
            console.error('Required elements not found');
            return;
        }
    }

    setupCamera() {
        this.camera = new Camera(this.video, {
            onFrame: async () => {
                await this.hands.send({image: this.video});
            },
            width: 640,
            height: 480
        });
    }

    setupHandTracking() {
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults(this.handleHandResults.bind(this));
        this.startCamera();
    }

    setupGestureStates() {
        this.gestureStates = {
            isScrolling: false,
            lastHandPosition: null,
            gestureTimeout: null
        };
    }

    async startCamera() {
        try {
            await this.camera.start();
            this.showFeedback('Camera started successfully');
        } catch (error) {
            this.showFeedback('Error: Could not start camera');
            console.error(error);
        }
    }

    handleHandResults(results) {
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                const gesture = this.detectGesture(landmarks);
                if (gesture) {
                    this.handleGesture(gesture, landmarks);
                }
            }
        }
    }

    detectGesture(landmarks) {
        if (this.isPeaceSign(landmarks)) return 'peace';
        if (this.isOpenPalm(landmarks)) return 'palm';
        if (this.isFist(landmarks)) return 'fist';
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

    handleGesture(gesture, landmarks) {
        switch(gesture) {
            case 'peace':
                this.showFeedback('Peace sign detected! ✌️');
                break;
            case 'palm':
                this.handleScrollGesture(landmarks);
                break;
            case 'fist':
                this.stopScrolling();
                break;
        }
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

    stopScrolling() {
        this.gestureStates.isScrolling = false;
        this.showFeedback('Scroll mode deactivated ✊');
    }

    showFeedback(message) {
        this.output.textContent = message;
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HandGestureController();
}); 