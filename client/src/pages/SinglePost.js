import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useContext } from 'react'
import { Button, Card, Grid,Icon,Image, Label } from 'semantic-ui-react';
import moment from 'moment'
import { Link } from 'react-router-dom';


import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeletePost from '../components/DeletePost';

export default function SinglePost(props) {
    const postId= props.match.params.postId;
    const {user} = useContext(AuthContext);

    const {loading,data} = useQuery(FETCH_POST_QUERY,{
        variables:{
            postId
        }
    });

    function deletePostCallback() {
        props.history.push('/');
    }

    let postMarkup;
    if(loading) {
        <p>Loading Post.....</p>
    }else {
        const {id,body,createdAt,username, comments,likes,likeCount,commentCount} = data.getPost;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image 
                            src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description >
                                    {body}
                                </Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content>
                                <LikeButton user={user} post={{likes,likeCount,id}}/>
                                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                                    <Button color='blue' basic>
                                        <Icon name='comment' />
                                    </Button>
                                    <Label as='a' basic color='blue' pointing='left'>
                                        {commentCount}
                                    </Label>
                                </Button>
                                {
                                    user && username === user.username && (
                                        <DeletePost postId={postId} callback={deletePostCallback}   />
                                    )
                                }
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }


    return (
        <div>
            {postMarkup}
        </div>
    )
}

const FETCH_POST_QUERY = gql `
    query getPost(
        $postId : ID!
    ){
        getPost(
        postId:$postId
    ){
        id
        body
        username
        createdAt
        comments {
        body
        username
        id
        }
        likes {
        username
        }
        likeCount
        commentCount
    }
    }
`
