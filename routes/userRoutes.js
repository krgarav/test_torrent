import express from 'express';
import { updateUser, createUser, getAllUsers, deleteUser, loginUser } from '../controllers/userController.js';

const router = express.Router();


router.post('/createUser', createUser);
router.put('/updateUser/:id', updateUser);
router.get('/getAllUsers', getAllUsers);
router.delete('/deleteUser/:id', deleteUser);
router.post('/login', loginUser);


export default router;