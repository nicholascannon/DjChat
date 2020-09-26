import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {login, logout, checkStatus, selectUser, selectAuthError} from './reducers/userSlice';

import './App.css';

function App() {
	const dispatch = useCallback(useDispatch(), []);
	const user = useSelector(selectUser);
	const authError = useSelector(selectAuthError);

	useEffect(() => dispatch(checkStatus()), [dispatch]);

	return (
		<div className="App">
			<h1>DjChat</h1>
			{user ? (
				<>
					<p>{user.username}</p>
					<button onClick={() => dispatch(logout())}>logout</button>
				</>
			) : (
				<button onClick={() => dispatch(login('admin', 'password'))}>login</button>
			)}

			{authError && <p>{authError}</p>}
		</div>
	);
}

export default App;
