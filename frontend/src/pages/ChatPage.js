import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {selectUser, selectIsLoading} from '../reducers/userSlice';

function ChatPage() {
	const user = useSelector(selectUser);
	const userLoading = useSelector(selectIsLoading);

	if (userLoading) return <h1>Loading</h1>;
	if (!user) return <Redirect to="/login" />;

	return (
		<div>
			<h1>Chat Page</h1>
			{user && user.username}
		</div>
	);
}

export default ChatPage;
