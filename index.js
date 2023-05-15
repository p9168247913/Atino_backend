require("dotenv").config();
const express = require("express");
const cors = require('cors');
const connection = require("./config/db");
const { auth } = require("./middlewares/auth");
const userRouter = require("./router/user.route");
const contactRoute = require("./router/contact.route")

const app =  express();
app.use(cors({origin:"*"}))
app.use(express.json());

app.use(express.urlencoded({extended:true}))


app.use("/user", userRouter)


app.use(auth)

app.use("/contact", contactRoute)


app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to Mongo Atlas");
  } catch (err) {
    console.log(err)
    console.log("Couldn't connect to Mongo Atlas");
  }
  console.log(`Server started on port ${process.env.port}`);
});
