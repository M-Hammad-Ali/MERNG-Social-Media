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
        },

        deleteComment: async (_,{postId,commentId},context) =>{
            const user = checkAuth(context);

            const post = await Post.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId)

                if(post.comments[commentIndex].username === user.username){
                    post.comments.splice(commentIndex,1);
                    await post.save();
                    return post;
                }
                else {
                    throw new UserInputError("User is not allowed to deleted this comment");
                }
            }
            else {
                throw new UserInputError("Invalid Post Id");
            }
        },

        likePost : async(_,{postId},context) => {
            const user = checkAuth(context);

            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === user.username)) {
                    post.likes = post.likes.filter(like=> like.username !== user.username);
                }else {
                    post.likes.push({
                        username:user.username,
                        createdAt:new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            }else {
                throw new UserInputError("Invalid Post");
            }
        }
    }
}