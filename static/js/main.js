// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Create instances of classes
    const mediaPipeHandler = new MediaPipeHandler();
    const threeVisualization = new ThreeVisualization();
    
    // Initialize MediaPipe and Three.js
    await mediaPipeHandler.init();
    threeVisualization.init();
    
    // Event listeners for buttons
    document.getElementById('startSquats').addEventListener('click', () => {
        const squatEvaluator = new SquatEvaluator();
        mediaPipeHandler.start('Squats', squatEvaluator);
        
        // Set up animation frame loop for Three.js visualization
        function updateVisualization() {
            const landmarks = mediaPipeHandler.getLandmarks();
            const feedback = squatEvaluator.getFeedback();
            
            if (landmarks && landmarks.length > 0 && feedback) {
                threeVisualization.updateVisualization(landmarks, feedback);
            }
            
            if (mediaPipeHandler.isRunning) {
                requestAnimationFrame(updateVisualization);
            }
        }
        
        updateVisualization();
    });
    
    document.getElementById('startPushups').addEventListener('click', () => {
        const pushupEvaluator = new PushupEvaluator();
        mediaPipeHandler.start('Push-Ups', pushupEvaluator);
        
        // Set up animation frame loop for Three.js visualization
        function updateVisualization() {
            const landmarks = mediaPipeHandler.getLandmarks();
            const feedback = pushupEvaluator.getFeedback();
            
            if (landmarks && landmarks.length > 0 && feedback) {
                threeVisualization.updateVisualization(landmarks, feedback);
            }
            
            if (mediaPipeHandler.isRunning) {
                requestAnimationFrame(updateVisualization);
            }
        }
        
        updateVisualization();
    });
    
    document.getElementById('stopExercise').addEventListener('click', () => {
        mediaPipeHandler.stop();
        threeVisualization.clearVisualization();
    });
    
    // Handle visibility change to stop camera when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && mediaPipeHandler.isRunning) {
            mediaPipeHandler.stop();
            threeVisualization.clearVisualization();
        }
    });
});