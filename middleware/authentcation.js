const jwt = require('jsonwebtoken');


exports.authentcation = async (req, res ,next) =>{
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
          return res.status(403).json({ message: "Token berilmadi" });
        }
    
        const token = authHeader.split(" ")[1]; // "Bearer TOKEN" dan tokenni ajratib olish
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "men senga bir gap aytaman ,hech kim bilmasin");
        next();
        console.log(decoded); 
    } catch (error) {
        return res.status(403).json({
            message:error.message,
        })
        
    }
}