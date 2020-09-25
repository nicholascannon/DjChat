/**
 * Frontend globals
 */
import axios from 'axios';

export const instance = axios.create({
	baseURL: 'http://localhost:8000',
	withCredentials: true,

	// tells axios where django csrf token is
	xsrfHeaderName: 'X-CSRFToken',
	xsrfCookieName: 'csrftoken'
});
