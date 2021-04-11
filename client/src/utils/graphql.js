import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
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