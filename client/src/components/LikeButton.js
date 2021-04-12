import React,{useState,useEffect} from 'react';
import {Button, Icon, Label, Popup} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

export default function LikeButton({post:{likeCount,id,likes},user}) {
    const [liked,setLiked] = useState(false);

    useEffect(()=>{
        if(user && likes.find(like=>like.username=== user.username)){
            setLiked(true);
        }else setLiked(false);
    },[user,likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION,{
        variables:{postId:id}
    })

    const likeButton = 
        user ? (
            liked ? (
                <Button color='teal' onClick={likePost}>
                    <Icon name='heart' />
                </Button>
            ) : (
                <Button color='teal' basic onClick={likePost}>
                    <Icon name='heart' />
                </Button>
            )
        ): (
            <Button color='teal' basic to="/login" as={Link}>
                <Icon name='heart' />
            </Button>
        )

    return (
        <Popup content={`${liked? 'Unlike':'Like'}`} inverted trigger={
            <Button as='div' labelPosition='right'>
                {likeButton}
                <Label as='a' basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
        }/>
    )
}

const LIKE_POST_MUTATION = gql `
    mutation likePost ($postId:ID!) {
        likePost(postId: $postId) {
        id
        likes {
            id
            username
        }
        likeCount
        }
    }
`
