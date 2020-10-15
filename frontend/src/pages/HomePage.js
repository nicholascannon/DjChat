import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Spinner, Card, ListGroup, Button, Form} from 'react-bootstrap';

import {
	getChats,
	selectChats,
	selectChatLoading,
	createChat,
	selectChatError,
	deleteChat
} from '../reducers/chatSlice';

import './HomePage.css';

function HomePage() {
	const dispatch = useCallback(useDispatch(), []);
	const chats = useSelector(selectChats);
	const isLoading = useSelector(selectChatLoading);
	const error = useSelector(selectChatError);
	const [username, setUsername] = useState('');
	const history = useHistory();

	useEffect(() => {
		dispatch(getChats());
	}, [dispatch]);

	const changeUsername = e => {
		setUsername(e.target.value);
	};

	const submitCreateChat = e => {
		e.preventDefault();
		dispatch(createChat(username, history));
	};

	return (
		<div className="HomePage">
			{isLoading ? (
				<Spinner animation="grow" />
			) : (
				<Card style={{width: '40vw'}}>
					<Card.Header>
						<strong>Your conversations</strong>
					</Card.Header>
					<ListGroup variant="flush">
						{chats.map(chat => (
							<ListGroup.Item key={chat.uuid} className="chatLink">
								<a href={`/chat/${chat.uuid}`}>
									{chat.user.username} - {chat.date_created}
								</a>
								<Button variant="danger" onClick={() => dispatch(deleteChat(chat.uuid))}>
									X
								</Button>
							</ListGroup.Item>
						))}

						<ListGroup.Item>
							<Form inline onSubmit={submitCreateChat}>
								<Form.Control
									className="mb-2 mr-sm-2"
									placeholder="username..."
									list="usernames"
									value={username}
									onChange={changeUsername}
									required={true}
								/>
								{/* <datalist id="usernames">
									<option value="nicholas"></option>
									<option value="admin"></option>
								</datalist> */}

								<Button
									type="submit"
									className="mb-2"
									disabled={!username && username.replace(/\s+/g, '') === ''}>
									Chat
								</Button>
							</Form>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			)}
			{error && <p style={{color: 'red'}}>{error}</p>}
		</div>
	);
}

export default HomePage;
