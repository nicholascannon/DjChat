import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {selectUser, selectIsLoading, logout} from '../reducers/userSlice';

function ChatPage() {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const userLoading = useSelector(selectIsLoading);

	if (userLoading) return <h1>Loading</h1>;
	if (!user) return <Redirect to="/login" />;

	return (
		<div>
			<h1>Chat Page</h1>
			<p>{user && user.username}</p>

			<button onClick={() => dispatch(logout())}>Logout</button>
		</div>
	);
}

export default ChatPage;
