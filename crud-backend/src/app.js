import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
})

