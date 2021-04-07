const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError } = require("apollo-server");

const {validateRegistorInput,validateLoginInput} = require('../../utils/validators');
const User = require('../../models/User');
const {SECRET_KEY} = require('../../config');

const generateToken = (user)=>{
    return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username
    }, SECRET_KEY, {expiresIn:"1h"});
}

module.exports = {
    Mutation: {
        async login(
            _,
            {username,password}
        ){
            const {valid,errors} = validateLoginInput(username,password);
            const user = await User.findOne({username});
            if(!valid){
                throw new UserInputError("Validity Errors",{
                    errors
                })
            }
            if(!user){
                errors.general = "User Not Found!"
                throw new UserInputError("User Not Found!",{
                    errors
                });
            }
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                errors.general = "Wrong Credentials!";
                throw new UserInputError("Wrong Credential!",{
                    errors
                });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id:user._id,
                token
            }
        },
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            },
            ){

                const {valid,errors} = validateRegistorInput(
                    username, email, password, confirmPassword
                );
                if(!valid){
                    throw new UserInputError("Errors", {errors})
                }
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
                
                const token = generateToken(res);


                return {
                    ...res._doc,
                    id:res._id,
                    token
                }
            },
    }
}