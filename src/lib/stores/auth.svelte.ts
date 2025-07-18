import { checkExistingToken, loginWithGoogle, logout as logoutAuth, getUserInfo } from '../auth.js';

interface User {
	id: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	verified_email: boolean;
}

interface AuthState {
	isAuthenticated: boolean;
	token: string | null;
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

function createAuthStore() {
	let state = $state<AuthState>({
		isAuthenticated: false,
		token: null,
		user: null,
		isLoading: false,
		error: null
	});

	// Initialize auth state on startup
	async function init() {
		state.isLoading = true;
		state.error = null;

		try {
			const existingToken = await checkExistingToken();
			if (existingToken) {
				state.token = existingToken;
				state.isAuthenticated = true;
				await fetchUserInfo(existingToken);
			}
		} catch (error) {
			state.error = error instanceof Error ? error.message : 'Failed to initialize auth';
		} finally {
			state.isLoading = false;
		}
	}

	// Fetch user information
	async function fetchUserInfo(token: string) {
		try {
			const userInfo = await getUserInfo(token);
			state.user = userInfo;
			state.error = null;
		} catch (error) {
			state.error = error instanceof Error ? error.message : 'Failed to fetch user info';
			// If user info fetch fails, the token might be invalid
			await logout();
		}
	}

	// Login function
	async function login() {
		state.isLoading = true;
		state.error = null;

		try {
			await loginWithGoogle();
		} catch (error) {
			state.error = error instanceof Error ? error.message : 'Failed to login';
			state.isLoading = false;
		}
	}

	// Logout function
	async function logout() {
		state.isLoading = true;
		try {
			await logoutAuth();
			state.isAuthenticated = false;
			state.token = null;
			state.user = null;
			state.error = null;
		} catch (error) {
			state.error = error instanceof Error ? error.message : 'Failed to logout';
		} finally {
			state.isLoading = false;
		}
	}

	// Handle successful authentication
	function handleAuthSuccess(token: string) {
		state.token = token;
		state.isAuthenticated = true;
		state.isLoading = false;
		state.error = null;
		fetchUserInfo(token);
	}

	// Handle authentication error
	function handleAuthError(error: any) {
		state.error = error instanceof Error ? error.message : 'Authentication failed';
		state.isLoading = false;
		state.isAuthenticated = false;
		state.token = null;
		state.user = null;
	}

	// Handle logout event
	function handleLogout() {
		state.isAuthenticated = false;
		state.token = null;
		state.user = null;
		state.error = null;
		state.isLoading = false;
	}

	// Set up event listeners
	if (typeof window !== 'undefined') {
		window.addEventListener('auth-success', (event: Event) => {
			const customEvent = event as CustomEvent;
			handleAuthSuccess(customEvent.detail.token);
		});

		window.addEventListener('auth-error', (event: Event) => {
			const customEvent = event as CustomEvent;
			handleAuthError(customEvent.detail.error);
		});

		window.addEventListener('auth-logout', () => {
			handleLogout();
		});
	}

	return {
		get state() {
			return state;
		},
		init,
		login,
		logout,
		fetchUserInfo
	};
}

export const authStore = createAuthStore();
