# 🚀 Drone API  
An API for drone configuration and logs, built with **Express.js** and deployed on **Vercel**.  

📌 **GitHub Repository:**  
👉 [TeerapatP-Project/api_webapp](https://github.com/TeerapatP-Project/api_webapp.git)  

🌐 **Live API:**  
👉 [api-webapp.vercel.app](https://api-webapp.vercel.app)  

---

## 📌 **API Endpoints**  

### ✈️ **Drone Configs**  
📍 **Get drone configuration**  
\`\`\`http
GET /configs/:drone_id

📍 **Get drone status**  
\`\`\`http
GET /status/:drone_id
\`\`\`

### 📜 **Drone Logs**  
📍 **Get the latest 25 logs for a drone**  
\`\`\`http
GET /logs/:drone_id
\`\`\`

📍 **Add a new drone log**  
\`\`\`http
POST /logs
Content-Type: application/json

{
  "drone_id": "123",
  "drone_name": "Drone-X",
  "country": "USA",
  "celsius": 25
}
\`\`\`

---

## 🖥 **Running Locally**  

If you want to run this API on your local machine, follow these steps:

1️⃣ **Clone this repository**  
\`\`\`sh
git clone https://github.com/TeerapatP-Project/api_webapp.git
cd api_webapp
\`\`\`

2️⃣ **Install dependencies**  
\`\`\`sh
npm install
\`\`\`

3️⃣ **Start the server**  
\`\`\`sh
node index.js
\`\`\`

4️⃣ **The API will be available at:**  
\`\`\`sh
http://localhost:3000
\`\`\`

---

## 📄 License  

This project is licensed under the MIT License.  

---

✨ **Developed by:** TeerapatP-Project  
🚀 **Powered by:** Express.js & Vercel  

