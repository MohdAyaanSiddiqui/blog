const {Router} = require('express');
const multer = require('multer');
const path = require('path');

const blog = require('../models/blog')
const { requireUser } = require('../middleware/authentication');

const router = Router()

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null,path.resolve(`./public/upload`))
    },
    filename: function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName)
    }
})
const upload = multer({ storage:storage })

router.get("/add-new", requireUser, (req,res)=>{
    return res.render('partials/addBlog',{
        user: req.user
    })
})

router.post("/", requireUser, upload.single('coverImage'), async(req,res)=>{
    const {title,body} = req.body;
    const Blog = await blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImage: `/upload/${req.file.filename}`
    })
    return res.redirect(`/blog/${Blog._id}`);
})

// View a single blog by id
router.get("/:id", async (req, res) => {
    const Blog = await blog.findById(req.params.id);
    if (!Blog) {
        return res.redirect("/");
    }
    return res.render("blog", { blog: Blog });
});

module.exports = router
