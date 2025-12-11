const {validateToken} = require("../services/authentication")

function checkForAuth(cookieName = "token"){
    return (req,res,next)=>{
        const tokenvalue = req.cookies && req.cookies[cookieName];
        if(!tokenvalue) return next();
        
        try{
            const userPayload = validateToken(tokenvalue);
            req.user = userPayload;
            res.locals.user = userPayload;
            
        }catch(err){};
        
        return next();
    }
}

// Require a logged-in user for protected routes
function requireUser(req, res, next) {
    if (!req.user) {
        return res.redirect("/user/signin");
    }
    next();
}

module.exports = { checkForAuth, requireUser };
