import {createSlice} from '@reduxjs/toolkit';

import {instance} from '../globals';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
		isLoading: true,
		error: null
	},
	reducers: {
		loadUser: (state, action) => {
			state.user = action.payload;
			state.isLoading = false;
			state.error = null;
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setUserError: (state, action) => {
			state.error = action.payload;
			state.isLoading = false;
			state.user = null;
		},
		clearUser: state => {
			state.user = null;
			state.isLoading = false;
			state.error = null;
		}
	}
});

// ACTIONS
export const {loadUser, clearUser, setLoading, setUserError} = userSlice.actions;

// SELECTORS
export const selectUser = state => state.user.user;
export const selectIsLoading = state => state.user.isLoading;
export const selectAuthError = state => state.user.error;
export const selectIsLoggedIn = state => !!(!state.user.isLoading && state.user.user);

// THUNKS
export const login = (username, password) => dispatch => {
	dispatch(setLoading(true));
	instance
		.post('/auth/login/', {username, password})
		.then(res => dispatch(loadUser(res.data)))
		.catch(err =>
			dispatch(
				setUserError(
					(err.response && err.response.data.err) || 'An error occurred while logging in'
				)
			)
		);
};

export const logout = () => dispatch => {
	dispatch(setLoading(true));
	instance
		.post('/auth/logout/', {})
		.then(res => dispatch(clearUser()))
		.catch(err =>
			dispatch(
				setUserError(
					(err.response && err.response.data.err) || 'An error occurred while logging user out'
				)
			)
		);
};

export const checkStatus = () => dispatch => {
	dispatch(setLoading(true));
	instance
		.get('/auth/status/')
		.then(res => dispatch(loadUser(res.data)))
		.catch(err => {
			dispatch(setLoading(false));

			// expect a 403 if user has no session active
			if (err.response && err.response.status !== 403) {
				dispatch(setUserError(err.response.data.err));
			} else if (!err.response) {
				dispatch(setUserError('An error occurred while checking user status'));
			}
		});
};

export default userSlice.reducer;
