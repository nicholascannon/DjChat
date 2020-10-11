import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Spinner} from 'react-bootstrap';

import {getChats, selectChats, selectChatLoading} from '../reducers/chatSlice';

function HomePage() {
	const dispatch = useCallback(useDispatch(), []);
	const chats = useSelector(selectChats);
	const isLoading = useSelector(selectChatLoading);

	useEffect(() => {
		dispatch(getChats());
	}, [dispatch]);

	if (isLoading) return <Spinner animation="grow" />;

	return (
		<div className="HomePage">
			<h1>Your chats</h1>
			{chats.map(chat => (
				<a key={chat.uuid} href={`/chat/${chat.uuid}`}>
					{chat.user.username}
				</a>
			))}
		</div>
	);
}

export default HomePage;
