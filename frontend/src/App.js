import React, {useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {Switch, Route, useLocation} from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';

import {checkStatus, logout} from './reducers/userSlice';

import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFound';

import './App.css';

function App() {
	const {pathname} = useLocation();
	const dispatch = useCallback(useDispatch(), []);
	useEffect(() => dispatch(checkStatus()), [dispatch]);

	return (
		<>
			{pathname !== '/login' && (
				<Navbar bg="dark" variant="dark">
					<Navbar.Brand href="/" className="mr-auto">
						DjChat
					</Navbar.Brand>
					<Nav>
						<Nav.Link href="#" onClick={() => dispatch(logout())}>
							Logout
						</Nav.Link>
					</Nav>
				</Navbar>
			)}

			<Switch>
				<Route exact path="/login" component={LoginPage} />
				<Route exact path="/chat/:chatUuid" component={ChatPage} />
				<Route exact path="/" component={HomePage} />
				<Route component={NotFoundPage} />
			</Switch>
		</>
	);
}

export default App;
