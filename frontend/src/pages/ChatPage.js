import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Navbar, Nav, Form, Button, Card, Spinner} from 'react-bootstrap';

import {selectUser, selectIsLoading, logout} from '../reducers/userSlice';

import './ChatPage.css';

function ChatPage() {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const userLoading = useSelector(selectIsLoading);

	if (userLoading) return <Spinner animation="grow" />;
	if (!user) return <Redirect to="/login" />;

	const sendMsg = e => {
		e.preventDefault();
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
						<Card className="mt-3" body bg="primary" text="light">
							1
						</Card>
						<Card className="mt-3" body bg="light">
							2
						</Card>
					</div>

					<Form onSubmit={sendMsg}>
						<Form.Group>
							<Form.Control as="textarea" rows="3" style={{resize: 'none'}} />
						</Form.Group>
						<Button type="submit">Send</Button>
					</Form>
				</div>
			</div>
		</div>
	);
}

export default ChatPage;
