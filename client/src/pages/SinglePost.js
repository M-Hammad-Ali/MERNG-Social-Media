import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useContext, useRef, useState } from 'react'
import { Button, Card, Form, Grid,Icon,Image, Label } from 'semantic-ui-react';
import moment from 'moment'
import { Link } from 'react-router-dom';


import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

export default function SinglePost(props) {
    const [commentBody,setCommentBody] = useState('');
    const postId= props.match.params.postId;
    const {user} = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION,{
        update(){
            setCommentBody('');
            commentInputRef.current.blur();
        },
        variables:{
            postId,
            body:commentBody
        }
    })

    const {loading,data} = useQuery(FETCH_POST_QUERY,{
        variables:{
            postId
        }
    });

    function DeleteButtonCallback() {
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
                                        <DeleteButton postId={postId} callback={DeleteButtonCallback}   />
                                    )
                                }
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Form fluid>
                                    <div className='ui action input fluid'>
                                        <input
                                            type="text"
                                            value={commentBody}
                                            placeholder='Write Comment...'
                                            onChange={(event)=>setCommentBody(event.target.value)}
                                            ref={commentInputRef}
                                        />
                                        <button type="submit"
                                            className="ui button teal"
                                            disabled={commentBody.trim()===""}
                                            onClick={submitComment}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            </Card>
                        )}
                        {comments && comments.map(comment=> (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && username === comment.username ? (
                                        <DeleteButton postId={postId} commentId={comment.id} />
                                    ):null}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                    <Card.Description >
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
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

const CREATE_COMMENT_MUTATION = gql `
    mutation createComment($postId:String!,$body:String!){
        createComment(postId:$postId,body:$body){
            id
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`

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
