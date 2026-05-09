// routes/activity.js
import express from "express";
const router = express.Router();
import pool from "../config/database.js";

router.get("/", async (req, res) => {
  const { type, user, action } = req.query;

  let query = `SELECT
    al.id,
    al.action,
    al.target_type AS targetType,
    al.target_name AS targetName,
    al.changes,
    al.user_id AS userId,
    al.user_name AS userName,
    al.user_role AS userRole,
    al.device_name AS deviceName,
    al.zone_name AS zoneName,
    al.zone_id AS zoneId,
    al.ip_address AS ipAddress,
    al.timestamp
    FROM activity_log al
    WHERE 1=1`;
  const params = [];

  if (type) {
    query += " AND al.target_type = ?";
    params.push(type);
  }

  if (user) {
    query += " AND al.user_id = ?";
    params.push(user);
  }

  if (action) {
    query += " AND al.action = ?";
    params.push(action);
  }

  query += " ORDER BY al.timestamp DESC";

  const [rows] = await pool.query(query, params);

  res.json({
    data: rows
  });
});

export default router;