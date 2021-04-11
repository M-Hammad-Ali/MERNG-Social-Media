import gql from 'graphql-tag';
import React,{useState,useContext} from 'react';
import { Button, Form } from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import 'semantic-ui-css/semantic.min.css';

import {useForm} from '../utils/hooks';
import { AuthContext } from '../context/auth';

export default function Register(props) {
    const context = useContext(AuthContext);
    const [errors,setErrors] = useState({});

    const {onSubmit,onChange,values}= useForm(adduser,{
        username:"",
        email:"",
        password:"",
        confirmPassword:""
    })

    const [addUser,{loading}] = useMutation(REGISTER_USER,{
        update(_, result) {
            console.log(result);
            context.login(result.data.register);
            props.history.push('/');
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
            console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function adduser () {
        addUser();
    }
    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading?'loading':""}>
                <h1>Register</h1>
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
                    label="Email"
                    placeholder="Email..."
                    value={values.email}
                    name="email"
                    type="email"
                    error={errors.email ? true:false}
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
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password..."
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true:false}
                    name="confirmPassword"
                    type="password"
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
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


const REGISTER_USER = gql `
    mutation register(
        $username:String!
        $email:String!
        $password:String!
        $confirmPassword:String!
    ) {
        register(
            registerInput: {
                username: $username
                email:$email
                password:$password
                confirmPassword: $confirmPassword
            }
        ) {
            id email username createdAt token
        }
    }
`
