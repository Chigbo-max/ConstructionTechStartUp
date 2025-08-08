const userRepository =  require('../repositories/userRepository');
const bcrypt = require('bcrypt');

const registerUser = async({email, password, firstName, lastName, role, professionDescription}) => {



    if(!email || !password || !firstName || !lastName || !role) {
        return res.status(400).json({message: 'All fields are required'});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }


    const validRoles = ['HOMEOWNER', 'CONTRACTOR', 'OTHER'];
    if(!role || !validRoles.includes(role)) {
        throw new Error(`Role must be one of: ${validRoles.join(', ')}`);
    }

    if(role === 'OTHER' && !professionDescription ) {
        throw new Error('Please specify your profession for role OTHER');
    }

    if (professionDescription) {
        const trimmedProfDesc = professionDescription.trim();
    
        if (trimmedProfDesc === '' || /^\.{1,}$/.test(trimmedProfDesc)) {
            throw new Error('Profession description cannot be empty or just dots');
        }
    }


    const existingUser = await userRepository.findUserByEmail(email);
    if(existingUser) {
        throw new Error('User already exists');
    }
    
    const name = `${firstName} ${lastName}`;
   
    if(password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
 
    if(password.length > 50) {
        throw new Error('Password must be less than 50 characters long');
    }

    const passwordHash = await bcrypt.hash(password, 10);


    const newUserData = {
        email,
        passwordHash,
        name,
        role,
    }

    if(role === 'OTHER'){
        newUserData.professionDescription = professionDescription
    }


    const newUser = await userRepository.createUser(newUserData);

    return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        professionDescription: newUser.professionDescription,
        createdAt: newUser.createdAt,
    };
};



const findUserById = async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      professionDescription: user.professionDescription,
      createdAt: user.createdAt,
    };
  };
  
  const findUserByEmail = async (email) => {
    return await userRepository.findUserByEmail(email);
  };
  
  const updateUser = async (userId, updateData) => {
    const allowedFields = ['name', 'professionDescription'];
    const filteredData = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }
    
    const updatedUser = await userRepository.updateUser(userId, filteredData);
    
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      professionDescription: updatedUser.professionDescription,
      createdAt: updatedUser.createdAt,
    };
  };
  
  

module.exports = {
    registerUser,
    findUserById,
    findUserByEmail,
    updateUser
};
