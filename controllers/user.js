const bcrypt = require('bcrypt');
const { errorHandler } = require('../auth');
const auth = require('../auth');

const User = require('../models/User');

// [SECTION] REGISTER USER
module.exports.registerUser = (req, res) => {
    const { firstName, lastName, email, mobileNo, password } = req.body;

    if (!email.includes("@")) {
        return res.status(400).json({ error: 'Email invalid' });
    }
    if (mobileNo.length !== 11) {
        return res.status(400).json({ error: 'Mobile number invalid' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    return User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(409).json({ message: 'User already exists' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = new User({
                firstName,
                lastName,
                email,
                mobileNo,
                password: hashedPassword
            });

            return newUser.save();
        })
        .then(() => res.status(201).json({ message: 'Registered Successfully' }))
        .catch(err => errorHandler(err, req, res));
};

// [SECTION] LOGIN USER
module.exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email.includes("@")) {
        return res.status(400).json({ error: 'Invalid Email' });
    }

    return User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'No email found' });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if (isPasswordCorrect) {
                return res.status(200).json({ access: auth.createAccessToken(user) });
            } else {
                return res.status(401).json({ error: 'Email and password do not match' });
            }
        })
        .catch(err => errorHandler(err, req, res));
};