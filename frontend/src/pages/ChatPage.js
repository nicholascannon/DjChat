import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {selectUser, selectIsLoading, logout} from '../reducers/userSlice';

import './ChatPage.css';

function ChatPage() {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const userLoading = useSelector(selectIsLoading);

	if (userLoading) return <h1>Loading</h1>;
	if (!user) return <Redirect to="/login" />;

	return (
		<div className="ChatPage">
			<nav>
				<ul>
					<li>
						<strong>Logged in as {user.username}</strong>
					</li>
					<li>
						<button onClick={() => dispatch(logout())}>Logout</button>
					</li>
				</ul>
			</nav>

			<div className="msgBox"></div>
		</div>
	);
}

export default ChatPage;
