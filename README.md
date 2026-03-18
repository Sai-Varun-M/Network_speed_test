# 🚀 Network Speedtest

A premium, purely static web application to accurately measure your network's download and upload speeds using exact 512Mb (64MB) data payloads!

![Speedtest UI Preview](https://img.shields.io/badge/UI-Premium_Glassmorphism-8a2be2?style=flat-square) ![Architecture](https://img.shields.io/badge/Architecture-100%25_Static-success?style=flat-square)

## 🌟 Features

- **Modern & Dynamic UI**: Built with beautiful glassmorphism gradients, sleek animations, and an engaging circular SVG gauge to track network activity in real-time.
- **Accurate 512Mb Network Testing**: Tests your connection exactly against massive 64 Megabyte (512 Megabits) payloads in both directions.
- **100% Frontend Architecture**: Zero custom backend required! The application connects seamlessly to [Cloudflare's Edge Network Speedtest APIs](https://speed.cloudflare.com/) to process dummy data instantly via their global CDN.
- **GitHub Pages Ready**: Out-of-the-box compatibility with simple static hosting like GitHub Pages.

## 🛠️ Tech Stack

- **HTML5 & Vanilla CSS**: Utilizing modern UI elements like CSS variables, glowing drop-shadows, and smooth transitions.
- **Vanilla JavaScript**: Fetching native `XMLHttpRequest` progression events to track byte-level throughput for precise Mbps calculation algorithms.
- **Cloudflare public endpoints**: Leveraging the reliable `__down` and `__up` Cloudflare speedtest testing API endpoints to ensure maximum test bandwidth.

## 📦 How to Run Locally

Since the app is entirely decentralized and static, you can serve it using any basic HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx http-server -p 8080
```
Then simply navigate to `http://localhost:8080` in your web browser.

## 🌐 Deploying to GitHub Pages

This repository is pre-configured to be hosted directly on **GitHub Pages**:
1. Navigate to your repository's **Settings** tab.
2. Under "Code and automation" on the sidebar, click on **Pages**.
3. Under "Build and deployment", set the source to **Deploy from a branch**.
4. Select your **`main`** branch and the **`/ (root)`** folder, then hit **Save**.
5. Your Speedtest will be live instantly on your `github.io` domain!

---
*Built for precision and visual excellence.* 🚀