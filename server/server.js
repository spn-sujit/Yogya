import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/db.js';
import UserRouter from './routes/UserRoute.js';
import connectCloudinary from './config/cloudinary.js';
import SessionRouter from './routes/SessionRoute.js';


const app = express();
 
await connectDb();
await  connectCloudinary();

app.use(cors());


app.use(express.json());


app.get('/',(req,res)=>res.send('API  working'));

app.use('/api/user',UserRouter);
const port = process.env.PORT || 5000;

app.use('/api/session',SessionRouter);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})