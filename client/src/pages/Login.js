import gql from 'graphql-tag';
import React,{useState,useContext} from 'react';
import { Button, Form } from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import 'semantic-ui-css/semantic.min.css';

import {useForm} from '../utils/hooks';
import { AuthContext } from '../context/auth';

export default function Login(props) {
    const context = useContext(AuthContext);
    const [errors,setErrors] = useState({});

    
    const {onChange,onSubmit, values} = useForm(logUser,{
        username:"",
        password:"",
    })
    

    const [loginUser,{loading}] = useMutation(LOGIN_USER,{
        update(_, result) {
            console.log(result);
            context.login(result.data.login);
            props.history.push('/');
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
            console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function logUser() {
        loginUser();
    }
    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading?'loading':""}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    value={values.username}
                    name="username"
                    type="text"
                    error={errors.username ? true:false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    value={values.password}
                    name="password"
                    type="password"
                    error={errors.password ? true:false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length>0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(val => (
                            <li key={val}>{val}</li>
                        ))}
                    </ul>
                </div>
            )
            }
        </div>
    )
}


const LOGIN_USER = gql `
    mutation login(
        $username:String!
        $password:String!
    ) {
        login(
            username:$username,
            password:$password
        ){
            id
            email
            token
            username
            createdAt
        }
    }
`
