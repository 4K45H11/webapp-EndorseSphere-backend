const jwt = require('jsonwebtoken')

exports.generateToken = (role,id)=>{
    const token = jwt.sign({id,role},process.env.JWT_KEY,{expiresIn:'1d'});

    return token;
}
