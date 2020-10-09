/**
 * Frontend globals
 */
import axios from 'axios';

export const instance = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? 'prod url here' : 'http://localhost:8000',
	withCredentials: true,

	// tells axios where django csrf token is
	xsrfHeaderName: 'X-CSRFToken',
	xsrfCookieName: 'csrftoken'
});
