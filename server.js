// Import libraries
const express = require("express");
const app = express();
const cors = require("cors");

// Import routes
const userRouter = require("./routes/userRoutes");
const photoRouter = require("./routes/photoRooutes");
const likeRouter = require("./routes/likeRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/', userRouter)
app.use('/photos', photoRouter)
app.use('/like', likeRouter)
app.use( "/uploads", express.static("uploads"))

// Run server
const port = 4000;
app.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi"`);
});
