// class SquatEvaluator {
//     constructor() {
//         this.phase = 'standing';  // 'standing', 'descending', 'bottom', 'ascending'
//         this.repCount = 0;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
//         this.lastFeedbackUpdate = Date.now();
//         this.thresholds = {
//             kneeAngleMin: 70,      // Minimum knee bend (degrees)
//             kneeAngleMax: 170,     // Maximum knee extension (degrees)
//             hipAngleMin: 50,       // Minimum hip bend (degrees)
//             backAngleMax: 45,      // Maximum forward lean (degrees)
//             ankleAngleMin: 60,     // Minimum ankle dorsiflexion (degrees)
//             feedbackCooldown: 500  // Milliseconds between feedback updates
//         };
//     }

//     // Calculate angle between three points
//     calculateAngle(a, b, c) {
//         const ab = {
//             x: b.x - a.x,
//             y: b.y - a.y,
//             z: b.z - a.z
//         };
        
//         const bc = {
//             x: c.x - b.x,
//             y: c.y - b.y,
//             z: c.z - b.z
//         };
        
//         // Calculate dot product
//         const dotProduct = ab.x * bc.x + ab.y * bc.y + ab.z * bc.z;
        
//         // Calculate magnitudes
//         const abMagnitude = Math.sqrt(ab.x * ab.x + ab.y * ab.y + ab.z * ab.z);
//         const bcMagnitude = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z);
        
//         // Calculate angle in radians
//         const angleRad = Math.acos(dotProduct / (abMagnitude * bcMagnitude));
        
//         // Convert to degrees
//         return angleRad * (180 / Math.PI);
//     }

//     // Calculate angle of a segment with respect to vertical
//     calculateVerticalAngle(a, b) {
//         const dx = b.x - a.x;
//         const dy = b.y - a.y;
        
//         // Calculate angle in radians
//         const angleRad = Math.atan2(dx, dy);
        
//         // Convert to degrees (0 is vertical, 90 is horizontal)
//         return Math.abs(angleRad * (180 / Math.PI));
//     }

//     evaluate(landmarks) {
//         if (!landmarks || landmarks.length < 33) {
//             return;
//         }
        
//         // Check if enough time has passed since last feedback update
//         const now = Date.now();
//         if (now - this.lastFeedbackUpdate < this.thresholds.feedbackCooldown) {
//             return;
//         }
        
//         this.lastFeedbackUpdate = now;
        
//         // Reset feedback
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
        
//         // Consider all landmarks correct initially
//         for (let i = 0; i < landmarks.length; i++) {
//             this.feedback.correctLandmarks.push(i);
//         }
        
//         // Get relevant landmarks
//         const hip_left = landmarks[23];
//         const hip_right = landmarks[24];
//         const knee_left = landmarks[25];
//         const knee_right = landmarks[26];
//         const ankle_left = landmarks[27];
//         const ankle_right = landmarks[28];
//         const shoulder_left = landmarks[11];
//         const shoulder_right = landmarks[12];
        
//         // Calculate angles
//         const knee_angle_left = this.calculateAngle(hip_left, knee_left, ankle_left);
//         const knee_angle_right = this.calculateAngle(hip_right, knee_right, ankle_right);
//         const hip_angle_left = this.calculateAngle(shoulder_left, hip_left, knee_left);
//         const hip_angle_right = this.calculateAngle(shoulder_right, hip_right, knee_right);
//         const back_angle_left = this.calculateVerticalAngle(shoulder_left, hip_left);
//         const back_angle_right = this.calculateVerticalAngle(shoulder_right, hip_right);
//         const ankle_angle_left = this.calculateAngle(knee_left, ankle_left, {x: ankle_left.x + 0.1, y: ankle_left.y, z: ankle_left.z});
//         const ankle_angle_right = this.calculateAngle(knee_right, ankle_right, {x: ankle_right.x + 0.1, y: ankle_right.y, z: ankle_right.z});
        
//         // Calculate average angles for both sides
//         const knee_angle = (knee_angle_left + knee_angle_right) / 2;
//         const hip_angle = (hip_angle_left + hip_angle_right) / 2;
//         const back_angle = (back_angle_left + back_angle_right) / 2;
//         const ankle_angle = (ankle_angle_left + ankle_angle_right) / 2;
        
//         // Determine squat phase based on knee angle
//         if (knee_angle > 160) {
//             // Standing position
//             if (this.phase === 'ascending') {
//                 this.repCount++;
//                 document.getElementById('rep-counter').textContent = `Reps: ${this.repCount}`;
//             }
//             this.phase = 'standing';
//         } else if (knee_angle < 90) {
//             // Bottom position
//             this.phase = 'bottom';
//         } else if (this.phase === 'standing' || this.phase === 'descending') {
//             // Descending phase
//             this.phase = 'descending';
//         } else {
//             // Ascending phase
//             this.phase = 'ascending';
//         }
        
//         // Update status display
//         document.getElementById('exercise-status').textContent = `Exercise: Squats (${this.phase})`;
        
//         // Evaluate form based on phase
//         if (this.phase === 'descending' || this.phase === 'bottom') {
//             // Check knee angle
//             if (knee_angle > this.thresholds.kneeAngleMin && this.phase === 'bottom') {
//                 this.removeFromCorrectLandmarks([25, 26]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 25,
//                     message: 'Bend your knees more'
//                 });
//             }
            
//             // Check hip angle
//             if (hip_angle > this.thresholds.hipAngleMin) {
//                 this.removeFromCorrectLandmarks([23, 24]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 23,
//                     message: 'Hinge at your hips more'
//                 });
//             }
            
//             // Check back angle
//             if (back_angle > this.thresholds.backAngleMax) {
//                 this.removeFromCorrectLandmarks([11, 12, 23, 24]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 11,
//                     message: 'Keep your back more upright'
//                 });
//             }
            
//             // Check ankle dorsiflexion
//             if (ankle_angle < this.thresholds.ankleAngleMin) {
//                 this.removeFromCorrectLandmarks([27, 28]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 27,
//                     message: 'Push knees forward over toes'
//                 });
//             }
//         } else if (this.phase === 'ascending') {
//             // Check for knee valgus (knees caving in)
//             if (knee_left.x > hip_left.x || knee_right.x < hip_right.x) {
//                 this.removeFromCorrectLandmarks([25, 26]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 25,
//                     message: 'Keep knees in line with toes'
//                 });
//             }
            
//             // Check back angle
//             if (back_angle > this.thresholds.backAngleMax) {
//                 this.removeFromCorrectLandmarks([11, 12, 23, 24]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 11,
//                     message: 'Keep your chest up'
//                 });
//             }
//         }
        
//         // Update feedback display
//         this.updateFeedbackDisplay();
        
//         return this.feedback;
//     }

//     removeFromCorrectLandmarks(indices) {
//         indices.forEach(index => {
//             const position = this.feedback.correctLandmarks.indexOf(index);
//             if (position !== -1) {
//                 this.feedback.correctLandmarks.splice(position, 1);
//             }
//         });
//     }

//     updateFeedbackDisplay() {
//         const feedbackElement = document.getElementById('form-feedback');
        
//         if (this.feedback.issues.length === 0) {
//             feedbackElement.textContent = 'Good form!';
//             feedbackElement.style.backgroundColor = '#d4edda';
//             feedbackElement.style.color = '#155724';
//         } else {
//             feedbackElement.textContent = this.feedback.issues.map(issue => issue.message).join(' • ');
//             feedbackElement.style.backgroundColor = '#f8d7da';
//             feedbackElement.style.color = '#721c24';
//         }
//     }

//     getFeedback() {
//         return this.feedback;
//     }

//     reset() {
//         this.phase = 'standing';
//         this.repCount = 0;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
//     }
// }


class SquatEvaluator {
    constructor() {
        this.phase = 'standing';  // 'standing', 'descending', 'bottom', 'ascending'
        this.repCount = 0;
        this.feedback = {
            correctLandmarks: [],
            issues: []
        };
        this.lastFeedbackUpdate = Date.now();
        this.wasInBottom = false;

        this.thresholds = {
            kneeAngleMin: 70,
            kneeAngleMax: 170,
            hipAngleMin: 50,
            backAngleMax: 45,
            ankleAngleMin: 60,
            feedbackCooldown: 500 // milliseconds
        };
    }

    calculateAngle(a, b, c) {
        const ab = {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        };

        const bc = {
            x: c.x - b.x,
            y: c.y - b.y,
            z: c.z - b.z
        };

        const dotProduct = ab.x * bc.x + ab.y * bc.y + ab.z * bc.z;
        const abMag = Math.sqrt(ab.x ** 2 + ab.y ** 2 + ab.z ** 2);
        const bcMag = Math.sqrt(bc.x ** 2 + bc.y ** 2 + bc.z ** 2);

        const angleRad = Math.acos(dotProduct / (abMag * bcMag));
        return angleRad * (180 / Math.PI);
    }

    calculateVerticalAngle(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const angleRad = Math.atan2(dx, dy);
        return Math.abs(angleRad * (180 / Math.PI));
    }

    evaluate(landmarks) {
        if (!landmarks || landmarks.length < 33) return;

        const now = Date.now();
        if (now - this.lastFeedbackUpdate < this.thresholds.feedbackCooldown) return;
        this.lastFeedbackUpdate = now;

        this.feedback = {
            correctLandmarks: [],
            issues: []
        };

        for (let i = 0; i < landmarks.length; i++) {
            this.feedback.correctLandmarks.push(i);
        }

        const hip_left = landmarks[23];
        const hip_right = landmarks[24];
        const knee_left = landmarks[25];
        const knee_right = landmarks[26];
        const ankle_left = landmarks[27];
        const ankle_right = landmarks[28];
        const shoulder_left = landmarks[11];
        const shoulder_right = landmarks[12];

        const knee_angle_left = this.calculateAngle(hip_left, knee_left, ankle_left);
        const knee_angle_right = this.calculateAngle(hip_right, knee_right, ankle_right);
        const hip_angle_left = this.calculateAngle(shoulder_left, hip_left, knee_left);
        const hip_angle_right = this.calculateAngle(shoulder_right, hip_right, knee_right);
        const back_angle_left = this.calculateVerticalAngle(shoulder_left, hip_left);
        const back_angle_right = this.calculateVerticalAngle(shoulder_right, hip_right);

        // Estimate ankle dorsiflexion with static vertical point
        const ankle_virtual_point = (ankle) => ({
            x: ankle.x,
            y: ankle.y - 0.1,
            z: ankle.z
        });
        const ankle_angle_left = this.calculateAngle(knee_left, ankle_left, ankle_virtual_point(ankle_left));
        const ankle_angle_right = this.calculateAngle(knee_right, ankle_right, ankle_virtual_point(ankle_right));

        const knee_angle = (knee_angle_left + knee_angle_right) / 2;
        const hip_angle = (hip_angle_left + hip_angle_right) / 2;
        const back_angle = (back_angle_left + back_angle_right) / 2;
        const ankle_angle = (ankle_angle_left + ankle_angle_right) / 2;

        // Squat Phase Detection
        if (knee_angle > 160) {
            if (this.phase === 'ascending' && this.wasInBottom) {
                this.repCount++;
                document.getElementById('rep-counter').textContent = `Reps: ${this.repCount}`;
                this.wasInBottom = false;
            }
            this.phase = 'standing';
        } else if (knee_angle < 90) {
            this.phase = 'bottom';
            this.wasInBottom = true;
        } else if (this.phase === 'bottom') {
            this.phase = 'ascending';
        } else if (this.phase === 'standing') {
            this.phase = 'descending';
        }

        document.getElementById('exercise-status').textContent = `Exercise: Squats (${this.phase})`;

        // -------- FORM CHECKING ----------
        if (this.phase === 'descending' || this.phase === 'bottom') {
            if (knee_angle > this.thresholds.kneeAngleMin && this.phase === 'bottom') {
                this.removeFromCorrectLandmarks([25, 26]);
                this.feedback.issues.push({
                    landmarkIndex: 25,
                    message: 'Bend your knees more'
                });
            }

            if (hip_angle > this.thresholds.hipAngleMin) {
                this.removeFromCorrectLandmarks([23, 24]);
                this.feedback.issues.push({
                    landmarkIndex: 23,
                    message: 'Hinge at your hips more'
                });
            }

            if (back_angle > this.thresholds.backAngleMax) {
                this.removeFromCorrectLandmarks([11, 12, 23, 24]);
                this.feedback.issues.push({
                    landmarkIndex: 11,
                    message: 'Keep your back more upright'
                });
            }

            if (ankle_angle < this.thresholds.ankleAngleMin) {
                this.removeFromCorrectLandmarks([27, 28]);
                this.feedback.issues.push({
                    landmarkIndex: 27,
                    message: 'Push knees forward over toes'
                });
            }
        }

        if (this.phase === 'ascending') {
            if (knee_left.x > hip_left.x || knee_right.x < hip_right.x) {
                this.removeFromCorrectLandmarks([25, 26]);
                this.feedback.issues.push({
                    landmarkIndex: 25,
                    message: 'Keep knees in line with toes'
                });
            }

            if (back_angle > this.thresholds.backAngleMax) {
                this.removeFromCorrectLandmarks([11, 12, 23, 24]);
                this.feedback.issues.push({
                    landmarkIndex: 11,
                    message: 'Keep your chest up'
                });
            }
        }

        this.updateFeedbackDisplay();
        return this.feedback;
    }

    removeFromCorrectLandmarks(indices) {
        indices.forEach(index => {
            const pos = this.feedback.correctLandmarks.indexOf(index);
            if (pos !== -1) {
                this.feedback.correctLandmarks.splice(pos, 1);
            }
        });
    }

    updateFeedbackDisplay() {
        const feedbackElement = document.getElementById('form-feedback');

        if (this.feedback.issues.length === 0) {
            feedbackElement.textContent = 'Good form!';
            feedbackElement.style.backgroundColor = '#d4edda';
            feedbackElement.style.color = '#155724';
        } else {
            feedbackElement.textContent = this.feedback.issues.map(i => i.message).join(' • ');
            feedbackElement.style.backgroundColor = '#f8d7da';
            feedbackElement.style.color = '#721c24';
        }
    }

    getFeedback() {
        return this.feedback;
    }

    reset() {
        this.phase = 'standing';
        this.repCount = 0;
        this.wasInBottom = false;
        this.feedback = {
            correctLandmarks: [],
            issues: []
        };
    }
}
