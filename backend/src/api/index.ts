import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRouter from '../routers/userRouter'
import salesRouter from '../routers/salesRouter'
import dataRouter from '../routers/dataRouter'
import adminRouter from "../routers/adminRouter"


const app = express();
app.use(express.json());

// TODO : remove cors and configure proxy from frontend
app.use(cors());

const port = process.env.PORT || 3000;

app.get('/api/v1/health', (req, res) => {
    res.send('Perfect Health');
})

app.use('/api/v1/user', userRouter);
app.use('/api/v1/sales', salesRouter);
app.use('/api/v1/data', dataRouter);
app.use('/api/v1/admin', adminRouter);

app.listen(port, () => {
    console.log(`Server Started at port : ${port}`);
})
