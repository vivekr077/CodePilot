import jwt from 'jsonwebtoken'

export const isLoggedIn = (req, res, next)=>{

     try {
        const token = req.cookies?.authToken;
        const JWT_KEY = process.env.JWT_KEY;
     
        if (!token) {
          return res.status(401).send({
          msg: "Unauthorized: No token provided",
          status: false,
          });
        }

        const decoded = jwt.verify(token, JWT_KEY);
        req.user = decoded;
        next();

     } catch (error) {
        return res.status(401).send({
          msg: "Unauthorized: Invalid or expired token",
          status: false,
     });
     }
}