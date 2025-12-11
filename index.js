const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const blog = require('./models/blog')
const User = require('./models/user')

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog')

const { checkForAuth } = require('./middleware/authentication');


const app = express();
const PORT = 8001;

mongoose
  .connect("mongodb://127.0.0.1:27017/short-url")
  .then(async () => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.set("view engine", "ejs")
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuth("token"))
app.use(express.static(path.resolve('./public')))
app.use(express.json());
app.use((req,res,next)=>{
    // Ensure these locals always exist in all views
    res.locals.user = req.user || null;
    res.locals.error = null;
    next();
})

app.get("/", async (req,res)=>{
    const allBlogs = await blog.find({});
    res.render("home",{ blogs:allBlogs });
    console.log(allBlogs);
})

app.use("/user",userRoute)
app.use("/blog",blogRoute)

app.listen(PORT,()=>{
    console.log(`Server Running At ${PORT}`)
})

//DevDependencies are those dependencies which are use in Devlopment envoirnment 