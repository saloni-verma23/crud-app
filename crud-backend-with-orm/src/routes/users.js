import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, dob, mobile, address } = req.body;
    const user = await prisma.users.create({
      data: {
        first_name,
        last_name,
        dob: new Date(dob),
        mobile,
        address,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, dob, mobile, address } = req.body;
    const user = await prisma.users.update({
      where: { id: Number(id) },
      data: {
        first_name,
        last_name,
        dob: new Date(dob),
        mobile,
        address,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router;
