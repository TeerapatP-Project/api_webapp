const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

// Check API Status
app.get("/", (req, res) => {
  res.send("API running!!!");
});

// API Assignment #1 Drone Configs Sever
const getDroneData = async (drone_id) => {
  const url = `https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjUB1VghU97Ev2_i9G8JrmjYXughARdNKhGMEWkU29bbAbzv-CeGONJwsHtzwwHzBSFbCvkg2l8DwNt4uo0w_WHUlKPD5hhE9kqnTiGToTmG6ihhWnaVZGgYwpZ_wd5rB7dIiEBjlVYcrelqg7l3v9BDx94orSKBpOffpmZ26AV9x1igqzjbPRpdmWek2a1mIyMfbWONvhZm3q0y70D4_gueO32JZ2PnL54-T0oiqn6HFwMLolOU5FqPWCBJc_sipWx5F_Ltn_FLtkrI8dmu7Akk4yqqGZyAH9u6k6A&lib=M9_yccKOaZVEQaYjEvK1gClQlFAuFWsxN`;
  try {
    const response = await axios.get(url, { params: { drone_id } });
    if (response.data.status === "ok") {
      const drone = response.data.data.find((d) => d.drone_id == drone_id);
      if (drone) {
        return drone;
      } else {
        throw new Error("Drone not found");
      }
    } else {
      throw new Error("Failed to fetch valid data");
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new Error("Failed to fetch drone data");
  }
};

app.get("/configs/:drone_id", async (req, res) => {
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

app.get("/status/:drone_id", async (req, res) => {
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

// API Assignment #1 Drone Logs Sever
const getDroneLogs = async (drone_id) => {
  try {
    const url =
      "https://app-tracking.pockethost.io/api/collections/drone_logs/records";
    const response = await axios.get(url, {
      params: {
        filter: `drone_id="${drone_id}"`, 
        sort: "-created",
        limit: 25, 
      },
    });

    if (response.data && response.data.items) {
      return response.data.items.slice(0, 25).map((log) => ({
        drone_id: log.drone_id,
        drone_name: log.drone_name,
        created: log.created,
        country: log.country,
        celsius: log.celsius,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching drone logs:", error.message);
    throw new Error("Failed to fetch drone logs");
  }
};

app.get("/logs/:drone_id", async (req, res) => {
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

app.use(express.json());

app.post("/logs", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Missing request body" });
    }

    const { drone_id, drone_name, country, celsius } = req.body;

    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const url =
      "https://app-tracking.pockethost.io/api/collections/drone_logs/records";
    const response = await axios.post(
      url,
      { drone_id, drone_name, country, celsius },
      {
        headers: {
          Authorization: "Bearer 20250301efx",
          "Content-Type": "application/json",
        },
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error creating log:", error.message);
    res.status(500).json({ error: "Failed to create log entry" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
