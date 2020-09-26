import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {login, selectAuthError, selectIsLoggedIn} from '../reducers/userSlice';

function LoginPage() {
	const dispatch = useDispatch();
	const authError = useSelector(selectAuthError);
	const isLoggedIn = useSelector(selectIsLoggedIn);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	console.log(isLoggedIn);
	if (isLoggedIn) return <Redirect to="/" />;

	const submitLogin = e => {
		e.preventDefault();
		dispatch(login(username, password));
	};

	return (
		<div className="App">
			<h1>Login</h1>
			<form onSubmit={submitLogin}>
				<input type="text" value={username} onChange={e => setUsername(e.target.value)} />
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
				<button type="submit" disabled={!username || !password}>
					Login
				</button>

				{authError && <p>{authError}</p>}
			</form>
		</div>
	);
}

export default LoginPage;
