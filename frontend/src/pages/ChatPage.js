import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Redirect, useParams} from 'react-router-dom';
import {Navbar, Nav, Form, Button, Card, Spinner} from 'react-bootstrap';
import {v4 as uuid} from 'uuid';

import {API_HOST} from '../globals';
import {selectUser, selectIsLoading, logout} from '../reducers/userSlice';
import {
	selectMessages,
	fetchMessages,
	loadMessage,
	selectChatLoading,
	setError
} from '../reducers/chatSlice';

import './ChatPage.css';

// 4470ec42-1917-48f1-acd6-55769214731d

function ChatPage() {
	const dispatch = useCallback(useDispatch(), []);
	const {chatUuid} = useParams();

	const user = useSelector(selectUser);
	const userLoading = useSelector(selectIsLoading);

	const messages = useSelector(selectMessages);
	const chatLoading = useSelector(selectChatLoading);

	const ws = useRef(null);
	const [newMsg, setNewMsg] = useState('');

	useEffect(() => {
		ws.current = new WebSocket(`ws://${API_HOST}/ws/chat/${chatUuid}/`);
		ws.current.onopen = e => console.log('Chat socket opened');
		ws.current.onerror = e => dispatch(setError('Web socket error!'));
		ws.current.onmessage = e => {
			const msg = JSON.parse(e.data);

			if (msg.type === 'error') dispatch(setError(msg.data.message));
			else if (msg.type === 'chat_message') dispatch(loadMessage(msg.data));
		};

		// load previous chat messages
		dispatch(fetchMessages(chatUuid));

		return () => ws.current.close();
	}, [chatUuid, dispatch]);

	if (userLoading || !ws.current) return <Spinner animation="grow" />;
	if (!user) return <Redirect to="/login" />;

	const sendNewMsg = e => {
		e.preventDefault();

		const messageData = {uuid: uuid(), message: newMsg, recieved: false};
		ws.current.send(JSON.stringify(messageData));
		dispatch(loadMessage(messageData));
		setNewMsg('');
	};

	// submit form when enter pressed in text area
	const onKeyDown = e => {
		if (e.keyCode === 13 && e.shiftKey === false) sendNewMsg(e);
	};

	return (
		<div className="ChatPage">
			<Navbar bg="dark" variant="dark">
				<Navbar.Brand href="#" className="mr-auto">
					DjChat
				</Navbar.Brand>
				<Nav>
					<Nav.Link href="#" onClick={() => dispatch(logout())}>
						Logout
					</Nav.Link>
				</Nav>
			</Navbar>

			<div className="msgCont">
				<div className="msgBox">
					<div className="msgDisplay">
						{chatLoading ? (
							<Spinner animation="grow" />
						) : (
							messages.map(({uuid, recieved, message}) => (
								<Card
									key={uuid}
									className={`mt-3 ${!recieved && 'ml-auto'}`}
									body
									style={{overflowWrap: 'anywhere'}}
									bg={recieved ? 'light' : 'primary'}
									text={recieved ? 'dark' : 'light'}>
									{message}
								</Card>
							))
						)}
					</div>

					<Form onSubmit={sendNewMsg}>
						<Form.Group>
							<Form.Control
								as="textarea"
								rows="3"
								style={{resize: 'none'}}
								value={newMsg}
								onKeyDown={onKeyDown}
								onChange={e => setNewMsg(e.target.value)}
							/>
						</Form.Group>

						<Button type="submit" disabled={!newMsg}>
							Send
						</Button>
					</Form>
				</div>
			</div>
		</div>
	);
}

export default ChatPage;
