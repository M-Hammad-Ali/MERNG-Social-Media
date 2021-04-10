import React from 'react'
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag';
import {Grid} from 'semantic-ui-react';

import PostCard from '../components/PostCard';

export default function Home() {
    const {loading,data} = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid columns={3} >
        <Grid.Row>
            <h1>Recents Posts</h1>
        </Grid.Row>

        <Grid.Row >
            {
                loading? (
                    <h1>Loading Posts...</h1>
                ): (
                    data.getPosts && data.getPosts.map(post => (
                        <Grid.Column key={post.id} style={{marginBottom:20}}>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))
                )
            }
        </Grid.Row>
  </Grid>
    )
}

const FETCH_POSTS_QUERY = gql`
    {
        getPosts{
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