import { prisma } from "../lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const createUserController = async (req, res) => {
  console.log("hii");
   const { name, email, password } = req.body;
   console.log(name, email, password);
   
   if(!name || !email || !password){
      res.send("some field is missing")
   }
   const SALT = Number(process.env.SALT);

   try {
      console.log("holla");
      const hashedPassword = await bcrypt.hash(password, SALT);
      console.log("before prisma")
       const user = await prisma.user.create({
         data: {name, email, password: hashedPassword}
         });
      console.log("after prisma")
       res.send({
          msg: "New User Created Successfully",
          user
       })  
   }catch (error) {
      console.log("Error while creating user");
      res.send({
         msg: "Something went wrong while creating user",
         error: error
      })
   }
}


export const loginController = async (req, res) => {
  const JWT_KEY=process.env.JWT_KEY;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("some field is missing");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).send({ msg: "User not found" });
    console.log(user);

    const status = await bcrypt.compare(password, user.password);
    console.log(status);

    if(!status){
      return res.status(401).send({
          msg: "Either EmailId or Password is Incorrect",
          status: false
      })
    }
    
    // token generation
    var token = jwt.sign({
          userId: user?.id,
         }, 
      JWT_KEY,{ expiresIn: "7d"});

    res.cookie("authToken", token, {
       httpOnly: true,
       secure: true, 
       sameSite: "none",
       maxAge: 7 * 24 * 60 * 60 * 1000,
    })
      
    return res.status(200).send({
      msg: "password verified successfully",
      status,
    });
    
  } catch (error) {
    console.log("Something went wrong while verifying password", error);

    return res.send({
      msg: "password verification failed",
      status: false,
    });
  }
};

