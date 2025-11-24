import express from 'express'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma.js';
import userRoute from './route/userRoute.js';
import cookieParser from 'cookie-parser';
import codeRoute from './route/codeGeneratorRoute.js';
import cors from 'cors'

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
      app.use(cookieParser());
      
      // CORS configuration
      const allowedOrigins = [
        'http://localhost:5173',
        'https://codecopilot.onrender.com',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      app.use(cors({
        origin: function(origin, callback) {
         
          if (!origin) return callback(null, true);
          
          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(null, true);
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
      }));

      app.get('/health', (req, res) => {
         res.status(200).json({ status: 'ok', message: 'Server is awake' });
      });

      app.use('/api/v1', userRoute);
      app.use('/api/v1', codeRoute);
}

setupAndStartServer();