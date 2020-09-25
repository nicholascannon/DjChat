import {createSlice} from '@reduxjs/toolkit';

import {instance} from '../globals';

export const userSlice = createSlice({
	name: 'user',
	initialState: null,
	reducers: {
		loadUser: (state, action) => {
			state = action.payload;
		},
		clearUser: state => {
			state = null;
		}
	}
});

// ACTIONS
export const {loadUser, clearUser} = userSlice.actions;

export const login = (username, password) => dispatch => {
	instance
		.post('/auth/login/', {username, password})
		.then(res => dispatch(loadUser(res.data)))
		.catch(err => console.error(err));
};

export const logout = () => dispatch => {
	instance
		.post('/auth/logout/', {})
		.then(res => dispatch(clearUser()))
		.catch(err => console.error(err));
};

export const checkStatus = () => dispatch => {
	instance
		.get('/auth/status/')
		.then(res => dispatch(loadUser(res.data)))
		.catch(err => {
			if (err.response && err.response.status !== 403) {
				console.error(err);
			}
		});
};

// SELECTORS
export const selectUser = state => state.user;

export default userSlice.reducer;
