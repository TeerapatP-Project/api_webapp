# Drone API

This is an API for drone configuration and logs, built with Express.js and deployed on Vercel.

## 🚀 Deployment  
The API is live at:  
👉 [api-webapp.vercel.app](https://api-webapp.vercel.app)

## 📌 API Endpoints  

### **Drone Configs**  
- **GET `/configs/:drone_id`** → Get drone configuration  
- **GET `/status/:drone_id`** → Get drone status  

### **Drone Logs**  
- **GET `/logs/:drone_id`** → Get the latest 25 logs for a drone  
- **POST `/logs`** → Add a new drone log  

## 🖥 Running Locally  
If you want to run this API on your local machine, follow these steps:

1. Clone this repository:
   ```sh
   git clone https://github.com/TeerapatP-Project/api_webapp.git
   cd api_webapp
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the server:
   ```sh
   node index.js
   ```

4. The API will be available at:
   ```
   http://localhost:3000
   ```

## 📄 License  
This project is licensed under the MIT License.