import {createSlice} from '@reduxjs/toolkit';
import {instance} from '../globals';

// import {instance} from '../globals';

export const chatSlice = createSlice({
	name: ' chat',
	initialState: {
		messages: [],
		loading: false,
		error: null
	},
	reducers: {
		loadMessages: (state, action) => {
			state.messages = [...action.payload, ...state.messages];
			state.loading = false;
		},
		loadMessage: (state, action) => {
			state.messages = [action.payload, ...state.messages];
			state.loading = false;
		},
		clearMessages: state => {
			state.messages = [];
			state.error = null;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
			state.error = null;
		},
		setError: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		}
	}
});

// ACTIONS
export const {loadMessages, loadMessage, clearMessages, setError, setLoading} = chatSlice.actions;

// SELECTORS
export const selectMessages = state => state.chat.messages;
export const selectChatLoading = state => state.chat.loading;
export const selectChatError = state => state.chat.error;

export const fetchMessages = chat_uuid => dispatch => {
	dispatch(setLoading(true));
	instance
		.get(`/chat/${chat_uuid}/`)
		.then(res => dispatch(loadMessages(res.data)))
		.catch(err => dispatch(setError(err.response.data.detail)));
};

export default chatSlice.reducer;
