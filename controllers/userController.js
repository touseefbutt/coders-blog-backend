//<====== Importing express validator ======>
const { body, validationResult } = require('express-validator');
//<====== Importing and configuring dotenv for Port ======>
require('dotenv').config();
//<====== Importing User Model ======>
const USER = require('../models/userModel');
//<====== Importing Bcrypt ======>
const bcrypt = require('bcrypt');
//<====== Importing JsonwebToken ======>
const jwt = require('jsonwebtoken');

//<====== JWT Token ======>\
const createToken = (user) => {
    return jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: '2d'
    });
}

//<====== Register Validation Module ======>
module.exports.registerValidations = [
    body('firstName').not().isEmpty().trim().withMessage("First Name is Require!"),
    body('lastName').not().isEmpty().trim().withMessage("Last Name is Require!"),
    body('email').not().isEmpty().trim().withMessage("Email is Require!"),
    body('password').isLength({ min: 6 }).withMessage("Password must be 6 character long")

];

//<====== Registration Module ======>
module.exports.register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() })
    }
    try {
        const checkUser = await USER.findOne({ email })
        if (checkUser) {
            return res.status(400).json({ error: [{ msg: 'Email already Taken!' }] })
        }
        //<====== Encrypt Password with hash and salt======>
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        try {
            const user = await USER.create({
                firstName,
                lastName,
                email,
                password: hash,
            });
            const token = createToken(user)
            return res.status(200).json({ msg: 'Your account has been created!', token })
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }
    // else{
    //     res.json('code stopped working')
    // }
}
//<====== Login Validation Module ======>
module.exports.loginValidations = [
    body('email').not().isEmpty().trim().withMessage("Email is Require!"),
    body('password').not().isEmpty().withMessage("Password is required")

];

//<====== Login Module validations ======>
module.exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() })
    }
    const { email, password } = req.body;
    try {
        const user = await USER.findOne({ email })
        if (user) {
            const compare = await bcrypt.compare(password, user.password);
            if (compare) {
                const token = createToken(user)
                return res.status(200).json({ msg: 'Login Successfully!', token })
            } else {
                return res.status(401).json({ error: [{ msg: 'Password is not correct' }] })
            }
        } else {
            return res.status(404).json({ error: [{ msg: 'Email not Found!' }] })
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }
}