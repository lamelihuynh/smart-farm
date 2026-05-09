-- Insert sample activity logs
INSERT INTO activity_log (user_id, action, target_type, target_name, changes, zone_id, zone_name, device_name, ip_address, user_role, user_name) VALUES
(1, 'Create', 'Device', 'Sensor 1', 'Created device: Sensor 1', 1, 'Zone A', 'Sensor 1', '192.168.1.100', 'admin', 'Admin User'),
(1, 'Update', 'Device', 'Sensor 1', 'Updated device: Sensor 1', 1, 'Zone A', 'Sensor 1', '192.168.1.100', 'admin', 'Admin User'),
(2, 'Create', 'Threshold', 'Temperature Threshold', 'Created threshold for temperature', 1, 'Zone A', NULL, '192.168.1.101', 'operator', 'Operator User'),
(1, 'Assign', 'Zone Assignment', 'Zone A to Operator', 'Assigned zone to operator', 1, 'Zone A', NULL, '192.168.1.100', 'admin', 'Admin User'),
(2, 'Control', 'Device', 'Pump 1', 'Turned on pump', 1, 'Zone A', 'Pump 1', '192.168.1.101', 'operator', 'Operator User');