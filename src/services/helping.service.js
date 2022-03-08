import jwt from 'jsonwebtoken'
import config from '../config/config.js';

// **************************
// sign jwt token
// **************************

let jwtConfig = {
    jwtOptions: {
        'secretOrKey': config.jwtOptions.secretOrKey || process.env.secretOrKey,
        'ignoreExpiration': config.jwtOptions.ignoreExpiration || process.env.ignoreExpiration
    }
}

const signLoginData = (userInfo) => {
    return new Promise((resolve, reject) => {
        var token = jwt.sign(userInfo, jwtConfig.jwtOptions.secretOrKey, { expiresIn: 180000000 })
        return resolve(token)
    })
}


export default {
    signLoginData
};