class ThreeVisualization {
    constructor() {
        this.container = document.getElementById('three-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.textLabels = [];
        this.arrows = [];
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,  // Transparent background
            antialias: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    // Convert MediaPipe coordinates to Three.js coordinates
    convertCoordinates(landmark) {
        // MediaPipe uses normalized coordinates (0-1)
        // We need to convert them to Three.js coordinate system
        return {
            x: (landmark.x - 0.5) * 10,  // Center and scale
            y: -(landmark.y - 0.5) * 10,  // Flip Y axis and center
            z: -landmark.z * 10  // Scale Z
        };
    }

    // Create text label at position
    createTextLabel(text, position, color = 0xff0000) {
        // Create canvas for text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        // Draw background
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw border
        context.strokeStyle = color === 0xff0000 ? 'red' : 'green';
        context.lineWidth = 4;
        context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
        
        // Draw text
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Wrap text
        const words = text.split(' ');
        let line = '';
        let y = 40;
        const lineHeight = 30;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > canvas.width - 20 && i > 0) {
                context.fillText(line, canvas.width / 2, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, canvas.width / 2, y);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create sprite material
        const material = new THREE.SpriteMaterial({ map: texture });
        
        // Create sprite
        const sprite = new THREE.Sprite(material);
        sprite.position.set(position.x, position.y, position.z);
        sprite.scale.set(2, 1, 1);
        
        this.scene.add(sprite);
        return sprite;
    }

    // Create arrow pointing to a problem area
    createArrow(from, to, color = 0xff0000) {
        // Create arrow helper
        const direction = new THREE.Vector3().subVectors(to, from).normalize();
        const length = 2;
        const headLength = 0.5;
        const headWidth = 0.3;
        
        const arrowHelper = new THREE.ArrowHelper(
            direction, from, length, color, headLength, headWidth
        );
        
        this.scene.add(arrowHelper);
        return arrowHelper;
    }

    // Update visualization based on feedback
    updateVisualization(landmarks, feedback) {
        // Remove existing labels and arrows
        this.clearVisualization();
        
        if (!feedback || !feedback.issues || feedback.issues.length === 0) {
            return;
        }
        
        // Process each issue
        feedback.issues.forEach(issue => {
            if (!issue.landmarkIndex || issue.landmarkIndex < 0 || !landmarks[issue.landmarkIndex]) {
                return;
            }
            
            const landmark = landmarks[issue.landmarkIndex];
            const position = this.convertCoordinates(landmark);
            
            // Create text label
            const label = this.createTextLabel(issue.message, {
                x: position.x + 2,  // Offset to avoid overlap
                y: position.y + 1,
                z: position.z
            });
            this.textLabels.push(label);
            
            // Create arrow pointing to the problem area
            const arrow = this.createArrow(
                new THREE.Vector3(position.x + 1.5, position.y + 0.5, position.z),
                new THREE.Vector3(position.x, position.y, position.z)
            );
            this.arrows.push(arrow);
        });
    }

    clearVisualization() {
        // Remove text labels
        this.textLabels.forEach(label => {
            this.scene.remove(label);
        });
        this.textLabels = [];
        
        // Remove arrows
        this.arrows.forEach(arrow => {
            this.scene.remove(arrow);
        });
        this.arrows = [];
    }
}