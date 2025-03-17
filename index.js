require('dotenv').config(); // โหลดค่าใน .env

const express = require('express');
const axios = require('axios');
const cors = require('cors');  

const app = express();
const port = process.env.PORT || 3000;

const DRONE_CONFIG_URL = process.env.DRONE_CONFIG_URL;
const DRONE_LOGS_URL = process.env.DRONE_LOGS_URL;

// Check API Status
app.get('/', (req, res) => {
  res.send('API running!!!');
});

const getDroneData = async (drone_id) => {
  try {
    const response = await axios.get(DRONE_CONFIG_URL, { params: { drone_id } });
    if (response.data.status === 'ok') {
      const drone = response.data.data.find(d => d.drone_id == drone_id);
      if (drone) {
        return drone;
      } else {
        throw new Error('Drone not found');
      }
    } else {
      throw new Error('Failed to fetch valid data');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw new Error('Failed to fetch drone data');
  }
};

app.get('/configs/:drone_id', async (req, res) => {
  const { drone_id } = req.params;
  try {
    const droneData = await getDroneData(drone_id);
    if (!droneData) {
      return res.status(404).json({ error: "Drone not found" });
    }
    const { drone_id: id, drone_name, light, country, weight } = droneData;
    res.json({ drone_id: id, drone_name, light, country, weight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/status/:drone_id', async (req, res) => {
  const { drone_id } = req.params;
  try {
    const droneData = await getDroneData(drone_id);
    if (!droneData) {
      return res.status(404).json({ error: "Drone not found" });
    }
    const { condition } = droneData;
    res.json({ condition });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getDroneLogs = async (drone_id) => {
  try {
    const response = await axios.get(DRONE_LOGS_URL, {
      params: {
        filter: `drone_id=${drone_id}`,
        sort: '-created',
        limit: 25,
      }
    });
    if (response.data && response.data.items) {
      return response.data.items.map(log => ({
        drone_id: log.drone_id,
        drone_name: log.drone_name,
        created: log.created,
        country: log.country,
        celsius: log.celsius
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching drone logs:', error.message);
    throw new Error('Failed to fetch drone logs');
  }
};

app.get('/logs/:drone_id', async (req, res) => {
  const { drone_id } = req.params;
  try {
    const logs = await getDroneLogs(drone_id);
    if (logs.length === 0) {
      return res.status(404).json({ error: "No logs found for the drone" });
    }
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/logs', async (req, res) => {
  try {
    const { drone_id, drone_name, country, celsius } = req.body;
    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await axios.post(DRONE_LOGS_URL, { drone_id, drone_name, country, celsius });
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating log:', error.message);
    res.status(500).json({ error: "Failed to create log entry" });
  }
});

app.use(express.json());  
app.use(cors()); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});