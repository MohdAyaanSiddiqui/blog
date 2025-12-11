const {Router} = require('express');
const user = require('../models/user')
const router = Router();

router.get("/signin", (req,res)=>{
    return res.render("signin");
});

router.get("/signup", (req,res)=>{
    return res.render("signup");
});

router.post('/signin', async (req,res)=>{
    const {email,password} = req.body;
    try{
        
    const token = await user.matchPassword(email,password);

    return res.cookie("token",token).redirect("/")
    }catch(error){
        return res.render("signin",{
            error:"incorrect Email and Password"
        })
    }
});
router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/")
})
router.post('/signup', async (req,res) =>{
    const {fullname , email , password} = req.body;
    await user.create({
        fullname,
        email,
        password
    })
    return res.redirect("/")
});

module.exports = router;