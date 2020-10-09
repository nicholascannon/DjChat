/**
 * Frontend globals
 */
import axios from 'axios';

export const API_HOST = process.env.NODE_ENV === 'production' ? 'prod url here' : 'localhost:8000';
export const instance = axios.create({
	baseURL: `http://${API_HOST}`,
	withCredentials: true,

	// tells axios where django csrf token is
	xsrfHeaderName: 'X-CSRFToken',
	xsrfCookieName: 'csrftoken'
});
