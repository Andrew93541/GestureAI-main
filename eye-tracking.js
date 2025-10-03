class EyeTrackingController {
    constructor() {
        this.initializeElements();
        this.setupCamera();
        this.setupFaceMesh();
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
                await this.faceMesh.send({image: this.video});
            },
            width: 640,
            height: 480
        });
    }

    setupFaceMesh() {
        this.faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
        });

        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.faceMesh.onResults(this.handleFaceResults.bind(this));
        this.startCamera();
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

    calculateEAR(eye) {
        return this.distance(eye.top, eye.bottom) / this.distance(eye.left, eye.right);
    }

    distance(point1, point2) {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2)
        );
    }

    handleEyeGesture(gesture) {
        if (gesture === 'blink') {
            this.showFeedback('Blink detected! 👁️');
        }
    }

    showFeedback(message) {
        this.output.textContent = message;
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EyeTrackingController();
}); 