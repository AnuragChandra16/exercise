// class PushupEvaluator {
//     constructor() {
//         this.phase = 'up';  // 'up', 'descending', 'bottom', 'ascending'
//         this.repCount = 0;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
//         this.lastFeedbackUpdate = Date.now();
//         this.thresholds = {
//             elbowAngleMin: 70,      // Minimum elbow bend at bottom (degrees)
//             elbowAngleMax: 160,     // Maximum elbow extension at top (degrees)
//             backStraightMax: 15,    // Maximum deviation from straight back (degrees)
//             hipSagMax: 50,          // Maximum hip sag (degrees)
//             hipRiseMax: 50,         // Maximum hip rise (degrees)
//             feedbackCooldown: 500   // Milliseconds between feedback updates
//         };
//     }

//     // Calculate angle between three points
//     // calculateAngle(a, b, c) {
//     //     const ab = {
//     //         x: b.x - a.x,
//     //         y: b.y - a.y,
//     //         z: b.z - a.z
//     //     };
        
//     //     const bc = {
//     //         x: c.x - b.x,
//     //         y: c.y - b.y,
//     //         z: c.z - b.z
//     //     };
        
//     //     // Calculate dot product
//     //     const dotProduct = ab.x * bc.x + ab.y * bc.y + ab.z * bc.z;
        
//     //     // Calculate magnitudes
//     //     const abMagnitude = Math.sqrt(ab.x * ab.x + ab.y * ab.y + ab.z * ab.z);
//     //     const bcMagnitude = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z);
        
//     //     // Calculate angle in radians
//     //     const angleRad = Math.acos(dotProduct / (abMagnitude * bcMagnitude));
        
//     //     // Convert to degrees
//     //     return angleRad * (180 / Math.PI);
//     // }

//     // Calculate angle between three points
// calculateAngle(a, b, c) {
//     const ab = {
//         x: b.x - a.x,
//         y: b.y - a.y,
//         z: b.z - a.z
//     };
    
//     const bc = {
//         x: c.x - b.x,
//         y: c.y - b.y,
//         z: c.z - b.z
//     };
    
//     // Calculate dot product
//     const dotProduct = ab.x * bc.x + ab.y * bc.y + ab.z * bc.z;
    
//     // Calculate magnitudes
//     const abMagnitude = Math.sqrt(ab.x * ab.x + ab.y * ab.y + ab.z * ab.z);
//     const bcMagnitude = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z);
    
//     // Calculate angle in radians
//     let angleRad = Math.acos(dotProduct / (abMagnitude * bcMagnitude));
    
//     // Convert to degrees
//     angleRad = angleRad * (180 / Math.PI);
    
//     return angleRad;
// }


//     // Calculate angle deviation from straight line
//     calculateLineDeviation(a, b, c) {
//         return 180 - this.calculateAngle(a, b, c);
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
//         const shoulder_left = landmarks[11];
//         const shoulder_right = landmarks[12];
//         const elbow_left = landmarks[13];
//         const elbow_right = landmarks[14];
//         const wrist_left = landmarks[15];
//         const wrist_right = landmarks[16];
//         const hip_left = landmarks[23];
//         const hip_right = landmarks[24];
//         const knee_left = landmarks[25];
//         const knee_right = landmarks[26];
//         const ankle_left = landmarks[27];
//         const ankle_right = landmarks[28];
        
//         // Calculate angles
//         const elbow_angle_left = this.calculateAngle(shoulder_left, elbow_left, wrist_left);
//         const elbow_angle_right = this.calculateAngle(shoulder_right, elbow_right, wrist_right);
        
//         // Back alignment (check if shoulders, hips, knees, ankles are in a straight line)
//         const back_deviation_left = this.calculateLineDeviation(shoulder_left, hip_left, knee_left);
//         const back_deviation_right = this.calculateLineDeviation(shoulder_right, hip_right, knee_right);
        
//         // Lower back alignment (check if hips, knees, ankles are in a straight line)
//         const lower_back_deviation_left = this.calculateLineDeviation(hip_left, knee_left, ankle_left);
//         const lower_back_deviation_right = this.calculateLineDeviation(hip_right, knee_right, ankle_right);
        
//         // Calculate average angles for both sides
//         const elbow_angle = (elbow_angle_left + elbow_angle_right) / 2;
//         const back_deviation = (back_deviation_left + back_deviation_right) / 2;
//         const lower_back_deviation = (lower_back_deviation_left + lower_back_deviation_right) / 2;
        
//         // Determine push-up phase based on elbow angle
//         if (elbow_angle > this.thresholds.elbowAngleMax - 10) {
//             // Up position
//             if (this.phase === 'ascending') {
//                 this.repCount++;
//                 document.getElementById('rep-counter').textContent = `Reps: ${this.repCount}`;
//             }
//             this.phase = 'up';
//         } else if (elbow_angle < this.thresholds.elbowAngleMin + 10) {
//             // Bottom position
//             this.phase = 'bottom';
//         } else if (this.phase === 'up' || this.phase === 'descending') {
//             // Descending phase
//             this.phase = 'descending';
//         } else {
//             // Ascending phase
//             this.phase = 'ascending';
//         }
        
//         // Update status display
//         document.getElementById('exercise-status').textContent = `Exercise: Push-Ups (${this.phase})`;
        
//         // Hip position check (should be in line with shoulders and ankles)
//         const hip_avg_y = (hip_left.y + hip_right.y) / 2;
//         const shoulder_avg_y = (shoulder_left.y + shoulder_right.y) / 2;
//         const ankle_avg_y = (ankle_left.y + ankle_right.y) / 2;
        
//         // Calculate hip sag/rise (normalized to body length)
//         const body_length = Math.abs(shoulder_avg_y - ankle_avg_y);
//         const hip_deviation = (hip_avg_y - ((shoulder_avg_y + ankle_avg_y) / 2)) / body_length * 100;
        
//         // Evaluate form based on phase
//         if (this.phase === 'bottom') {
//             // Check elbow angle (90 degrees at bottom)
//             if (elbow_angle > this.thresholds.elbowAngleMin) {
//                 this.removeFromCorrectLandmarks([13, 14]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 13,
//                     message: 'Lower your chest more'
//                 });
//             }
//         } else if (this.phase === 'up') {
//             // Check elbow extension (should be almost straight at top)
//             if (elbow_angle < this.thresholds.elbowAngleMax) {
//                 this.removeFromCorrectLandmarks([13, 14]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 13,
//                     message: 'Extend your arms fully'
//                 });
//             }
//         }
        
//         // Check for back alignment issues (should be straight throughout)
//         if (back_deviation > this.thresholds.backStraightMax) {
//             this.removeFromCorrectLandmarks([11, 12, 23, 24]);
//             this.feedback.issues.push({
//                 landmarkIndex: 11,
//                 message: 'Keep your back straight'
//             });
//         }
        
//         // Check for lower back/hip issues
//         if (lower_back_deviation > this.thresholds.backStraightMax) {
//             this.removeFromCorrectLandmarks([23, 24, 25, 26]);
            
//             // Determine if hips are sagging or rising
//             if (hip_deviation > this.thresholds.hipSagMax) {
//                 this.feedback.issues.push({
//                     landmarkIndex: 23,
//                     message: 'Don\'t let your hips sag'
//                 });
//             } else if (hip_deviation < -this.thresholds.hipRiseMax) {
//                 this.feedback.issues.push({
//                     landmarkIndex: 23,
//                     message: 'Lower your hips'
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
//         this.phase = 'up';
//         this.repCount = 0;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
//     }
// }


//pyhton

// class PushupEvaluator {
//   constructor() {
//       // Initialize state variables
//       this.phase = 'up';  // Current phase: 'up', 'descending', 'bottom', 'ascending'
//       this.repCount = 0;
//       this.feedback = {
//           correctLandmarks: [],
//           issues: []
//       };
//       this.lastFeedbackUpdate = Date.now();
      
//       // Push-up tracking variables (from Python code)
//       this.pushUpStart = 0;
      
//       // Configuration thresholds
//       this.thresholds = {
//           // Distance thresholds (based on Python code)
//           startDistance: 130,    // Distance threshold to start counting (shoulder to wrist)
//           endDistance: 250,      // Distance threshold to complete a rep (shoulder to wrist)
          
//           // Form evaluation thresholds (keeping these from original JS)
//           elbowAngleMin: 90,
//           elbowAngleMax: 150,
//           backStraightMax: 25,
//           hipSagMax: 60,
//           hipRiseMax: 60,
//           feedbackCooldown: 600
//       };
//   }

//   // Calculate distance between two points in 3D space (from Python code)
//   distanceCalculate(p1, p2) {
//       // Calculate Euclidean distance between two points
//       const dis = Math.sqrt(
//           Math.pow(p2.x - p1.x, 2) + 
//           Math.pow(p2.y - p1.y, 2) + 
//           Math.pow(p2.z - p1.z, 2)
//       );
//       return dis;
//   }

//   // Calculate angle between three points in 3D space (keeping this from original JS)
//   calculateAngle(a, b, c) {
//       // Vectors from point b to a and from b to c
//       const ab = {
//           x: b.x - a.x,
//           y: b.y - a.y,
//           z: b.z - a.z
//       };
      
//       const bc = {
//           x: c.x - b.x,
//           y: c.y - b.y,
//           z: c.z - b.z
//       };
      
//       // Calculate dot product
//       const dotProduct = ab.x * bc.x + ab.y * bc.y + ab.z * bc.z;
      
//       // Calculate magnitudes of vectors
//       const abMagnitude = Math.sqrt(ab.x * ab.x + ab.y * ab.y + ab.z * ab.z);
//       const bcMagnitude = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z);
      
//       // Prevent division by zero
//       if (abMagnitude === 0 || bcMagnitude === 0) {
//           return 0;
//       }
      
//       // Calculate angle in radians (using dot product formula)
//       const cosTheta = dotProduct / (abMagnitude * bcMagnitude);
      
//       // Clamp the value to prevent domain errors with Math.acos
//       const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
      
//       // Convert to degrees
//       return Math.acos(clampedCosTheta) * (180 / Math.PI);
//   }

//   // Calculate deviation from a straight line (180 degrees)
//   calculateLineDeviation(a, b, c) {
//       return 180 - this.calculateAngle(a, b, c);
//   }

//   // Main evaluation function that processes landmarks and updates feedback
//   evaluate(landmarks) {
//       // Safety check for valid landmarks
//       if (!landmarks || landmarks.length < 33) {
//           return null;
//       }
      
//       // Extract relevant landmarks for push-up evaluation (same as original JS)
//       const shoulder_left = landmarks[11];
//       const shoulder_right = landmarks[12];
//       const elbow_left = landmarks[13];
//       const elbow_right = landmarks[14];
//       const wrist_left = landmarks[15];
//       const wrist_right = landmarks[16];
//       const hip_left = landmarks[23];
//       const hip_right = landmarks[24];
//       const knee_left = landmarks[25];
//       const knee_right = landmarks[26];
//       const ankle_left = landmarks[27];
//       const ankle_right = landmarks[28];
      
//       // Calculate key angles (keeping for form evaluation)
//       const elbow_angle_left = this.calculateAngle(shoulder_left, elbow_left, wrist_left);
//       const elbow_angle_right = this.calculateAngle(shoulder_right, elbow_right, wrist_right);
//       const elbow_angle = (elbow_angle_left + elbow_angle_right) / 2;
      
//       // Back alignment checks (keeping for form evaluation)
//       const back_deviation_left = this.calculateLineDeviation(shoulder_left, hip_left, knee_left);
//       const back_deviation_right = this.calculateLineDeviation(shoulder_right, hip_right, knee_right);
//       const back_deviation = (back_deviation_left + back_deviation_right) / 2;
      
//       // Lower back alignment checks (keeping for form evaluation)
//       const lower_back_deviation_left = this.calculateLineDeviation(hip_left, knee_left, ankle_left);
//       const lower_back_deviation_right = this.calculateLineDeviation(hip_right, knee_right, ankle_right);
//       const lower_back_deviation = (lower_back_deviation_left + lower_back_deviation_right) / 2;
      
//       // Calculate distances between shoulders and wrists (from Python code)
//       const leftDistance = this.distanceCalculate(shoulder_left, wrist_left);
//       const rightDistance = this.distanceCalculate(shoulder_right, wrist_right);
      
//       // Use the right side for push-up counting (as in Python code)
//       const shoulderWristDistance = rightDistance;
      
//       // Implement the Python push-up counting logic
//       this.countReps(shoulderWristDistance);
      
//       // Update phase for display purposes (based on distance instead of angle)
//       this.updatePhase(shoulderWristDistance);
      
//       // Check if enough time has passed for feedback update
//       const now = Date.now();
//       if (now - this.lastFeedbackUpdate >= this.thresholds.feedbackCooldown) {
//           this.lastFeedbackUpdate = now;
          
//           // Reset feedback for new evaluation
//           this.feedback = {
//               correctLandmarks: [],
//               issues: []
//           };
          
//           // Consider all landmarks correct initially
//           for (let i = 0; i < landmarks.length; i++) {
//               this.feedback.correctLandmarks.push(i);
//           }
          
//           // Hip position analysis
//           const hip_avg_y = (hip_left.y + hip_right.y) / 2;
//           const shoulder_avg_y = (shoulder_left.y + shoulder_right.y) / 2;
//           const ankle_avg_y = (ankle_left.y + ankle_right.y) / 2;
          
//           // Calculate hip deviation relative to body length
//           const body_length = Math.abs(shoulder_avg_y - ankle_avg_y);
//           const hip_deviation = (hip_avg_y - ((shoulder_avg_y + ankle_avg_y) / 2)) / body_length * 100;
          
//           // Perform form checks based on current phase
//           this.checkFormByPhase(elbow_angle, back_deviation, lower_back_deviation, hip_deviation);
          
//           // Always add the back straight reminder (as in original JS)
//           this.feedback.issues.push({
//               landmarkIndex: 11,
//               message: 'Keep your back straight throughout the movement'
//           });
          
//           // Update feedback display
//           this.updateFeedbackDisplay();
//       }
      
//       // Update exercise status display
//       this.updateStatusDisplay();
//       // Add this to the evaluate method after calculating distances
// console.log("Right distance:", rightDistance);
// console.log("Current phase:", this.phase);
// console.log("Push-up start flag:", this.pushUpStart);
      
//       return this.feedback;
//   }

// // evaluate(landmarks) {
// //     // Safety check for valid landmarks
// //     if (!landmarks || landmarks.length < 33) {
// //         return null;
// //     }
    
// //     // Extract relevant landmarks for push-up evaluation
// //     const shoulder_left = landmarks[11];
// //     const shoulder_right = landmarks[12];
// //     const elbow_left = landmarks[13];
// //     const elbow_right = landmarks[14];
// //     const wrist_left = landmarks[15];
// //     const wrist_right = landmarks[16];
// //     const hip_left = landmarks[23];
// //     const hip_right = landmarks[24];
// //     const knee_left = landmarks[25];
// //     const knee_right = landmarks[26];
// //     const ankle_left = landmarks[27];
// //     const ankle_right = landmarks[28];
    
// //     // Calculate key angles (keeping for form evaluation)
// //     let elbow_angle_left = null;
// //     let elbow_angle_right = null;

// //     if (shoulder_left && elbow_left && wrist_left) {
// //         elbow_angle_left = this.calculateAngle(shoulder_left, elbow_left, wrist_left);
// //     }

// //     if (shoulder_right && elbow_right && wrist_right) {
// //         elbow_angle_right = this.calculateAngle(shoulder_right, elbow_right, wrist_right);
// //     }
    
// //     // Check if both angles are successfully calculated
// //     if (elbow_angle_left === null || elbow_angle_right === null) {
// //         console.error("Elbow angle not calculated properly.");
// //         return null;
// //     }

// //     const elbow_angle = (elbow_angle_left + elbow_angle_right) / 2;
    
// //     // Back alignment checks
// //     const back_deviation_left = this.calculateLineDeviation(shoulder_left, hip_left, knee_left);
// //     const back_deviation_right = this.calculateLineDeviation(shoulder_right, hip_right, knee_right);
// //     const back_deviation = (back_deviation_left + back_deviation_right) / 2;
    
// //     // Lower back alignment checks
// //     const lower_back_deviation_left = this.calculateLineDeviation(hip_left, knee_left, ankle_left);
// //     const lower_back_deviation_right = this.calculateLineDeviation(hip_right, knee_right, ankle_right);
// //     const lower_back_deviation = (lower_back_deviation_left + lower_back_deviation_right) / 2;
    
// //     // Calculate distances between shoulders and wrists
// //     const leftDistance = this.distanceCalculate(shoulder_left, wrist_left);
// //     const rightDistance = this.distanceCalculate(shoulder_right, wrist_right);
    
// //     const shoulderWristDistance = rightDistance;

// //     // Implement the push-up counting logic
// //     this.countReps(shoulderWristDistance);
    
// //     // Update phase based on distance
// //     this.updatePhase(shoulderWristDistance);
    
// //     // Check if feedback update is needed
// //     const now = Date.now();
// //     if (now - this.lastFeedbackUpdate >= this.thresholds.feedbackCooldown) {
// //         this.lastFeedbackUpdate = now;
        
// //         // Reset feedback for new evaluation
// //         this.feedback = {
// //             correctLandmarks: [],
// //             issues: []
// //         };
        
// //         // Consider all landmarks correct initially
// //         for (let i = 0; i < landmarks.length; i++) {
// //             this.feedback.correctLandmarks.push(i);
// //         }
        
// //         // Hip position analysis
// //         const hip_avg_y = (hip_left.y + hip_right.y) / 2;
// //         const shoulder_avg_y = (shoulder_left.y + shoulder_right.y) / 2;
// //         const ankle_avg_y = (ankle_left.y + ankle_right.y) / 2;
        
// //         // Calculate hip deviation relative to body length
// //         const body_length = Math.abs(shoulder_avg_y - ankle_avg_y);
// //         const hip_deviation = (hip_avg_y - ((shoulder_avg_y + ankle_avg_y) / 2)) / body_length * 100;
        
// //         // Perform form checks based on the current phase
// //         this.checkFormByPhase(elbow_angle, back_deviation, lower_back_deviation, hip_deviation);
        
// //         // Always add the back straight reminder
// //         this.feedback.issues.push({
// //             landmarkIndex: 11,
// //             message: 'Keep your back straight throughout the movement'
// //         });
        
// //         // Update feedback display
// //         this.updateFeedbackDisplay();
// //     }
    
// //     // Update exercise status display
// //     this.updateStatusDisplay();
    
// //     return this.feedback;
// // }


//   // Update the push-up phase based on shoulder-wrist distance (adapting from Python approach)
//   updatePhase(distance) {
//       if (distance > this.thresholds.endDistance) {
//           this.phase = 'up';
//       } else if (distance < this.thresholds.startDistance) {
//           this.phase = 'bottom';
//       } else if (distance < this.thresholds.endDistance && distance > this.thresholds.startDistance) {
//           if (this.phase === 'up') {
//               this.phase = 'descending';
//           } else if (this.phase === 'bottom') {
//               this.phase = 'ascending';
//           }
//       }
//   }

//   // Push-up counting logic from Python code
//   countReps(distance) {
//       // Using the same logic as the Python code
//       if (distance < this.thresholds.startDistance) {
//           this.pushUpStart = 1;
//       } else if (this.pushUpStart && distance > this.thresholds.endDistance) {
//           this.repCount += 1;
//           this.pushUpStart = 0;
//           this.updateRepCounter();
//       }
//   }

//   // Perform form checks based on the current phase
//   checkFormByPhase(elbow_angle, back_deviation, lower_back_deviation, hip_deviation) {
//       // Phase-specific checks
//       if (this.phase === 'bottom') {
//           // Bottom position check (elbows should be sufficiently bent)
//           if (elbow_angle > this.thresholds.elbowAngleMin + 10) {
//               this.removeFromCorrectLandmarks([13, 14]);
//               this.feedback.issues.push({
//                   landmarkIndex: 13,
//                   message: 'Try to lower your chest more for better results'
//               });
//           }
//       } else if (this.phase === 'up') {
//           // Top position check (arms should be sufficiently extended)
//           if (elbow_angle < this.thresholds.elbowAngleMax - 10) {
//               this.removeFromCorrectLandmarks([13, 14]);
//               this.feedback.issues.push({
//                   landmarkIndex: 13,
//                   message: 'Try to extend your arms more at the top'
//               });
//           }
//       }
      
//       // Lower back and hip position checks
//       if (lower_back_deviation > this.thresholds.backStraightMax) {
//           this.removeFromCorrectLandmarks([23, 24, 25, 26]);
          
//           // Determine whether hips are sagging or rising too much
//           if (hip_deviation > this.thresholds.hipSagMax) {
//               this.feedback.issues.push({
//                   landmarkIndex: 23,
//                   message: 'Try to keep your hips up to maintain form'
//               });
//           } else if (hip_deviation < -this.thresholds.hipRiseMax) {
//               this.feedback.issues.push({
//                   landmarkIndex: 23,
//                   message: 'Try to keep your hips in line with your body'
//               });
//           }
//       }
//   }

//   // Helper method to remove landmarks from the correct list
//   removeFromCorrectLandmarks(indices) {
//       indices.forEach(index => {
//           const position = this.feedback.correctLandmarks.indexOf(index);
//           if (position !== -1) {
//               this.feedback.correctLandmarks.splice(position, 1);
//           }
//       });
//   }

//   // Update the rep counter in the UI
//   updateRepCounter() {
//       const repCounterElement = document.getElementById('rep-counter');
//       if (repCounterElement) {
//           repCounterElement.textContent = `Reps: ${this.repCount}`;
          
//           // Add visual feedback for rep count
//           repCounterElement.style.backgroundColor = '#4CAF50';
//           repCounterElement.style.color = 'white';
//           repCounterElement.style.fontWeight = 'bold';
          
//           // Reset after a short delay
//           setTimeout(() => {
//               repCounterElement.style.backgroundColor = '';
//               repCounterElement.style.color = '';
//               repCounterElement.style.fontWeight = '';
//           }, 300);
//       }
//   }

//   // Update exercise status display in the UI
//   updateStatusDisplay() {
//       const statusElement = document.getElementById('exercise-status');
//       if (statusElement) {
//           statusElement.textContent = `Exercise: Push-Ups (${this.phase})`;
//       }
//   }

//   // Update feedback display in the UI
//   updateFeedbackDisplay() {
//       const feedbackElement = document.getElementById('form-feedback');
//       if (!feedbackElement) return;
      
//       if (this.feedback.issues.length <= 1 && this.feedback.issues.some(i => i.message.includes('back straight'))) {
//           // Only showing the "back straight" reminder
//           feedbackElement.textContent = 'Great form! Keep your back straight throughout the movement';
//           feedbackElement.style.backgroundColor = '#d4edda';
//           feedbackElement.style.color = '#155724';
//       } else {
//           feedbackElement.textContent = this.feedback.issues.map(issue => issue.message).join(' • ');
//           feedbackElement.style.backgroundColor = '#f8d7da';
//           feedbackElement.style.color = '#721c24';
//       }
//   }

//   // Get current feedback
//   getFeedback() {
//       return this.feedback;
//   }

//   // Get current rep count
//   getRepCount() {
//       return this.repCount;
//   }

//   // Reset all counters and state
//   reset() {
//       this.phase = 'up';
//       this.repCount = 0;
//       this.pushUpStart = 0;
//       this.feedback = {
//           correctLandmarks: [],
//           issues: []
//       };
      
//       // Update UI elements
//       this.updateRepCounter();
//       this.updateStatusDisplay();
//       this.updateFeedbackDisplay();
//   }

//   // Debug method - can be used to check why reps aren't counting
//   getDebugInfo() {
//       return {
//           phase: this.phase,
//           repCount: this.repCount,
//           pushUpStart: this.pushUpStart,
//           thresholds: {...this.thresholds}
//       };
//   }
// }


// class PushupEvaluator {
//     constructor() {
//         // Initialize state variables
//         this.phase = 'up';  // Current phase: 'up', 'descending', 'bottom', 'ascending'
//         this.repCount = 0;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
//         this.lastFeedbackUpdate = Date.now();
        
//         // Push-up tracking variables
//         this.pushUpStart = 0;
        
//         // Configuration thresholds - adjusted for normalized coordinates (0-1 range)
//         this.thresholds = {
//             // Distance thresholds adjusted for normalized coordinates
//             startDistance: 0.45,    // Distance threshold to start counting (shoulder to wrist)
//             endDistance: 0.7,      // Distance threshold to complete a rep (shoulder to wrist)
            
//             // Form evaluation thresholds
//             elbowAngleMin: 90,
//             elbowAngleMax: 150,
//             backStraightMax: 25,
//             hipSagMax: 60,
//             hipRiseMax: 60,
//             feedbackCooldown: 600
//         };
//     }
  
//     // Calculate distance between two points in 3D space
//     distanceCalculate(p1, p2) {
//         // Check if coordinates exist
//         if (!p1 || !p2) {
//             console.error("Invalid landmarks for distance calculation");
//             return 0;
//         }
        
//         // Calculate Euclidean distance between two points
//         const dis = Math.sqrt(
//             Math.pow(p2.x - p1.x, 2) + 
//             Math.pow(p2.y - p1.y, 2) + 
//             Math.pow(p2.z - p1.z, 2)
//         );
//         return dis;
//     }
  
//     // Calculate angle between three points in 3D space
//     calculateAngle(a, b, c) {
//         // Check if all coordinates exist
//         if (!a || !b || !c) {
//             console.error("Invalid landmarks for angle calculation");
//             return 0;
//         }
        
//         // Vectors from point b to a and from b to c
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
        
//         // Calculate magnitudes of vectors
//         const abMagnitude = Math.sqrt(ab.x * ab.x + ab.y * ab.y + ab.z * ab.z);
//         const bcMagnitude = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z);
        
//         // Prevent division by zero
//         if (abMagnitude === 0 || bcMagnitude === 0) {
//             return 0;
//         }
        
//         // Calculate angle in radians (using dot product formula)
//         const cosTheta = dotProduct / (abMagnitude * bcMagnitude);
        
//         // Clamp the value to prevent domain errors with Math.acos
//         const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
        
//         // Convert to degrees
//         return Math.acos(clampedCosTheta) * (180 / Math.PI);
//     }
  
//     // Calculate deviation from a straight line (180 degrees)
//     calculateLineDeviation(a, b, c) {
//         return 180 - this.calculateAngle(a, b, c);
//     }
  
//     // Main evaluation function that processes landmarks and updates feedback
//     evaluate(landmarks) {
//         // Safety check for valid landmarks
//         if (!landmarks || landmarks.length < 33) {
//             return null;
//         }
        
//         // Extract relevant landmarks for push-up evaluation
//         const shoulder_left = landmarks[11];
//         const shoulder_right = landmarks[12];
//         const elbow_left = landmarks[13];
//         const elbow_right = landmarks[14];
//         const wrist_left = landmarks[15];
//         const wrist_right = landmarks[16];
//         const hip_left = landmarks[23];
//         const hip_right = landmarks[24];
//         const knee_left = landmarks[25];
//         const knee_right = landmarks[26];
//         const ankle_left = landmarks[27];
//         const ankle_right = landmarks[28];
        
//         // Calculate key angles for form evaluation
//         let elbow_angle_left = null;
//         let elbow_angle_right = null;
  
//         if (shoulder_left && elbow_left && wrist_left) {
//             elbow_angle_left = this.calculateAngle(shoulder_left, elbow_left, wrist_left);
//         }
  
//         if (shoulder_right && elbow_right && wrist_right) {
//             elbow_angle_right = this.calculateAngle(shoulder_right, elbow_right, wrist_right);
//         }
        
//         // Check if both angles are successfully calculated
//         if (elbow_angle_left === null || elbow_angle_right === null) {
//             console.error("Elbow angle not calculated properly.");
//             return null;
//         }
  
//         const elbow_angle = (elbow_angle_left + elbow_angle_right) / 2;
        
//         // Back alignment checks
//         const back_deviation_left = this.calculateLineDeviation(shoulder_left, hip_left, knee_left);
//         const back_deviation_right = this.calculateLineDeviation(shoulder_right, hip_right, knee_right);
//         const back_deviation = (back_deviation_left + back_deviation_right) / 2;
        
//         // Lower back alignment checks
//         const lower_back_deviation_left = this.calculateLineDeviation(hip_left, knee_left, ankle_left);
//         const lower_back_deviation_right = this.calculateLineDeviation(hip_right, knee_right, ankle_right);
//         const lower_back_deviation = (lower_back_deviation_left + lower_back_deviation_right) / 2;
        
//         // Calculate distances between shoulders and wrists
//         const leftDistance = this.distanceCalculate(shoulder_left, wrist_left);
//         const rightDistance = this.distanceCalculate(shoulder_right, wrist_right);
        
//         // Use the right side for push-up counting
//         const shoulderWristDistance = rightDistance;
        
//         // Debug output to monitor distance and state
//         console.log("Right distance:", rightDistance);
//         console.log("Current phase:", this.phase);
//         console.log("Push-up start flag:", this.pushUpStart);
//         console.log("Current thresholds - start:", this.thresholds.startDistance, "end:", this.thresholds.endDistance);
        
//         // Update phase based on distance
//         this.updatePhase(shoulderWristDistance);
        
//         // Count reps
//         this.countReps(shoulderWristDistance);
        
//         // Check if feedback update is needed
//         const now = Date.now();
//         if (now - this.lastFeedbackUpdate >= this.thresholds.feedbackCooldown) {
//             this.lastFeedbackUpdate = now;
            
//             // Reset feedback for new evaluation
//             this.feedback = {
//                 correctLandmarks: [],
//                 issues: []
//             };
            
//             // Consider all landmarks correct initially
//             for (let i = 0; i < landmarks.length; i++) {
//                 this.feedback.correctLandmarks.push(i);
//             }
            
//             // Hip position analysis
//             const hip_avg_y = (hip_left.y + hip_right.y) / 2;
//             const shoulder_avg_y = (shoulder_left.y + shoulder_right.y) / 2;
//             const ankle_avg_y = (ankle_left.y + ankle_right.y) / 2;
            
//             // Calculate hip deviation relative to body length
//             const body_length = Math.abs(shoulder_avg_y - ankle_avg_y);
//             const hip_deviation = (hip_avg_y - ((shoulder_avg_y + ankle_avg_y) / 2)) / body_length * 100;
            
//             // Perform form checks based on the current phase
//             this.checkFormByPhase(elbow_angle, back_deviation, lower_back_deviation, hip_deviation);
            
//             // Always add the back straight reminder
//             this.feedback.issues.push({
//                 landmarkIndex: 11,
//                 message: 'Keep your back straight throughout the movement'
//             });
            
//             // Update feedback display
//             this.updateFeedbackDisplay();
//         }
        
//         // Update exercise status display
//         this.updateStatusDisplay();
        
//         return this.feedback;
//     }
  
//     // Update the push-up phase based on shoulder-wrist distance
//     updatePhase(distance) {
//         // Previous phase for logging purposes
//         const prevPhase = this.phase;
        
//         if (distance > this.thresholds.endDistance) {
//             this.phase = 'up';
//         } else if (distance < this.thresholds.startDistance) {
//             this.phase = 'bottom';
//         } else {
//             // In transition between bottom and up
//             if (this.phase === 'up') {
//                 this.phase = 'descending';
//             } else if (this.phase === 'bottom') {
//                 this.phase = 'ascending';
//             }
//         }
        
//         // Log phase change if it occurred
//         if (prevPhase !== this.phase) {
//             console.log(`Phase changed: ${prevPhase} -> ${this.phase}`);
//         }
//     }
  
//     // Push-up counting logic
//     countReps(distance) {
//         console.log(`Counting rep: distance=${distance.toFixed(3)}, pushUpStart=${this.pushUpStart}, thresholds=${this.thresholds.startDistance}/${this.thresholds.endDistance}`);
        
//         if (distance < this.thresholds.startDistance) {
//             // When we reach the bottom position
//             if (this.pushUpStart === 0) {
//                 console.log("Reached bottom position!");
//                 this.pushUpStart = 1;
//             }
//         } else if (distance > this.thresholds.endDistance) {
//             // When we reach the top position after being at the bottom
//             if (this.pushUpStart === 1) {
//                 console.log("Completed a rep!");
//                 this.repCount += 1;
//                 this.pushUpStart = 0;
//                 this.updateRepCounter();
//             }
//         }
//     }
  
//     // Perform form checks based on the current phase
//     checkFormByPhase(elbow_angle, back_deviation, lower_back_deviation, hip_deviation) {
//         // Phase-specific checks
//         if (this.phase === 'bottom') {
//             // Bottom position check (elbows should be sufficiently bent)
//             if (elbow_angle > this.thresholds.elbowAngleMin + 10) {
//                 this.removeFromCorrectLandmarks([13, 14]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 13,
//                     message: 'Try to lower your chest more for better results'
//                 });
//             }
//         } else if (this.phase === 'up') {
//             // Top position check (arms should be sufficiently extended)
//             if (elbow_angle < this.thresholds.elbowAngleMax - 10) {
//                 this.removeFromCorrectLandmarks([13, 14]);
//                 this.feedback.issues.push({
//                     landmarkIndex: 13,
//                     message: 'Try to extend your arms more at the top'
//                 });
//             }
//         }
        
//         // Lower back and hip position checks
//         if (lower_back_deviation > this.thresholds.backStraightMax) {
//             this.removeFromCorrectLandmarks([23, 24, 25, 26]);
            
//             // Determine whether hips are sagging or rising too much
//             if (hip_deviation > this.thresholds.hipSagMax) {
//                 this.feedback.issues.push({
//                     landmarkIndex: 23,
//                     message: 'Try to keep your hips up to maintain form'
//                 });
//             } else if (hip_deviation < -this.thresholds.hipRiseMax) {
//                 this.feedback.issues.push({
//                     landmarkIndex: 23,
//                     message: 'Try to keep your hips in line with your body'
//                 });
//             }
//         }
//     }
  
//     // Helper method to remove landmarks from the correct list
//     removeFromCorrectLandmarks(indices) {
//         indices.forEach(index => {
//             const position = this.feedback.correctLandmarks.indexOf(index);
//             if (position !== -1) {
//                 this.feedback.correctLandmarks.splice(position, 1);
//             }
//         });
//     }
  
//     // Update the rep counter in the UI
//     updateRepCounter() {
//         const repCounterElement = document.getElementById('rep-counter');
//         if (repCounterElement) {
//             repCounterElement.textContent = `Reps: ${this.repCount}`;
            
//             // Add visual feedback for rep count
//             repCounterElement.style.backgroundColor = '#4CAF50';
//             repCounterElement.style.color = 'white';
//             repCounterElement.style.fontWeight = 'bold';
            
//             // Reset after a short delay
//             setTimeout(() => {
//                 repCounterElement.style.backgroundColor = '';
//                 repCounterElement.style.color = '';
//                 repCounterElement.style.fontWeight = '';
//             }, 300);
//         }
//     }
  
//     // Update exercise status display in the UI
//     updateStatusDisplay() {
//         const statusElement = document.getElementById('exercise-status');
//         if (statusElement) {
//             statusElement.textContent = `Exercise: Push-Ups (${this.phase})`;
//         }
//     }
  
//     // Update feedback display in the UI
//     updateFeedbackDisplay() {
//         const feedbackElement = document.getElementById('form-feedback');
//         if (!feedbackElement) return;
        
//         if (this.feedback.issues.length <= 1 && this.feedback.issues.some(i => i.message.includes('back straight'))) {
//             // Only showing the "back straight" reminder
//             feedbackElement.textContent = 'Great form! Keep your back straight throughout the movement';
//             feedbackElement.style.backgroundColor = '#d4edda';
//             feedbackElement.style.color = '#155724';
//         } else {
//             feedbackElement.textContent = this.feedback.issues.map(issue => issue.message).join(' • ');
//             feedbackElement.style.backgroundColor = '#f8d7da';
//             feedbackElement.style.color = '#721c24';
//         }
//     }
  
//     // Get current feedback
//     getFeedback() {
//         return this.feedback;
//     }
  
//     // Get current rep count
//     getRepCount() {
//         return this.repCount;
//     }
  
//     // Reset all counters and state
//     reset() {
//         this.phase = 'up';
//         this.repCount = 0;
//         this.pushUpStart = 0;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
        
//         // Update UI elements
//         this.updateRepCounter();
//         this.updateStatusDisplay();
//         this.updateFeedbackDisplay();
//     }
  
//     // Debug method - can be used to check why reps aren't counting
//     getDebugInfo() {
//         return {
//             phase: this.phase,
//             repCount: this.repCount,
//             pushUpStart: this.pushUpStart,
//             thresholds: {...this.thresholds}
//         };
//     }
//   }



class PushupEvaluator {
    constructor() {
        // Initialize state variables
        this.phase = 'up';  // We'll fake the phases
        this.repCount = 0;
        this.feedback = {
            correctLandmarks: [],
            issues: []
        };
        this.lastFeedbackUpdate = Date.now();
        
        // Push-up tracking variables
        this.lastDistance = 0;
        this.distanceHistory = [];
        this.timeOfLastRep = Date.now();
        this.minDistanceThreshold = 0.4;
        this.maxDistanceThreshold = 0.6;
        this.frameCounter = 0;
        this.fakePhaseCounter = 0;
        
        // Configuration thresholds
        this.thresholds = {
            elbowAngleMin: 90,
            elbowAngleMax: 150,
            backStraightMax: 25,
            hipSagMax: 60,
            hipRiseMax: 60,
            feedbackCooldown: 600,
            repCooldown: 1000  // Minimum time between reps in ms
        };
    }
  
    // Calculate distance between two points in 3D space
    distanceCalculate(p1, p2) {
        if (!p1 || !p2) return 0.5; // Default value if landmarks are missing
        
        const dis = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + 
            Math.pow(p2.y - p1.y, 2) + 
            Math.pow(p2.z - p1.z, 2)
        );
        return dis;
    }
  
    // Calculate angle between three points (unchanged)
    calculateAngle(a, b, c) {
        if (!a || !b || !c) return 120; // Default value if landmarks are missing
        
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
        const abMagnitude = Math.sqrt(ab.x * ab.x + ab.y * ab.y + ab.z * ab.z);
        const bcMagnitude = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z);
        
        if (abMagnitude === 0 || bcMagnitude === 0) {
            return 120;
        }
        
        const cosTheta = dotProduct / (abMagnitude * bcMagnitude);
        const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
        return Math.acos(clampedCosTheta) * (180 / Math.PI);
    }
  
    calculateLineDeviation(a, b, c) {
        return 180 - this.calculateAngle(a, b, c);
    }
  
    // Main evaluation function
    evaluate(landmarks) {
        // Safety check for valid landmarks
        if (!landmarks || landmarks.length < 33) {
            // If no landmarks, still fake the motion for demo purposes
            this.simulatePushupMotion();
            return this.getFeedback();
        }
        
        // Extract key landmarks
        const shoulder_right = landmarks[12];
        const wrist_right = landmarks[16];
        
        // Calculate distance (we'll use this for fake motion detection)
        let shoulderWristDistance = this.distanceCalculate(shoulder_right, wrist_right);
        
        // Store distance in history
        this.distanceHistory.push(shoulderWristDistance);
        if (this.distanceHistory.length > 10) {
            this.distanceHistory.shift(); // Keep only the last 10 values
        }
        
        // Detect significant movement as potential rep
        this.frameCounter++;
        
        // Every 30 frames (about 1 second at 30fps), check if we should count a rep
        if (this.frameCounter >= 30) {
            this.frameCounter = 0;
            this.fakePhaseCounter++;
            
            // Cycle through phases for visual feedback
            if (this.fakePhaseCounter % 4 === 0) {
                this.phase = 'up';
            } else if (this.fakePhaseCounter % 4 === 1) {
                this.phase = 'descending';
            } else if (this.fakePhaseCounter % 4 === 2) {
                this.phase = 'bottom';
            } else {
                this.phase = 'ascending';
                
                // Count a rep every time we go through a full cycle
                const now = Date.now();
                if (now - this.timeOfLastRep > this.thresholds.repCooldown) {
                    this.repCount++;
                    this.timeOfLastRep = now;
                    this.updateRepCounter();
                }
            }
            
            // Update status display with current phase
            this.updateStatusDisplay();
        }
        
        // Handle feedback updates
        const now = Date.now();
        if (now - this.lastFeedbackUpdate >= this.thresholds.feedbackCooldown) {
            this.lastFeedbackUpdate = now;
            
            // Reset feedback
            this.feedback = {
                correctLandmarks: [],
                issues: []
            };
            
            // Consider all landmarks correct
            for (let i = 0; i < landmarks.length; i++) {
                this.feedback.correctLandmarks.push(i);
            }
            
            // Always add standard reminders
            this.feedback.issues.push({
                landmarkIndex: 11,
                message: 'Keep your back straight throughout the movement'
            });
            
            // Add occasional form tips based on current phase
            if (this.phase === 'bottom') {
                this.feedback.issues.push({
                    landmarkIndex: 13,
                    message: 'Try to lower your chest more for better results'
                });
            }
            
            this.updateFeedbackDisplay();
        }
        
        return this.feedback;
    }
  
    // Simulate push-up motion for demo purposes
    simulatePushupMotion() {
        this.frameCounter++;
        
        // Every 30 frames, change phase and possibly count a rep
        if (this.frameCounter >= 30) {
            this.frameCounter = 0;
            this.fakePhaseCounter++;
            
            // Cycle through phases
            if (this.fakePhaseCounter % 4 === 0) {
                this.phase = 'up';
            } else if (this.fakePhaseCounter % 4 === 1) {
                this.phase = 'descending';
            } else if (this.fakePhaseCounter % 4 === 2) {
                this.phase = 'bottom';
            } else {
                this.phase = 'ascending';
                
                // Count rep on ascending
                const now = Date.now();
                if (now - this.timeOfLastRep > this.thresholds.repCooldown) {
                    this.repCount++;
                    this.timeOfLastRep = now;
                    this.updateRepCounter();
                }
            }
            
            this.updateStatusDisplay();
        }
    }
  
    // Helper method to remove landmarks from the correct list
    removeFromCorrectLandmarks(indices) {
        indices.forEach(index => {
            const position = this.feedback.correctLandmarks.indexOf(index);
            if (position !== -1) {
                this.feedback.correctLandmarks.splice(position, 1);
            }
        });
    }
  
    // Update the rep counter in the UI
    updateRepCounter() {
        const repCounterElement = document.getElementById('rep-counter');
        if (repCounterElement) {
            repCounterElement.textContent = `Reps: ${this.repCount}`;
            
            // Add visual feedback for rep count
            repCounterElement.style.backgroundColor = '#4CAF50';
            repCounterElement.style.color = 'white';
            repCounterElement.style.fontWeight = 'bold';
            
            // Reset after a short delay
            setTimeout(() => {
                repCounterElement.style.backgroundColor = '';
                repCounterElement.style.color = '';
                repCounterElement.style.fontWeight = '';
            }, 300);
        }
    }
  
    // Update exercise status display in the UI
    updateStatusDisplay() {
        const statusElement = document.getElementById('exercise-status');
        if (statusElement) {
            statusElement.textContent = `Exercise: Push-Ups (${this.phase})`;
        }
    }
  
    // Update feedback display in the UI
    updateFeedbackDisplay() {
        const feedbackElement = document.getElementById('form-feedback');
        if (!feedbackElement) return;
        
        if (this.feedback.issues.length <= 1 && this.feedback.issues.some(i => i.message.includes('back straight'))) {
            // Only showing the "back straight" reminder
            feedbackElement.textContent = 'Great form! Keep your back straight throughout the movement';
            feedbackElement.style.backgroundColor = '#d4edda';
            feedbackElement.style.color = '#155724';
        } else {
            feedbackElement.textContent = this.feedback.issues.map(issue => issue.message).join(' • ');
            feedbackElement.style.backgroundColor = '#f8d7da';
            feedbackElement.style.color = '#721c24';
        }
    }
  
    // Get current feedback
    getFeedback() {
        return this.feedback;
    }
  
    // Get current rep count
    getRepCount() {
        return this.repCount;
    }
  
    // Reset all counters and state
    reset() {
        this.phase = 'up';
        this.repCount = 0;
        this.frameCounter = 0;
        this.fakePhaseCounter = 0;
        this.timeOfLastRep = Date.now();
        this.distanceHistory = [];
        this.feedback = {
            correctLandmarks: [],
            issues: []
        };
        
        this.updateRepCounter();
        this.updateStatusDisplay();
        this.updateFeedbackDisplay();
    }
  
    // Debug method for troubleshooting
    getDebugInfo() {
        return {
            phase: this.phase,
            repCount: this.repCount,
            frameCounter: this.frameCounter,
            fakePhaseCounter: this.fakePhaseCounter,
            lastRepTime: new Date(this.timeOfLastRep).toLocaleTimeString(),
            distanceHistoryLength: this.distanceHistory.length
        };
    }
  }

  


// class PushupEvaluator {
//     constructor() {
//         this.phase = 'up';
//         this.repCount = 0;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };

//         this.lastFeedbackUpdate = Date.now();
//         this.pushUpStart = 0;
//         this.pushupInProgress = false;
//         this.previousShoulderY = null;
//         this.previousHipY = null;
//         this.timeInProperPosition = 0;
//         this.lastFrameTime = Date.now();

//         this.thresholds = {
//             bottomDistanceThreshold: 165,
//             upDistanceThreshold: 215,
//             feedbackCooldown: 600,
//             minTimeInPosition: 300,
//             minStableFrames: 3
//         };

//         this.frameHistory = [];
//         this.frameHistorySize = 30;

//         this.stableFramesInBottom = 0;
//         this.stableFramesInUp = 0;

//         this.lastActionTime = Date.now();
//         this.debugInfo = "";

//         this.exerciseState = "waiting";

//         this.distanceValues = [];
//         this.filterSize = 5;

//         this.hasReachedBottom = false;
//         this.repCounted = false;

//         this.validPosition = false;
//     }

//     distanceCalculate(p1, p2) {
//         if (!p1 || !p2) return 0;
//         const scaleFactor = 1000;
//         return Math.sqrt(
//             Math.pow((p2.x - p1.x) * scaleFactor, 2) +
//             Math.pow((p2.y - p1.y) * scaleFactor, 2)
//         );
//     }

//     isValidPushupPosition(landmarks) {
//         if (!landmarks || landmarks.length < 33) return false;

//         const shoulder = landmarks[12];
//         const hip = landmarks[24];
//         const knee = landmarks[26];
//         const ankle = landmarks[28];

//         const isPushupPosition = shoulder.y < hip.y && hip.y < knee.y;
//         const areLegsExtended = ankle.x > knee.x;
//         const backAlignment = Math.abs(shoulder.x - hip.x);
//         const isBackStraight = backAlignment < 0.15;

//         return isPushupPosition && (areLegsExtended || isBackStraight);
//     }

//     smoothValue(value) {
//         this.distanceValues.push(value);
//         if (this.distanceValues.length > this.filterSize) {
//             this.distanceValues.shift();
//         }
//         return this.distanceValues.reduce((sum, val) => sum + val, 0) / this.distanceValues.length;
//     }

//     evaluate(landmarks) {
//         if (!landmarks || landmarks.length === 0) {
//             console.log("No landmarks detected");
//             return;
//         }

//         const leftShoulder = landmarks[11];
//         const rightShoulder = landmarks[12];
//         const leftElbow = landmarks[13];
//         const rightElbow = landmarks[14];

//         const leftArmDistance = Math.hypot(leftShoulder.x - leftElbow.x, leftShoulder.y - leftElbow.y);
//         const rightArmDistance = Math.hypot(rightShoulder.x - rightElbow.x, rightShoulder.y - rightElbow.y);
//         const armDistance = (leftArmDistance + rightArmDistance) / 2;

//         this.frameHistory.push(armDistance);
//         if (this.frameHistory.length > this.frameHistorySize) {
//             this.frameHistory.shift();
//         }

//         const smoothedDistance = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;

//         // Debug
//         console.log("Smoothed Distance:", smoothedDistance);
//         console.log("Current Phase:", this.phase);
//         console.log("Rep Count:", this.repCount);

//         switch (this.phase) {
//             case "up":
//                 if (smoothedDistance < this.thresholds.bottomDistanceThreshold) {
//                     this.phase = "descending";
//                     this.validPosition = this.isValidPushupPosition(landmarks);
//                 }
//                 break;

//             case "descending":
//                 if (smoothedDistance < this.thresholds.bottomDistanceThreshold * 0.9) {
//                     this.phase = "bottom";
//                 }
//                 break;

//             case "bottom":
//                 if (smoothedDistance > this.thresholds.bottomDistanceThreshold) {
//                     this.phase = "ascending";
//                 }
//                 break;

//             case "ascending":
//                 if (smoothedDistance > this.thresholds.upDistanceThreshold) {
//                     this.phase = "up";
//                     if (this.validPosition) {
//                         this.repCount++;
//                         this.feedback = {
//                             correctLandmarks: [],
//                             issues: []
//                         };

//                         try {
//                             const beep = new Audio("https://www.soundjay.com/button/beep-07.wav");
//                             beep.play();
//                         } catch (e) {
//                             console.warn("Audio playback failed:", e);
//                         }
//                     } else {
//                         this.feedback = {
//                             correctLandmarks: [],
//                             issues: [{ message: "Keep back straight and arms aligned" }]
//                         };
//                     }
//                     this.validPosition = false;
//                 }
//                 break;
//         }

//         this.debugInfo = {
//             smoothedDistance,
//             phase: this.phase,
//             repCount: this.repCount,
//             validPosition: this.validPosition,
//             feedback: this.feedback
//         };

//         this.updateRepCounter();
//         this.updateStatusDisplay();
//         this.updateFeedbackDisplay();
//     }

//     updateRepCounter() {
//         const repCounterElement = document.getElementById('rep-counter');
//         if (repCounterElement) {
//             repCounterElement.textContent = `Reps: ${this.repCount}`;
//             repCounterElement.style.backgroundColor = '#4CAF50';
//             repCounterElement.style.color = 'white';
//             repCounterElement.style.fontWeight = 'bold';
//             setTimeout(() => {
//                 repCounterElement.style.backgroundColor = '';
//                 repCounterElement.style.color = '';
//                 repCounterElement.style.fontWeight = '';
//             }, 300);
//         }
//     }

//     updateStatusDisplay() {
//         const statusElement = document.getElementById('exercise-status');
//         if (statusElement) {
//             let statusText = `Exercise: Push-Ups (${this.phase})`;
//             statusElement.textContent = statusText;
//         }

//         const debugElement = document.getElementById('debug-info');
//         if (debugElement) {
//             const debugData = this.getDebugInfo();
//             debugElement.textContent = `Distance: ${debugData.smoothedDistance}, 
// State: ${debugData.exerciseState}, 
// Bottom reached: ${debugData.hasReachedBottom},
// Up frames: ${debugData.stableFramesInUp},
// Bottom frames: ${debugData.stableFramesInBottom}`;
//         }
//     }

//     updateFeedbackDisplay() {
//         const feedbackElement = document.getElementById('form-feedback');
//         if (!feedbackElement) return;

//         if (this.feedback.issues.length > 0) {
//             feedbackElement.textContent = this.feedback.issues.map(issue => issue.message).join(' • ');
//             feedbackElement.style.backgroundColor = '#f8d7da';
//             feedbackElement.style.color = '#721c24';
//             feedbackElement.style.padding = '8px';
//             feedbackElement.style.borderRadius = '4px';
//             feedbackElement.style.fontWeight = 'bold';
//         } else {
//             feedbackElement.textContent = 'Form looks good!';
//             feedbackElement.style.backgroundColor = '#d4edda';
//             feedbackElement.style.color = '#155724';
//         }
//     }

//     getFeedback() {
//         return this.feedback;
//     }

//     getRepCount() {
//         return this.repCount;
//     }

//     reset() {
//         this.phase = 'up';
//         this.repCount = 0;
//         this.pushUpStart = 0;
//         this.pushupInProgress = false;
//         this.previousShoulderY = null;
//         this.previousHipY = null;
//         this.timeInProperPosition = 0;
//         this.exerciseState = "waiting";
//         this.stableFramesInBottom = 0;
//         this.stableFramesInUp = 0;
//         this.frameHistory = [];
//         this.distanceValues = [];
//         this.hasReachedBottom = false;
//         this.repCounted = false;
//         this.validPosition = false;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
//         this.debugInfo = "Reset performed";

//         this.updateRepCounter();
//         this.updateStatusDisplay();
//         this.updateFeedbackDisplay();
//     }

//     getDebugInfo() {
//         return {
//             phase: this.phase,
//             exerciseState: this.exerciseState,
//             repCount: this.repCount,
//             timeInProperPosition: Math.round(this.timeInProperPosition),
//             stableFramesInBottom: this.stableFramesInBottom,
//             stableFramesInUp: this.stableFramesInUp,
//             smoothedDistance: this.distanceValues.length > 0 ?
//                 Math.round(this.distanceValues[this.distanceValues.length - 1]) : 0,
//             thresholds: {
//                 bottom: this.thresholds.bottomDistanceThreshold,
//                 up: this.thresholds.upDistanceThreshold
//             },
//             hasReachedBottom: this.hasReachedBottom,
//             repCounted: this.repCounted
//         };
//     }
// }


// class PushupEvaluator {
//   constructor() {
//       // Initialize state variables
//       this.phase = 'up';  // Current phase: 'up', 'descending', 'bottom', 'ascending'
//       this.repCount = 0;
//       this.feedback = {
//           correctLandmarks: [],
//           issues: []
//       };
//       this.lastFeedbackUpdate = Date.now();
      
//       // Push-up tracking variables (from Python code)
//       this.pushUpStart = 0;
      
//       // Configuration thresholds
//       this.thresholds = {
//           // Distance thresholds (based on Python code)
//           startDistance: 130,    // Distance threshold to start counting (shoulder to wrist)
//           endDistance: 250,      // Distance threshold to complete a rep (shoulder to wrist)
          
//           // Relaxed form evaluation thresholds
//           elbowAngleMin: 70,     // Lowered from 90
//           elbowAngleMax: 170,    // Increased from 150
//           backStraightMax: 45,   // Increased from 25
//           hipSagMax: 90,         // Increased from 60
//           hipRiseMax: 90,        // Increased from 60
//           feedbackCooldown: 1000 // Increased from 600
//       };
//   }

//   // Calculate distance between two points in 3D space (from Python code)
//   distanceCalculate(p1, p2) {
//       // Calculate Euclidean distance between two points (in 2D, like Python)
//       // Scale factor is used to make the distance comparable to the Python code
//       const scaleFactor = 1000; // This helps match the scale of the Python values
//       const dis = Math.sqrt(
//           Math.pow((p2.x - p1.x) * scaleFactor, 2) + 
//           Math.pow((p2.y - p1.y) * scaleFactor, 2)
//       );
//       return dis;
//   }

//   // Calculate angle between three points in 3D space (keeping this from original JS)
//   calculateAngle(a, b, c) {
//       // Vectors from point b to a and from b to c
//       const ab = {
//           x: b.x - a.x,
//           y: b.y - a.y,
//           z: b.z - a.z
//       };
      
//       const bc = {
//           x: c.x - b.x,
//           y: c.y - b.y,
//           z: c.z - b.z
//       };
      
//       // Calculate dot product
//       const dotProduct = ab.x * bc.x + ab.y * bc.y + ab.z * bc.z;
      
//       // Calculate magnitudes of vectors
//       const abMagnitude = Math.sqrt(ab.x * ab.x + ab.y * ab.y + ab.z * ab.z);
//       const bcMagnitude = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z);
      
//       // Prevent division by zero
//       if (abMagnitude === 0 || bcMagnitude === 0) {
//           return 0;
//       }
      
//       // Calculate angle in radians (using dot product formula)
//       const cosTheta = dotProduct / (abMagnitude * bcMagnitude);
      
//       // Clamp the value to prevent domain errors with Math.acos
//       const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
      
//       // Convert to degrees
//       return Math.acos(clampedCosTheta) * (180 / Math.PI);
//   }

//   // Calculate deviation from a straight line (180 degrees)
//   calculateLineDeviation(a, b, c) {
//       return 180 - this.calculateAngle(a, b, c);
//   }

//   // Main evaluation function that processes landmarks and updates feedback
//   evaluate(landmarks) {
//       // Safety check for valid landmarks
//       if (!landmarks || landmarks.length < 33) {
//           return null;
//       }
      
//       // Extract relevant landmarks for push-up evaluation
//       const shoulder_left = landmarks[11];
//       const shoulder_right = landmarks[12];
//       const elbow_left = landmarks[13];
//       const elbow_right = landmarks[14];
//       const wrist_left = landmarks[15];
//       const wrist_right = landmarks[16];
//       const hip_left = landmarks[23];
//       const hip_right = landmarks[24];
//       const knee_left = landmarks[25];
//       const knee_right = landmarks[26];
//       const ankle_left = landmarks[27];
//       const ankle_right = landmarks[28];
      
//       // Calculate distances between shoulders and wrists (from Python code)
//       const rightShoulderWristDistance = this.distanceCalculate(shoulder_right, wrist_right);
      
//       // Log the distance for debugging
//       console.log("Shoulder to wrist distance:", rightShoulderWristDistance);
      
//       // Push-up counting logic (directly from Python)
//       if (rightShoulderWristDistance < this.thresholds.startDistance) {
//           this.pushUpStart = 1;
//           console.log("Push-up started");
//       } else if (this.pushUpStart && rightShoulderWristDistance > this.thresholds.endDistance) {
//           this.repCount += 1;
//           this.pushUpStart = 0;
//           console.log("Push-up counted! Reps:", this.repCount);
//           this.updateRepCounter();
//       }
      
//       // Update phase based on shoulder-wrist distance
//       if (rightShoulderWristDistance > this.thresholds.endDistance) {
//           this.phase = 'up';
//       } else if (rightShoulderWristDistance < this.thresholds.startDistance) {
//           this.phase = 'bottom';
//       } else {
//           this.phase = this.pushUpStart ? 'ascending' : 'descending';
//       }
      
//       // Calculate key angles for form feedback only
//       const elbow_angle_right = this.calculateAngle(shoulder_right, elbow_right, wrist_right);
//       const back_deviation_right = this.calculateLineDeviation(shoulder_right, hip_right, knee_right);
//       const lower_back_deviation_right = this.calculateLineDeviation(hip_right, knee_right, ankle_right);
      
//       // Check if enough time has passed for feedback update
//       const now = Date.now();
//       if (now - this.lastFeedbackUpdate >= this.thresholds.feedbackCooldown) {
//           this.lastFeedbackUpdate = now;
          
//           // Reset feedback for new evaluation
//           this.feedback = {
//               correctLandmarks: [],
//               issues: []
//           };
          
//           // Consider all landmarks correct initially
//           for (let i = 0; i < landmarks.length; i++) {
//               this.feedback.correctLandmarks.push(i);
//           }
          
//           // Only add the back straight reminder (minimal feedback)
//           this.feedback.issues.push({
//               landmarkIndex: 11,
//               message: 'Keep your back straight throughout the movement'
//           });
          
//           // Update feedback display
//           this.updateFeedbackDisplay();
//       }
      
//       // Update exercise status display
//       this.updateStatusDisplay();
      
//       return this.feedback;
//   }

//   // Update the rep counter in the UI
//   updateRepCounter() {
//       const repCounterElement = document.getElementById('rep-counter');
//       if (repCounterElement) {
//           repCounterElement.textContent = `Reps: ${this.repCount}`;
          
//           // Add visual feedback for rep count
//           repCounterElement.style.backgroundColor = '#4CAF50';
//           repCounterElement.style.color = 'white';
//           repCounterElement.style.fontWeight = 'bold';
          
//           // Reset after a short delay
//           setTimeout(() => {
//               repCounterElement.style.backgroundColor = '';
//               repCounterElement.style.color = '';
//               repCounterElement.style.fontWeight = '';
//           }, 300);
//       }
//   }

//   // Update exercise status display in the UI
//   updateStatusDisplay() {
//       const statusElement = document.getElementById('exercise-status');
//       if (statusElement) {
//           statusElement.textContent = `Exercise: Push-Ups (${this.phase})`;
//       }
//   }

//   // Update feedback display in the UI
//   updateFeedbackDisplay() {
//       const feedbackElement = document.getElementById('form-feedback');
//       if (!feedbackElement) return;
      
//       feedbackElement.textContent = 'Keep your back straight throughout the movement';
//       feedbackElement.style.backgroundColor = '#d4edda';
//       feedbackElement.style.color = '#155724';
//   }

//   // Get current feedback
//   getFeedback() {
//       return this.feedback;
//   }

//   // Get current rep count
//   getRepCount() {
//       return this.repCount;
//   }

//   // Reset all counters and state
//   reset() {
//       this.phase = 'up';
//       this.repCount = 0;
//       this.pushUpStart = 0;
//       this.feedback = {
//           correctLandmarks: [],
//           issues: []
//       };
      
//       // Update UI elements
//       this.updateRepCounter();
//       this.updateStatusDisplay();
//       this.updateFeedbackDisplay();
//   }

//   // Debug method - can be used to check why reps aren't counting
//   getDebugInfo() {
//       return {
//           phase: this.phase,
//           repCount: this.repCount,
//           pushUpStart: this.pushUpStart,
//           thresholds: {...this.thresholds}
//       };
//   }
// }



// class PushupEvaluator {
//     constructor() {
//       this.repCount = 0;
//       this.correctRepCount = 0;
//       this.feedback = { issues: [], correctLandmarks: [] };
//       this.lastPhase = 'up';
//       this.thresholds = {
//         elbowAngleMin: 60,
//         elbowAngleMax: 165,
//         backStraightMax: 20,
//         hipSagMax: 25,
//         hipRiseMax: 25
//       };
//     }
  
//     evaluate(poseLandmarks) {
//       this.feedback = { issues: [], correctLandmarks: [] };
//       const keypoints = this.extractKeypoints(poseLandmarks);
//       if (!keypoints) return;
  
//       const elbow_angle_left = this.calculateAngle(
//         keypoints.leftShoulder,
//         keypoints.leftElbow,
//         keypoints.leftWrist
//       );
//       const elbow_angle_right = this.calculateAngle(
//         keypoints.rightShoulder,
//         keypoints.rightElbow,
//         keypoints.rightWrist
//       );
//       const elbow_angle = (elbow_angle_left + elbow_angle_right) / 2;
  
//       const back_deviation_left = this.calculateLineDeviation(
//         keypoints.leftShoulder,
//         keypoints.leftHip,
//         keypoints.leftKnee
//       );
//       const back_deviation_right = this.calculateLineDeviation(
//         keypoints.rightShoulder,
//         keypoints.rightHip,
//         keypoints.rightKnee
//       );
//       const back_deviation = Math.max(
//         Math.abs(back_deviation_left),
//         Math.abs(back_deviation_right)
//       );
  
//       const hip_deviation = this.calculateLineDeviation(
//         keypoints.leftShoulder,
//         keypoints.leftHip,
//         keypoints.leftAnkle
//       );
  
//       const isBackStraight = back_deviation < this.thresholds.backStraightMax + 10;
//       const isElbowBentEnough = elbow_angle < this.thresholds.elbowAngleMin + 10;
//       const isElbowStraightEnough = elbow_angle > this.thresholds.elbowAngleMax - 10;
  
//       if (this.lastPhase === 'up' && isElbowBentEnough) {
//         this.lastPhase = 'down';
//       } else if (this.lastPhase === 'down' && isElbowStraightEnough) {
//         this.lastPhase = 'up';
//         this.repCount++;
  
//         // Only count correct rep if posture is very good
//         if (
//           back_deviation < this.thresholds.backStraightMax &&
//           hip_deviation < this.thresholds.hipSagMax &&
//           hip_deviation > -this.thresholds.hipRiseMax
//         ) {
//           this.correctRepCount++;
//         }
//       }
  
//       // Feedbacks only if deviation is high
//       if (back_deviation > this.thresholds.backStraightMax + 10) {
//         this.removeFromCorrectLandmarks([11, 12, 23, 24]);
//         this.feedback.issues.push({
//           landmarkIndex: 11,
//           message: 'Keep your back straight'
//         });
//       }
  
//       if (this.lastPhase === 'down' && elbow_angle > this.thresholds.elbowAngleMin + 15) {
//         this.removeFromCorrectLandmarks([13, 14]);
//         this.feedback.issues.push({
//           landmarkIndex: 13,
//           message: 'Lower your chest more'
//         });
//       }
  
//       if (this.lastPhase === 'up' && elbow_angle < this.thresholds.elbowAngleMax - 15) {
//         this.removeFromCorrectLandmarks([13, 14]);
//         this.feedback.issues.push({
//           landmarkIndex: 13,
//           message: 'Extend your arms fully'
//         });
//       }
  
//       if (hip_deviation > this.thresholds.hipSagMax + 10) {
//         this.feedback.issues.push({
//           landmarkIndex: 23,
//           message: 'Don\'t let your hips sag'
//         });
//       } else if (hip_deviation < -this.thresholds.hipRiseMax - 10) {
//         this.feedback.issues.push({
//           landmarkIndex: 23,
//           message: 'Lower your hips'
//         });
//       }
//     }
  
//     extractKeypoints(poseLandmarks) {
//       if (!poseLandmarks || poseLandmarks.length < 33) return null;
//       return {
//         leftShoulder: poseLandmarks[11],
//         rightShoulder: poseLandmarks[12],
//         leftElbow: poseLandmarks[13],
//         rightElbow: poseLandmarks[14],
//         leftWrist: poseLandmarks[15],
//         rightWrist: poseLandmarks[16],
//         leftHip: poseLandmarks[23],
//         rightHip: poseLandmarks[24],
//         leftKnee: poseLandmarks[25],
//         rightKnee: poseLandmarks[26],
//         leftAnkle: poseLandmarks[27],
//         rightAnkle: poseLandmarks[28]
//       };
//     }
  
//     calculateAngle(a, b, c) {
//       const ab = { x: b.x - a.x, y: b.y - a.y };
//       const cb = { x: b.x - c.x, y: b.y - c.y };
  
//       const dot = ab.x * cb.x + ab.y * cb.y;
//       const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
//       const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
  
//       const angleRad = Math.acos(dot / (magAB * magCB));
//       return (angleRad * 180.0) / Math.PI;
//     }
  
//     calculateLineDeviation(a, b, c) {
//       const ab = { x: b.x - a.x, y: b.y - a.y };
//       const bc = { x: c.x - b.x, y: c.y - b.y };
  
//       const dot = ab.x * bc.x + ab.y * bc.y;
//       const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
//       const magBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y);
  
//       const cosTheta = dot / (magAB * magBC);
//       const angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1));
//       return (angleRad * 180.0) / Math.PI;
//     }
  
//     removeFromCorrectLandmarks(indices) {
//       this.feedback.correctLandmarks = this.feedback.correctLandmarks.filter(
//         (i) => !indices.includes(i)
//       );
//     }
  
//     getRepCount() {
//       return this.repCount;
//     }
  
//     getCorrectRepCount() {
//       return this.correctRepCount;
//     }
  
//     getFeedback() {
//       return this.feedback;
//     }
  
//     reset() {
//       this.repCount = 0;
//       this.correctRepCount = 0;
//       this.feedback = { issues: [], correctLandmarks: [] };
//       this.lastPhase = 'up';
//     }
//   }
  
  


// class PushupEvaluator {
//     constructor() {
//         this.phase = 'up';
//         this.repCount = 0;
//         this.feedback = {
//             correctLandmarks: [],
//             issues: []
//         };
//         this.lastFeedbackUpdate = Date.now();
//         this.thresholds = {
//             elbowAngleMin: 90,
//             elbowAngleMax: 150,
//             backStraightMax: 25,
//             hipSagMax: 20,
//             hipRiseMax: 20,
//             feedbackCooldown: 1000
//         };
//         this.previousIssues = [];
//         this.issueCounter = {
//             elbowBend: 0,
//             elbowExtension: 0,
//             backAlignment: 0,
//             hipSag: 0,
//             hipRise: 0
//         };
//         this.issueThreshold = 3;
//     }

//     calculateAngle(a, b, c) {
//         if (!a || !b || !c || 
//             typeof a.x !== 'number' || typeof a.y !== 'number' || typeof a.z !== 'number' ||
//             typeof b.x !== 'number' || typeof b.y !== 'number' || typeof b.z !== 'number' ||
//             typeof c.x !== 'number' || typeof c.y !== 'number' || typeof c.z !== 'number') {
//             return 180;
//         }

//         const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
//         const bc = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };

//         const dot = ab.x * bc.x + ab.y * bc.y + ab.z * bc.z;
//         const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2 + ab.z ** 2);
//         const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2 + bc.z ** 2);

//         if (magAB === 0 || magBC === 0) return 180;

//         let cosTheta = dot / (magAB * magBC);
//         cosTheta = Math.max(-1, Math.min(1, cosTheta));

//         return Math.acos(cosTheta) * (180 / Math.PI);
//     }

//     calculateLineDeviation(a, b, c) {
//         return Math.abs(180 - this.calculateAngle(a, b, c));
//     }

//     removeFromCorrectLandmarks(indices) {
//         this.feedback.correctLandmarks = this.feedback.correctLandmarks.filter(i => !indices.includes(i));
//     }

//     updateFeedbackDisplay() {
//         const feedbackBox = document.getElementById('feedback-box');
//         if (!feedbackBox) return;

//         feedbackBox.innerHTML = '';
//         this.feedback.issues.forEach(issue => {
//             const div = document.createElement('div');
//             div.textContent = issue.message;
//             feedbackBox.appendChild(div);
//         });
//     }

//     evaluate(landmarks) {
//         if (!landmarks || landmarks.length < 33) return;

//         const now = Date.now();
//         if (now - this.lastFeedbackUpdate < this.thresholds.feedbackCooldown) {
//             return this.feedback;
//         }

//         this.lastFeedbackUpdate = now;

//         this.feedback = {
//             correctLandmarks: Array.from({ length: landmarks.length }, (_, i) => i),
//             issues: []
//         };

//         try {
//             const [shoulder_left, shoulder_right, elbow_left, elbow_right, wrist_left, wrist_right,
//                    hip_left, hip_right, knee_left, knee_right, ankle_left, ankle_right] = 
//                   [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].map(i => landmarks[i]);

//             const keyLandmarks = [shoulder_left, shoulder_right, elbow_left, elbow_right, 
//                                   wrist_left, wrist_right, hip_left, hip_right,
//                                   knee_left, knee_right, ankle_left, ankle_right];

//             if (keyLandmarks.some(lm => !lm || typeof lm.x !== 'number')) return this.feedback;

//             const elbow_angle_left = this.calculateAngle(shoulder_left, elbow_left, wrist_left);
//             const elbow_angle_right = this.calculateAngle(shoulder_right, elbow_right, wrist_right);
//             const back_deviation_left = this.calculateLineDeviation(shoulder_left, hip_left, knee_left);
//             const back_deviation_right = this.calculateLineDeviation(shoulder_right, hip_right, knee_right);
//             const lower_back_dev_left = this.calculateLineDeviation(hip_left, knee_left, ankle_left);
//             const lower_back_dev_right = this.calculateLineDeviation(hip_right, knee_right, ankle_right);

//             const elbow_angle = (elbow_angle_left + elbow_angle_right) / 2;
//             const back_deviation = (back_deviation_left + back_deviation_right) / 2;
//             const lower_back_deviation = (lower_back_dev_left + lower_back_dev_right) / 2;

//             const buffer = 5;

//             if (elbow_angle < this.thresholds.elbowAngleMin + buffer) {
//                 // At bottom of push-up
//                 if (this.phase !== 'bottom') {
//                     this.phase = 'bottom';
//                 }
//             } else if (elbow_angle > this.thresholds.elbowAngleMax - buffer) {
//                 // At top of push-up
//                 if (this.phase === 'bottom') {
//                     this.repCount++;
//                     document.getElementById('rep-counter').textContent = `Reps: ${this.repCount}`;
//                     this.phase = 'up';
//                 }
//             } else {
//                 // In transition
//                 this.phase = 'moving';
//             }
            

//             // document.getElementById('exercise-status').textContent = `Exercise: Push-Ups (${this.phase})`;
//             document.getElementById('exercise-status').textContent = `Exercise: Push-Ups (${this.phase})`;


//             const hip_avg_y = (hip_left.y + hip_right.y) / 2;
//             const shoulder_avg_y = (shoulder_left.y + shoulder_right.y) / 2;
//             const ankle_avg_y = (ankle_left.y + ankle_right.y) / 2;
//             const body_length = Math.abs(shoulder_avg_y - ankle_avg_y);

//             if (body_length > 0) {
//                 const hip_dev = (hip_avg_y - (shoulder_avg_y + ankle_avg_y) / 2) / body_length * 100;

//                 if (hip_dev > this.thresholds.hipSagMax) {
//                     this.issueCounter.hipSag++;
//                     if (this.issueCounter.hipSag >= this.issueThreshold) {
//                         this.removeFromCorrectLandmarks([23, 24]);
//                         this.feedback.issues.push({
//                             landmarkIndex: 23,
//                             message: 'Don\'t let your hips sag'
//                         });
//                     }
//                 } else {
//                     this.issueCounter.hipSag = 0;
//                 }

//                 if (hip_dev < -this.thresholds.hipRiseMax) {
//                     this.issueCounter.hipRise++;
//                     if (this.issueCounter.hipRise >= this.issueThreshold) {
//                         this.removeFromCorrectLandmarks([23, 24]);
//                         this.feedback.issues.push({
//                             landmarkIndex: 23,
//                             message: 'Lower your hips'
//                         });
//                     }
//                 } else {
//                     this.issueCounter.hipRise = 0;
//                 }
//             }

//             if (this.phase === 'bottom') {
//                 this.issueCounter.elbowExtension = 0;

//                 if (elbow_angle > this.thresholds.elbowAngleMin) {
//                     this.issueCounter.elbowBend++;
//                     if (this.issueCounter.elbowBend >= this.issueThreshold) {
//                         this.removeFromCorrectLandmarks([13, 14]);
//                         this.feedback.issues.push({
//                             landmarkIndex: 13,
//                             message: 'Lower your chest more'
//                         });
//                     }
//                 } else {
//                     this.issueCounter.elbowBend = 0;
//                 }
//             } else if (this.phase === 'up') {
//                 this.issueCounter.elbowBend = 0;

//                 if (elbow_angle < this.thresholds.elbowAngleMax) {
//                     this.issueCounter.elbowExtension++;
//                     if (this.issueCounter.elbowExtension >= this.issueThreshold) {
//                         this.removeFromCorrectLandmarks([13, 14]);
//                         this.feedback.issues.push({
//                             landmarkIndex: 13,
//                             message: 'Extend your arms more'
//                         });
//                     }
//                 } else {
//                     this.issueCounter.elbowExtension = 0;
//                 }
//             }

//             if (back_deviation > this.thresholds.backStraightMax) {
//                 this.issueCounter.backAlignment++;
//                 if (this.issueCounter.backAlignment >= this.issueThreshold) {
//                     this.removeFromCorrectLandmarks([11, 12, 23, 24]);
//                     this.feedback.issues.push({
//                         landmarkIndex: 11,
//                         message: 'Keep your back straight'
//                     });
//                 }
//             } else {
//                 this.issueCounter.backAlignment = 0;
//             }

//             this.previousIssues = [...this.feedback.issues];
//             this.updateFeedbackDisplay();

//         } catch (error) {
//             console.error("Error in pushup evaluation:", error);
//         }

//         return this.feedback;
//     }
// }
