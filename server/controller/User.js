const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { User } = require('../model/user');

async function registerUser(req, res) {
    // Registration logic here
    const { email, password ,username} = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }
    const user=await User.findOne({email});
    if(user){
        return res.status(400).send('User already exists');
    }
     if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    try{
        const hashedPassword = bcrypt.hashSync(password, 8);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        return res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
    }catch(err){
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }

}   

async function loginUser(req, res) {
    // Login logic here
    console.log("api hitted")
    const { email, password } = req.body;
  console.log(password)
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).send('Invalid credentials');
        }
        const isMatch=bcrypt.compareSync(password,user.password);
        
        if(!isMatch){
            return res.status(400).send('Invalid credentials');
        }

        const token=createToken(user);
        return res.status(200).json({email,token,username:user.username});
    } catch(err){
        return res.status(500).send('Server error');
    }

}

async function getUserProfile(req, res) {
    
}

function createToken(user) {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
}

module.exports = { registerUser, loginUser, getUserProfile };