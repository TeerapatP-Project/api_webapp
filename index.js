const express = require('express');
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// ฟังก์ชันดึงข้อมูล drone
const getDroneData = async (drone_id) => {
  const url = `https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjUB1VghU97Ev2_i9G8JrmjYXughARdNKhGMEWkU29bbAbzv-CeGONJwsHtzwwHzBSFbCvkg2l8DwNt4uo0w_WHUlKPD5hhE9kqnTiGToTmG6ihhWnaVZGgYwpZ_wd5rB7dIiEBjlVYcrelqg7l3v9BDx94orSKBpOffpmZ26AV9x1igqzjbPRpdmWek2a1mIyMfbWONvhZm3q0y70D4_gueO32JZ2PnL54-T0oiqn6HFwMLolOU5FqPWCBJc_sipWx5F_Ltn_FLtkrI8dmu7Akk4yqqGZyAH9u6k6A&lib=M9_yccKOaZVEQaYjEvK1gClQlFAuFWsxN`;
  try {
    const response = await axios.get(url, { params: { drone_id } });

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

/**
 * @swagger
 * /configs/{drone_id}:
 *   get:
 *     summary: Get drone information
 *     description: Retrieve details of a specific drone using its ID.
 *     tags: 
 *       - Drone
 *     parameters:
 *       - in: path
 *         name: drone_id
 *         required: true
 *         description: The ID of the drone to fetch data for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drone information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 drone_id:
 *                   type: string
 *                 drone_name:
 *                   type: string
 *                 light:
 *                   type: string
 *                 country:
 *                   type: string
 *                 weight:
 *                   type: number
 *       404:
 *         description: Drone not found.
 *       500:
 *         description: Server error.
 */
app.get('/configs/:drone_id', async (req, res) => {
    const { drone_id } = req.params;
    try {
      const droneData = await getDroneData(drone_id);
  
      if (!droneData) {
        return res.status(404).json({ error: "Drone not found" });
      }
  
      // ดึงเฉพาะค่าที่ต้องการจาก droneData
      const { drone_id: id, drone_name, light, country, weight } = droneData;
  
      res.json({ drone_id: id, drone_name, light, country, weight });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /status/{drone_id}:
 *   get:
 *     summary: Get drone status
 *     description: Retrieve the operational condition of a specific drone.
 *     tags:
 *       - Drone
 *     parameters:
 *       - in: path
 *         name: drone_id
 *         required: true
 *         description: ID of the drone to retrieve its condition.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 condition:
 *                   type: string
 *       404:
 *         description: Drone not found.
 *       500:
 *         description: Server error.
 */
app.get('/status/:drone_id', async (req, res) => {
    const { drone_id } = req.params;
    try {
      const droneData = await getDroneData(drone_id);
  
      if (!droneData) {
        return res.status(404).json({ error: "Drone not found" });
      }
  
      // ดึงเฉพาะค่าที่ต้องการจาก droneData
      const { condition } = droneData;
  
      res.json({ condition });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// ฟังก์ชันดึงข้อมูล logs จาก Server2
const getDroneLogs = async (drone_id) => {
  try {
    const url = 'https://app-tracking.pockethost.io/api/collections/drone_logs/records';
    const response = await axios.get(url, {
      params: {
        filter: `drone_id=${drone_id}`,
        sort: '-created', // เรียงจากใหม่ไปเก่า
        limit: 25, // จำกัด 25 รายการ
      }
    });

    if (response.data && response.data.items) {
      // กรองเฉพาะ fields ที่ต้องการ
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

/**
 * @swagger
 * /logs/{drone_id}:
 *   get:
 *     summary: Get drone logs
 *     description: Retrieve the last 25 logs of a specific drone, sorted by created time (newest first).
 *     tags:
 *       - Drone Logs
 *     parameters:
 *       - in: path
 *         name: drone_id
 *         required: true
 *         description: The ID of the drone to retrieve logs for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   drone_id:
 *                     type: integer
 *                   drone_name:
 *                     type: string
 *                   created:
 *                     type: string
 *                     format: date-time
 *                   country:
 *                     type: string
 *                   celsius:
 *                     type: number
 *       404:
 *         description: No logs found for the drone.
 *       500:
 *         description: Server error.
 */
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

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Drone API',
      version: '1.0.0',
      description: 'API to retrieve drone information by drone_id',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [__filename],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
});
