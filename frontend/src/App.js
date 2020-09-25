import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {login, logout, checkStatus, selectUser} from './reducers/userSlice';

import './App.css';

function App() {
	const dispatch = useCallback(useDispatch(), []);
	const user = useSelector(selectUser);

	useEffect(() => {
		dispatch(checkStatus());
	}, [dispatch]);

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
		</div>
	);
}

export default App;
