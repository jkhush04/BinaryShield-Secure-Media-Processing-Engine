# BinaryShield — Secure Media Processing Engine

BinaryShield is a **secure, worker-based media processing backend** built with Node.js that performs **image, video, and document conversions entirely in memory** while enforcing strict validation, concurrency limits, and resource protection.

The goal of this project is to explore **secure backend architecture for file processing systems** similar to real-world media services.

This project demonstrates how to design a **safe, scalable media conversion API** while protecting system resources and user privacy.

---
# Core Technologies

- Node.js
- Express.js
- Sharp (image processing)
- FFmpeg (video processing)
- PDFKit (PDF generation)
- Multer (file uploads)
- p-limit (concurrency control)

---

# Architecture Overview

BinaryShield uses a **worker-based media processing architecture** where uploaded files pass through multiple protection layers before reaching processing workers.

<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/07821ee0-ebab-45d3-99de-9f5ee54f5467" />


---

# API Endpoints

## Image Conversion

POST /images/convert

Example request:

curl -X POST http://localhost:5000/images/convert
-F "file=@image.png"
-F "format=webp"


---

## Video Conversion


POST /videos/convert

Example:

curl -X POST http://localhost:5000/videos/convert
-F "file=@video.mkv"
-F "format=mp4"

---

## Images → PDF
POST /pdf/images-to-pdf

Example:

curl -X POST http://localhost:5000/pdf/images-to-pdf
-F "images=@img1.jpg"
-F "images=@img2.png"

---
# Project Structure
src
│
├── controllers
│
├── middlewares
│ ├── imageValidation.js
│ ├── videoValidation.js
│ └── pdfValidation.js
│
├── workers
│ ├── imageWorker.js
│ ├── videoWorker.js
│ └── pdfWorker.js
│
├── routes
│
├── utils
│ └── queueManager.js
│
└── server.js


