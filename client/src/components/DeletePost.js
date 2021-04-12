import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { Button, Confirm, Icon } from 'semantic-ui-react'

import {FETCH_POSTS_QUERY} from '../utils/graphql';

export default function DeletePost({postId,callback}) {
    const [confirmOpen,setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST,{
        update(proxy){
            setConfirmOpen(false);
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
            if(callback) callback();
        },
        variables:{
            postId
        }
    });

    return (
        <>
            <Button as="div" color="red" onClick={()=>setConfirmOpen(true)}>
                <Icon name="trash" style={{margin:0}}/>
            </Button>
            <Confirm 
                open={confirmOpen}
                onCancel={()=>setConfirmOpen(false)}
                onConfirm={deletePost}
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