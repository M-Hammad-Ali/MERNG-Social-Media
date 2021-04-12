import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import gql from 'graphql-tag';
import {useMutation} from '@apollo/client'

import {useForm} from '../utils/hooks';
import {FETCH_POSTS_QUERY} from '../utils/graphql';

export default function PostForm() {
    const initialState = {
        body:''
    }
    const {onSubmit,onChange,values} = useForm(createPostCallback,initialState);

    const [createPost,{error}] = useMutation(CREATE_POST_MUTATION,{
        update(proxy,result) {
            console.log(result);
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY,
              });
        
              let newData = [...data.getPosts];
              newData = [result.data.createPost, ...newData];
              proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                  ...data,
                  getPosts: {
                    newData,
                  },
                },
              });
              values.body = '';
        },
        variables:values
    }) 

    function createPostCallback () {
        createPost()
    }
    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create a Post...</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Hi World!"
                    name="body"
                    value={values.body}
                    onChange={onChange}
                    error = {error? true : false}
                />
                <Button type="submit" color="teal">
                    Submit
                </Button>
            </Form.Field>
        </Form>
        {
            error && (
                <div className="ui error message">
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )
        }
        </>
    )
}

const CREATE_POST_MUTATION = gql `
    mutation createPost (
        $body: String!
    ){
        createPost(
            body:$body
        ){
            id
            body
            createdAt
            username
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
`;
