import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react'

import {FETCH_POSTS_QUERY} from '../utils/graphql';

export default function DeleteButton({postId,callback,commentId}) {
    const [confirmOpen,setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

    const [deletePostORComment] = useMutation(mutation,{
        update(proxy){
            setConfirmOpen(false);
            if(!commentId){
                const posts = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                console.log(posts);
                let updatedPosts = [...posts.getPosts];
                updatedPosts = updatedPosts.filter(post=> post.id !== postId);
                proxy.writeQuery({query:FETCH_POSTS_QUERY,
                    data: {
                        getPosts: {
                          updatedPosts,
                        },
                    },
                });
            }
            if(callback) callback();
        },
        variables:{
            postId,
            commentId
        }
    });

    return (
        <>
            <Popup content={`Delete ${commentId? 'Comment': 'Post'}`} inverted trigger={
                <Button as="div" color="red"  floated="right" onClick={()=>setConfirmOpen(true)}>
                    <Icon name="trash" style={{margin:0}}/>
                </Button> 
            }/>
                <Confirm 
                    open={confirmOpen}
                    onCancel={()=>setConfirmOpen(false)}
                    onConfirm={deletePostORComment}
                />
        </>
    )
}

const DELETE_POST= gql `
    mutation deletePost(
        $postId:ID!
    ){
        deletePost(postId:$postId)
    }
`

const  DELETE_COMMENT = gql `
    mutation deleteComment(
        $postId:ID!
        $commentId:ID!
    ){
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`