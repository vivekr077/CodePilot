import express from 'express'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma.js';
import userRoute from './route/userRoute.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT;


const setupAndStartServer = async() => {
      await prisma.$connect();
      console.log("DB connected");

      app.listen(PORT, ()=>{
         console.log("Server started running on PORT:", PORT)
      });
      
      app.use(express.json());
      app.use(express.urlencoded());
      app.use('/api/v1', userRoute);
}

setupAndStartServer();