const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');
var nodemailer = require("nodemailer");
const randomstring = require('randomstring');


var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "maheshbabu.p2001@gmail.com",
        pass: "pass"
    },
    tls: {
        rejectUnauthorized: false
    }
});
var mailOptions,link;

exports.send = (req,res) => {
    const email = req.body.email;
    User.findOne({'email':email}).exec((err, user) => {
    if(!user || err){
      return res.status(400).json({
          error: 'User not found'
      });
    }
    if(user.active == true){
      return res.status(400).json({
          error: 'Your account is already verified'
      });
    }
    link="http://localhost:3000/verify?secret="+user.secretToken+"&email="+email;
    mailOptions={
        from: 'sender@gmail.com',
        to : req.body.email,
        subject : "Thank you! Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
            return res.status(400).json({
                error: 'Verification Failed'
            });
     }else{
            console.log("Message sent: " + response.message);
            return res.status(200).json('success')
         }
});
})

};




exports.verify = (req, res) => {
      const secret = req.body.secret;
      const email = req.body.email;
      console.log(secret);
      console.log(email);
      User.findOne({'email':email}).exec((err, user) => {
        if(err || !user){
          return res.status(400).json({
              error: 'Something went wrong'
          });
        }
        if(user.active){
          return res.status(400).json({
              error: 'Already verified!'
          });
        }
        if(user.secretToken == secret){
          user.active = 'true';
          user.secretToken = '';
          user.save()
          return res.status(200).json('success')
        }
        else{
          return res.status(400).json({
              error: 'Verification Failed'
          });
        }
      })
};


// using promise
exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body);

    const secretToken = randomstring.generate();
    user.secretToken = secretToken;
    user.active = false;

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                // error: errorHandler(err)
                error: 'Sorry..Email is taken!'
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

// using async/await
// exports.signup = async (req, res) => {
//     try {
//         const user = await new User(req.body);
//         console.log(req.body);

//         await user.save((err, user) => {
//             if (err) {
//                 // return res.status(400).json({ err });
//                 return res.status(400).json({
//                     error: 'Email is taken'
//                 });
//             }
//             res.status(200).json({ user });
//         });
//     } catch (err) {
//         console.error(err.message);
//     }
// };

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User does not exist. Please Signup'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Incorrect password..'
            });
        }
        if(!user.active){
          return res.status(401).json({
              error: 'Your email is not yet verified..  Please verify to continue..'
          });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};

exports.isOwner = (req,res, next) => {
    if(req.profile.role === 0 || req.profile.role === 1) {
        return res.status(403).json({
            error : 'You do not have access!'
        })
    }
    next();
};
