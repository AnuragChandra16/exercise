class MediaPipeHandler {
    constructor() {
        this.video = document.getElementById('webcam');
        this.canvas = document.getElementById('output-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pose = null;
        this.camera = null;
        this.landmarks = [];
        this.isRunning = false;
        this.currentExercise = null;
        this.exerciseEvaluator = null;
    }

    async init() {
        // Set up camera
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
        });
        this.video.srcObject = stream;
        
        // Wait for video to load
        await new Promise(resolve => {
            this.video.onloadedmetadata = () => {
                resolve();
            };
        });
        
        // Set canvas dimensions
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // Initialize MediaPipe Pose
        this.pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });
        
        this.pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        // Set up callback when pose detection results are available
        this.pose.onResults(this.onResults.bind(this));
        
        // Create camera instance that will use webcam
        this.camera = new Camera(this.video, {
            onFrame: async () => {
                await this.pose.send({ image: this.video });
            },
            width: this.video.videoWidth,
            height: this.video.videoHeight
        });
    }

    onResults(results) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the camera feed
        this.ctx.drawImage(
            results.image, 0, 0, this.canvas.width, this.canvas.height
        );
        
        // Store landmarks for further processing
        this.landmarks = results.poseLandmarks;
        
        // If pose is detected
        if (results.poseLandmarks) {
            // Draw pose landmarks
            this.drawPoseLandmarks(results.poseLandmarks);
            
            // Evaluate exercise if we have an active exercise
            if (this.currentExercise && this.exerciseEvaluator) {
                this.exerciseEvaluator.evaluate(results.poseLandmarks);
            }
        }
    }

    drawPoseLandmarks(landmarks) {
        // Get feedback if available
        let feedback = null;
        if (this.exerciseEvaluator) {
            feedback = this.exerciseEvaluator.getFeedback();
        }
        
        // Draw connections between landmarks
        this.drawConnections(landmarks, feedback);
        
        // Draw individual landmarks
        for (let i = 0; i < landmarks.length; i++) {
            const landmark = landmarks[i];
            const isCorrect = feedback ? feedback.correctLandmarks.includes(i) : true;
            const color = isCorrect ? 'green' : 'red';
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(
                landmark.x * this.canvas.width,
                landmark.y * this.canvas.height,
                6, 0, 2 * Math.PI
            );
            this.ctx.fill();
        }
    }

    drawConnections(landmarks, feedback) {
        // Define connections between landmarks for human pose
        const connections = [
            // Torso
            [11, 12], [12, 24], [24, 23], [23, 11],
            // Left arm
            [11, 13], [13, 15],
            // Right arm
            [12, 14], [14, 16],
            // Left leg
            [23, 25], [25, 27],
            // Right leg
            [24, 26], [26, 28]
        ];
        
        for (const [start, end] of connections) {
            const startLandmark = landmarks[start];
            const endLandmark = landmarks[end];
            
            // Determine color based on feedback
            let color = 'green';
            if (feedback) {
                const isStartCorrect = feedback.correctLandmarks.includes(start);
                const isEndCorrect = feedback.correctLandmarks.includes(end);
                
                if (!isStartCorrect || !isEndCorrect) {
                    color = 'red';
                }
            }
            
            // Draw line between landmarks
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(
                startLandmark.x * this.canvas.width,
                startLandmark.y * this.canvas.height
            );
            this.ctx.lineTo(
                endLandmark.x * this.canvas.width,
                endLandmark.y * this.canvas.height
            );
            this.ctx.stroke();
        }
    }

    start(exercise, evaluator) {
        if (!this.isRunning) {
            this.camera.start();
            this.isRunning = true;
        }
        
        this.currentExercise = exercise;
        this.exerciseEvaluator = evaluator;
        
        document.getElementById('exercise-status').textContent = `Exercise: ${exercise}`;
        document.getElementById('startSquats').disabled = true;
        document.getElementById('startPushups').disabled = true;
        document.getElementById('stopExercise').disabled = false;
    }

    stop() {
        if (this.isRunning) {
            this.camera.stop();
            this.isRunning = false;
            this.currentExercise = null;
            this.exerciseEvaluator = null;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            document.getElementById('exercise-status').textContent = 'Select an exercise to begin';
            document.getElementById('form-feedback').textContent = '';
            document.getElementById('rep-counter').textContent = 'Reps: 0';
            
            document.getElementById('startSquats').disabled = false;
            document.getElementById('startPushups').disabled = false;
            document.getElementById('stopExercise').disabled = true;
        }
    }

    getLandmarks() {
        return this.landmarks;
    }
}