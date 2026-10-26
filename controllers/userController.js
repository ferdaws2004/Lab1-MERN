const bcrypt = require ('bcryptjs') ;
const jwt = require ('jsonwebtoken') ;
const User = require('../models/userModel');
const Article = require('../models/articleModel');
const INVALID_ID = { message: 'Invalid resource identifier (ObjectId expected)'};  

const generateToken = (id , role ) => {
  return jwt.sign ({id,role} , process .env. JWT_SECRET , {
    expiresIn : '1d'
  }) ;
};


// POST / api/ users / register ( Registration )
const registerUser = async (req , res) => {
  try {
    const { name , email , password , age } = req. body ;
    if (! name || ! email || ! password ) {
      return res. status (400) . json ({ message : 'Name , email , and password are required ' }) ;
    }
    const userExists = await User . findOne ({ email }) ;
    if ( userExists ) {
      return res. status (409) . json ({ message : 'Email is already registered ' }) ;
    }
    const salt = await bcrypt . genSalt (10) ;
    const hashedPassword = await bcrypt . hash ( password , salt ) ;
    const user = await User . create ({
      name ,
      email ,
      password : hashedPassword ,
      age ,
      role:'user'
    }) ;
    res. status (201) . json ({
      _id: user ._id ,
      name : user .name ,
      email : user .email ,
      role : user .role ,
      token : generateToken ( user ._id , user . role )
    }) ;
} catch ( err) {
  if (err. name === 'ValidationError') {
    return res. status (400) . json ({ message : err. message }) ;
  }
  res. status (500) . json ({ message : err. message }) ;
}
};

// POST / api/ users / login ( Authentication )
const loginUser = async (req , res) => {
try {
  const { email , password } = req. body ;
  if (! email || ! password ) {
    return res. status (400) . json ({ message : 'Email and password are required' }) ;
  }
  const user = await User . findOne ({ email }) ;
  if (! user ) {
    return res. status (401) . json ({ message : 'Invalid credentials' }) ;
  }
  const isMatch = await bcrypt . compare ( password , user . password ) ;
    if (! isMatch ) {
      return res. status (401) . json ({ message : 'Invalid credentials' }) ;
  }
  res. status (200) . json ({
    _id: user ._id ,
    name : user .name ,
    email : user .email ,
    role : user .role ,
    token : generateToken ( user._id , user.role )
  }) ;
} catch ( err) {
  res. status (500) . json ({ message : err. message }) ;
}
};

// GET / api/ users / profile ( Protected profile )
const getUserProfile = async (req , res) => {
  try {
    res. status (200) . json ( req. user ) ;
  } catch ( err) {
    res. status (500) . json ({ message : err. message }) ;
}
};
// GET / api/ users ( Admin only )
const getAllUsers = async (req , res) => {
  try {
    const users = await User . find () . select ('-password') ;
    res. status (200) . json ( users ) ;
  } catch ( err) {
    res. status (500) . json ({ message : err. message }) ;
}
};

// 2. Retrieve all users (GET /api/users)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Retrieve user by ID (GET /api/users/:id)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json(INVALID_ID);
    }
    res.status(500).json({ message: err.message });
  }
};


// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    // Referential integrity guard: refuse if the user authored an article
    const hasArticles = await Article.findOne({ author: req.params.id });
    if (hasArticles) {
      return res.status(400).json({
        message: 'Impossible to delete an author with published articles'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/update-password (protected)
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'oldPassword and newPassword are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // req.user has no password (select('-password')), so reload it
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// PUT /api/users/:id/role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id, { role }, { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: err.message });
  }
};
module.exports = { getUsers, getUserById, deleteUser, registerUser, loginUser, getUserProfile, getAllUsers, updatePassword, updateUserRole };