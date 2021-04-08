import React from 'react';
import App from './App';
import {ApolloClient,InMemoryCache,createHttpLink} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const httpLink = createHttpLink({
    uri:"http://localhost:5000"
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

export default (<ApolloProvider client={client}><App /></ApolloProvider>);