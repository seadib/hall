# 🏫 Dhaka College International Hall Management System

A 100% dynamic, modern, responsive web application and management system built for the students of the 11th Grade of **Dhaka College International Hall**.

This platform combines a premium, glassmorphic client-side interface with a secure, serverless Git-based database powered by **Decap CMS** (formerly Netlify CMS) to offer zero-maintenance, zero-code content management.

---

## ✨ Core Features

### 👥 Student Directory & Search
- Full list of hall residents with lazy-loaded profiles and dynamic content rendering.
- Real-time search by name, room number, section, or roll.
- Advanced filtering panel supporting search constraints by Group (Science, Arts, Commerce) and Blood Group.
- Custom interactive modal card for each student containing complete academic and contact details.

### 🛏️ Roommate & Allocation View
- Dynamic rooms viewer displaying room lists, custom descriptions, and room-specific photo galleries.
- Instant calculation and linking of roommates sharing the same room.

### 📝 Academic Results Portal
- Instant portal to view and download semester term results.
- Dynamic linkages to term-specific result PDFs (CT-1, CT-2, Half Yearly, CT-3, and Yearly Exams).

### ⚙️ Low-Credit Admin CMS (Decap CMS)
- Secure administrative portal accessible directly at `/admin/` via Netlify Identity.
- **Accordion-style management interface** with collapsed cards for fast, intuitive edits.
- **Optimized for Low Build Credits**: Powered by single-file list collections (`data/students.json` and `data/rooms.json`), allowing you to make dozens of edits, additions, or deletions across students and rooms, saving them in **one single commit and deploy** to save Netlify build minutes.
- Direct management over global settings, homepage sliders, rotating phrases, notice PDFs, custom logos, developer profiles, hall supervisors, and gallery cards.

### 🌐 Multilingual Engine
- Full real-time toggling between English (EN) and Bangla (BN) languages across the entire site without page reloads.

### ⚡ Premium UI/UX & Resiliency
- Built using glassmorphic styling, responsive flex/grid layouts, Outfit/Inter typography, and smooth AOS scroll animations.
- **Fail-Safe Fallbacks**: Auto-detection of broken or missing image files with instant inline white SVG vector icon replacements for contact links (Phone, WhatsApp, Email, Facebook, Messenger).

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+ / async/await API integration)
- **CMS Admin**: Decap CMS, Netlify Identity & Git Gateway
- **Automation Pipeliners**:
  - Python compiler (`scripts/build-data.py`) for local verification.
  - Node.js compiler (`scripts/build-data.mjs`) for automated production deployments.
- **Hosting**: Netlify & GitHub Pages

---

## 🚀 Getting Started

### Local Development
To run the project locally and view changes in your browser:
1. Double-click `index.html` or run a local server (e.g., Live Server in VS Code, or `python -m http.server`).
2. If you modify the JSON databases manually, run the local Python normalizer script to rebuild assets:
   ```bash
   python scripts/build-data.py
   ```

### Deploying to Production (Netlify + GitHub Pages)
This project is configured to auto-deploy to **GitHub Pages** and sync files via **Netlify Git Gateway**.
1. Push this repository to your GitHub account (e.g., `github.com/yourusername/hall`).
2. Log in to **Netlify** and import your repository.
3. Configure the build parameters:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.` (root directory)
4. Enable **Identity** in the Netlify dashboard:
   - Go to Site Configuration -> Identity -> Enable Identity.
   - Go to Services -> Git Gateway -> click **Enable Git Gateway** and link your GitHub account.
5. Go to your site's URL `/admin/` to register and log in to manage your website from any device!
