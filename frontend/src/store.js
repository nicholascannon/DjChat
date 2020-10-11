import {configureStore} from '@reduxjs/toolkit';

import userSlice from './reducers/userSlice';
import chatSlice from './reducers/chatSlice';

export default configureStore({
	reducer: {
		user: userSlice,
		chat: chatSlice
	}
});
