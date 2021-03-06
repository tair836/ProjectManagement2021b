var nodemailer = require('nodemailer')
const UsersHR=require('../models/UsersHR')
const jwt = require('jsonwebtoken')

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', password: '' }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered'
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect'
    }

    // // duplicate email error
    // if (err.code === 11000) {
    //     errors.email = 'that email is already registered'
    //     return errors
    // }

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message
        })
    }

    return errors
}

// create json web token
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, 'sce secret', {
        expiresIn: maxAge
    })
}


// controller actions
module.exports.loginHRGet=(req,res)=>{
    res.render('loginHR')
}
module.exports.TermsGet=(req,res)=>{
    res.render('Terms')
}
module.exports.bugReportGet=(req,res)=> {
    res.render('bugReport')
}

module.exports.bugReportPost=(req,res)=> {
    // const { email,name,bug } = req.body
    console.log(req.body.email + req.body.name)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hssce2021@gmail.com',
            pass: 'lamasce?'
        }
    })

    // var sendMsg='<h3>welcome</h3>'+'<h2>Bug report received by user: </h2>' +req.body.name +'<h2>The message:</h2'>
    //     +req.body.bug
    var sendMsg='Bug report received by user:' +req.body.name +' The message: ' +req.body.bug
    var mailOptions = {
        from: 'hssce2021@gmail.com',
        to: req.body.email ,
        cc:'hssce2021@gmail.com',
        subject: 'Bug Report',
        text: sendMsg
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
            res.status(200).json({ msg: 'email has been sent, thank you' })

        }
    })

    // res.render('bugReport')

}


module.exports.loginHRPost= async (req,res)=>{
    const { email, password } = req.body

    try {
        const user = await UsersHR.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }



}



//create new HR .
module.exports.createNewHRPost= async (req,res)=>{
    const{email,password}=req.body
    try{
        const usersHR= await UsersHR.create({email,password})
        res.status(201).json(usersHR)
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }

}


module.exports.logoutGet=(req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/')
}
