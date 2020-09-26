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

	if (isLoggedIn) return <Redirect to="/" />;

	return (
		<div className="App">
			<h1>Login</h1>
			<form>
				<input type="text" value={username} onChange={e => setUsername(e.target.value)} />
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
				<button type="submit">Login</button>

				{/* <button onClick={() => dispatch(login('admin', 'password'))}>login</button> */}
			</form>

			{authError && <p>{authError}</p>}
		</div>
	);
}

export default LoginPage;
