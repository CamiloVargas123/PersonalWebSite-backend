const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "ka1sd3aSFDkdT6P0hkjÑ5gd35dDD23";

exports.createAccessToken = function(user){
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        createtoken: moment().unix(),
        exp: moment().add(3, "hours").unix()
    }
    return jwt.encode(payload, SECRET_KEY);
}

exports.createRefreshToken = function(user){
    const payload = {
        id: user._id,
        exp: moment().add(30, "days").unix()
    }
    return jwt.encode(payload, SECRET_KEY);
}

exports.decodeToken = token => {
 return jwt.decode(token, SECRET_KEY, true);
}