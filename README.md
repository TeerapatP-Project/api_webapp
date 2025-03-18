Drone API Server

This project is an Express-based API for managing drone configurations and logs. The API is deployed on Vercel using Vercel’s web interface.

Features
	•	Retrieve Drone Configurations – Get details such as ID, name, light status, country, and weight.
	•	Check Drone Status – Fetch the drone’s current condition.
	•	Retrieve Drone Logs – Get the latest 25 logs for a specific drone.
	•	Create Drone Logs – Add new log entries.

API Endpoints

1. Check API Status

GET /
	•	Response: "API running!!!"

2. Get Drone Configurations

GET /configs/:drone_id
	•	Response:
 
 
 
 
