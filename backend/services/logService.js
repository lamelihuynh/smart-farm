import pool from '../config/database.js';

export const logActivity = async (activityData) => {
  const {
    userId,
    action,
    targetType,
    targetName,
    changes = null,
    zoneId = null,
    zoneName = null,
    deviceName = null,
    ipAddress = null,
    userRole,
    userName
  } = activityData;

  try {
    const conn = await pool.getConnection();
    await conn.query(`
      INSERT INTO activity_log (user_id, action, target_type, target_name, changes, zone_id, zone_name, device_name, ip_address, user_role, user_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, action, targetType, targetName, changes, zoneId, zoneName, deviceName, ipAddress, userRole, userName]);
    conn.release();
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error to avoid breaking main functionality
  }
};