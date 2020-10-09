import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Navbar, Nav, Form, Button, Card, Spinner} from 'react-bootstrap';

import {API_HOST} from '../globals';
import {selectUser, selectIsLoading, logout} from '../reducers/userSlice';

import './ChatPage.css';

let MSGS = [
	// {
	// 	msg: 'hello bac',
	// 	recieved: true,
	// 	uuid: '1heck'
	// },
];
const CHAT_UUID = '4470ec42-1917-48f1-acd6-55769214731d';

const chatSocket = new WebSocket(`ws://${API_HOST}/ws/chat/${CHAT_UUID}/`);
chatSocket.onmessage = e => {
	console.log(JSON.parse(e.data));
};
chatSocket.onclose = e => {
	console.error('Chat socket closed');
};

function ChatPage() {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const userLoading = useSelector(selectIsLoading);

	const [newMsg, setNewMsg] = useState('');

	if (userLoading) return <Spinner animation="grow" />;
	if (!user) return <Redirect to="/login" />;

	const sendNewMsg = e => {
		e.preventDefault();
		chatSocket.send(JSON.stringify({message: newMsg}));
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
						{MSGS.map(({uuid, recieved, msg}) => (
							<Card
								key={uuid}
								className={`mt-3 ${recieved && 'ml-auto'}`}
								body
								style={{overflowWrap: 'anywhere'}}
								bg={recieved ? 'light' : 'primary'}
								text={recieved ? 'dark' : 'light'}>
								{msg}
							</Card>
						))}
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
