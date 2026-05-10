import express from 'express';
import * as sensorController from '../controllers/sensorController.js';

const router = express.Router();

router.post('/data', sensorController.saveData);

export default router;