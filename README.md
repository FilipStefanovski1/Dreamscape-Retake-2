Access the app at: https://dreamscape22.onrender.com/


# Dreamscape Retake 2

## 📌 Overview
**Dreamscape Retake 2** is an interactive web application built for **Digital Product 4 – Interactive UI Development**.  
It allows users to **scan real-world objects using their camera or upload an image**.  
The app uses **Teachable Machine** (local model) and **Hugging Face Inference API** (external model) for **image recognition**, then displays **recommendations** based on the detected object.

This version focuses on:
- Smooth, responsive UI
- Camera & image upload support
- Real-time recognition using a local model
- High-confidence recognition using an external API
- Clear navigation flow: **Home → Scan → Results**

---

## 🎯 Features
- **Responsive Layout** – works on mobile, tablet, and desktop
- **Camera Access** – capture images directly from the browser
- **Image Upload** – select from gallery/camera roll
- **Object Recognition**
  - **Local Model** – runs in-browser using `@teachablemachine/image`
  - **External API** – Hugging Face `google/vit-base-patch16-224` model
- **Top Predictions** – shows most likely objects with probabilities
- **Product Recommendations** – links to IKEA product pages
- **Camera Flip** – switch between front and back camera
- **Styled UI** – consistent design with animated scan frame

---

## 🛠 Tech Stack
- **Frontend:** React + Vite
- **Styling:** Inline styles + CSS animations
- **Machine Learning:**
  - Local: Teachable Machine Image Model
  - External: Hugging Face Vision Transformer
- **Routing:** React Router
- **Icons:** `react-icons`
- **Deployment:** Render

---

## ⚙️ Installation & Running Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/FilipStefanovski1/Dreamscape-Retake-2.git
cd Dreamscape-Retake-2

### 2️⃣ Make sure you have Node.js 18+ installed.
npm install

### 3️⃣ Create a .env file in the project root:
VITE_HF_TOKEN= generate a new token through HuggingFace

### 4️⃣ Run the Development Server
npm run dev

The app will be available at: http://localhost:5173

---

🔗 External Resources
Teachable Machine: https://teachablemachine.withgoogle.com/
Hugging Face API Docs: https://huggingface.co/docs/api-inference/detailed_parameters

---

Created by:
Filip Stefanovski
Interactive UI Development
