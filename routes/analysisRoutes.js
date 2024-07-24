import express from 'express';
import { downloadDataCsv, getAnalysisData } from '../controllers/AnalysisController.js';

const app = express();
const router = express.Router();


router.get("/getAnalysisData", getAnalysisData);
router.post("/downloadDataCsv", downloadDataCsv);

export default router;