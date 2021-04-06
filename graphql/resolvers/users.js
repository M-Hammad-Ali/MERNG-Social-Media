const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError } = require("apollo-server");

const User = require('../../models/User');
const {SECRET_KEY} = require('../../config');

module.exports = {
    Mutation: {
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            },
            ){
                password= await bcrypt.hash(password,12);
                //Check the duplication of the user
                const user = await User.findOne({username});

                if(user ) {
                    throw new UserInputError('Username is already taken',{
                        errors:{
                            username: 'This username is Taken!'
                        }
                    })
                }
                
                // Create User if it doesn't exist
                const newUser = new User({
                    email,
                    username,
                    password,
                    createdAt: new Date().toISOString()
                });
                const res = await newUser.save();
                
                const token = jwt.sign({
                    id:res.id,
                    email:res.email,
                    username:res.username
                }, SECRET_KEY, {expiresIn:"1h"});


                return {
                    ...res._doc,
                    id:res._id,
                    token
                }
            }
    }
}