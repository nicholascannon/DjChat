import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';

import './LoginPage.css';

import {login, selectAuthError, selectIsLoggedIn, selectIsLoading} from '../reducers/userSlice';

function LoginPage() {
	const dispatch = useDispatch();
	const authError = useSelector(selectAuthError);
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const isLoading = useSelector(selectIsLoading);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	if (isLoggedIn) return <Redirect to="/" />;

	const submitLogin = e => {
		e.preventDefault();
		setPassword('');
		dispatch(login(username, password));
	};

	return (
		<div className="loginPage">
			{isLoading ? (
				<h1>Loading...</h1>
			) : (
				<Form className="loginForm" onSubmit={submitLogin}>
					<h1>Login</h1>
					<hr />
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control
							type="text"
							placeholder="username"
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</Form.Group>

					<Button type="submit" disabled={!username || !password}>
						Login
					</Button>

					<div className="loginMsg">{authError && <p className="formError">{authError}</p>}</div>
				</Form>
			)}
		</div>
	);
}

export default LoginPage;
