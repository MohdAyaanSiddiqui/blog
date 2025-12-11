const JWT = require('jsonwebtoken');
const secret = "$uperman@123"

function createToken(user){
    const payload = {
        _id: user._id,
        email: user.email,
        ProfileImage: user.ProfileImage,
        Role: user.Role
    };
    return JWT.sign(payload,secret);
}
function validateToken(token){
    return JWT.verify(token, secret);
}
module.exports = {createToken , validateToken };