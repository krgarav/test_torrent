import express from 'express';
import { scan } from '../controllers/scannerController.js';
import multer from 'multer';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.post("/scan", scan);


export default router;