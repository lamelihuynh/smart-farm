
import db from '../config/database.js'; 

export const saveData = async (req, res) => {
    const { deviceId, T, H, S, L } = req.body; 

    try {
        // Kiểm tra thiết bị
        const [device] = await db.query(
            'SELECT device_type_id FROM device WHERE device_id = ? LIMIT 1',
            [deviceId]
        );

        if (device.length === 0) {
            console.error(`[Lỗi] Không tìm thấy thiết bị ID: ${deviceId}`);
            return res.status(404).json({ error: "Thiết bị không tồn tại trong hệ thống" });
        }

        const deviceTypeId = device[0].device_type_id;
        const sensorUpdates = [
            { key: 'T', val: T },
            { key: 'H', val: H },
            { key: 'S', val: S },
            { key: 'L', val: L }
        ];

        for (let item of sensorUpdates) {
            if (item.val !== undefined && item.val !== null) {
                const [metric] = await db.query(
                    'SELECT sensor_metric_id FROM sensor_metric WHERE device_type_id = ? AND metric_key = ? LIMIT 1',
                    [deviceTypeId, item.key]
                );

                if (metric.length > 0) {
                    const metricId = metric[0].sensor_metric_id;
                    await db.query(
                        `INSERT INTO sensor_data (device_id, sensor_metric_id, raw_value, value, recorded_at) 
                         VALUES (?, ?, ?, ?, NOW())`,
                        [deviceId, metricId, String(item.val), item.val]
                    );
                }
            }
        }

        await db.query(
            'INSERT INTO system_logs (log_type, device_id, message, metadata) VALUES (?, ?, ?, ?)',
            ['SENSOR_DATA', deviceId, `Device ${deviceId} updated sensors`, JSON.stringify(req.body)]
        );

        console.log(`[OK] Đã nhận & lưu dữ liệu từ thiết bị ${deviceId}`);
        res.status(200).json({ success: true, message: "Dữ liệu đã lưu thành công" });

    } catch (err) {
        console.error("Lỗi Controller:", err);
        res.status(500).json({ error: "Lỗi hệ thống", details: err.message });
    }
};