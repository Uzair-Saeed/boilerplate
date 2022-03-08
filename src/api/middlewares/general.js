import formidable from 'formidable'
import cryptoJS from 'crypto-js';
// ***************************************************************
// Middleware to attach files and field to form data requests
// To Parse Form Data
// ***************************************************************

const attachBodyAndFiles = (req, res, next) => {
    console.log("Attach File Function Called")
    let form = new formidable.IncomingForm()

    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.status(500).json({
                success: false,
                msg: "General Middleware File Handling Error",
                err
            })
        }

        req.files = []
        for (const key in files) {
            if (files.hasOwnProperty(key)) {
                const element = files[key]
                req.files.push(element)
            }
        }
        req.body = fields
        next()
    })
}

const tokenDecrypt = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.length) {
            let error = new Error();
            error.message = "Unauthorized";
            error.name = "notfound"
            error.status = 401;
            throw error
        }
        let token = req.headers.authorization.slice(7);
        token = await decryptData(token).catch((e) => { throw e })
        req.headers.authorization = 'Bearer ' + token;
        next()
    } catch (e) {
        console.log(e)
        next(e)
    }

}

// *************
// Encrypt
// *************

const encryptData = async (value) => {
    return new Promise(function (resolve, reject) {
        try {
            let data = cryptoJS.AES.encrypt(value, process.env.CRYPTO).toString();
            if (!data) throw "Cannot Encrypt Data"
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

// *************
// Decrypt
// *************

const decryptData = async (value) => {
    return new Promise(function (resolve, reject) {
        try {
            let bytes = cryptoJS.AES.decrypt(value, process.env.CRYPTO);
            if (!bytes) throw `Cannot Decrypt Value '${value}'`;
            let originalText = bytes.toString(cryptoJS.enc.Utf8);
            if (!originalText) throw `Cannot Decrypt Value '${value}'`;
            resolve(originalText)
        } catch (e) {
            reject(e)
        }
    })
}

export default {
    attachBodyAndFiles,
    encryptData,
    decryptData,
    tokenDecrypt
}