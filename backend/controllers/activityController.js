import pool from '../config/database.js';

const getActivityLogs = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    // Build query with filters
    let query = `
      SELECT al.*, u.user_name, u.user_type as user_role
      FROM activity_log al
      JOIN user u ON al.user_id = u.user_id
    `;
    const params = [];
    const conditions = [];

    if (req.query.type && req.query.type !== 'all') {
      conditions.push('al.target_type = ?');
      params.push(req.query.type);
    }

    if (req.query.user && req.query.user !== 'all') {
      conditions.push('al.user_id = ?');
      params.push(req.query.user);
    }

    if (req.query.action && req.query.action !== 'all') {
      conditions.push('al.action = ?');
      params.push(req.query.action);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY al.timestamp DESC';

    const [logs] = await conn.query(query, params);
    conn.release();

    res.json({ data: logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getActivityLogs };