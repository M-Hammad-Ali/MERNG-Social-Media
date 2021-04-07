const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');
const {UserInputError} = require('apollo-server');

module.exports = {
    Mutation: {
        createComment: async (_,{postId,body},context) => {
            const user = checkAuth(context);

            if(body.trim() === ""){
                throw new UserInputError('Comment Should Not be Empty!',{
                    errors:{
                        body:"Comment Body must not empty"
                    }
                })
            }

            const post = await Post.findById(postId);
            
            if(post){
                post.comments.unshift({
                    body,
                    username:user.username,
                    createdAt:new Date().toISOString()
                });
                await post.save();
                return post;
            } else throw new UserInputError("Invalid Post Id",{
                errors:{
                    body:"Invalid Post ID"
                }
            })
        }
    }
}