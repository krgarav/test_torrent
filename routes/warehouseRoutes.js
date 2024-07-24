import express from 'express';
import { addFile, getFilDataFromBarcode, issueFile, returnFile } from '../controllers/warehouseController.js';


const router = express.Router();


router.post("/addFile", addFile);
router.post("/issueFile", issueFile);
router.post("/returnFile", returnFile);
router.post("/getFileDataFromBarcode", getFilDataFromBarcode);


export default router;