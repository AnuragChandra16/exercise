# 🏋️ Real-Time AI-Based Exercise Evaluation Web App

## 🚀 Live Demo
🔗 [Click here to try the app](https://exercise-il39.onrender.com/)

## 📹 Demo Video
🎥 [Watch the 2-minute demo](https://drive.google.com/file/d/1H1ZZY9DLL04CN2IwvzanbJnb0r5VFGvs/view?usp=drive_link)

---

## 📌 Overview

A **real-time fitness posture evaluation app** built with **MediaPipe**,  **Three.js**, and a **Flask backend**. Users can choose between **Squats** and **Push-Ups**, 
receive real-time posture feedback via color-coded joints, and get **3D annotations** for incorrect poses.

---

## 🧠 Features

- ✅ **Pose Detection** via MediaPipe (Web)
- ✅ **Exercise Selector**: Start Squats / Start Push-Ups
- ✅ **Rule-Based Logic**: Detect improper posture in phases
- ✅ **Color Feedback**: Red = Incorrect, Green = Correct
- ✅ **3D Labels** via Three.js
- ✅ **Responsive UI**: Works on desktop & mobile
- ✅ **Python Backend** (Flask) to support any server-side logic (e.g., logging reps, analytics, etc.)

---

## 🧰 Tech Stack

| Area              | Tools Used                      |
|-------------------|----------------------------------|
| Frontend          | HTML, CSS, JavaScript,           |
| Pose Detection    | MediaPipe Pose Landmarker (Web)  |
| 3D Visualization  | Three.js                         |
| Backend (Optional)| Python, Flask                    |
| Hosting           | Rednder  |

---

## 📦 Folder Structure
Project/
├── app.py
├── static/
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   ├── mediapipe-handler.js
│   │   ├── squat-evaluator.js
│   │   └── pushup-evaluator.js
│   └── index.html


## 🧪 Local Development Setup

### 🔧 Prerequisites

- Node.js & npm
- Python 3.x
- Flask (`pip install flask`)


cd backend
pip install -r requirements.txt
python app.py

