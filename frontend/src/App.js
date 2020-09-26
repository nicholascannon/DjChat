import React, {useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {Switch, Route} from 'react-router-dom';

import {checkStatus} from './reducers/userSlice';

import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFound';

import './App.css';

function App() {
	const dispatch = useCallback(useDispatch(), []);
	useEffect(() => dispatch(checkStatus()), [dispatch]);

	return (
		<div>
			<Switch>
				<Route exact path="/login" component={LoginPage} />
				<Route exact path="/" component={ChatPage} />
				<Route component={NotFoundPage} />
			</Switch>
		</div>
	);
}

export default App;
