import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, searchUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;