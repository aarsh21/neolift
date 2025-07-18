import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { openUrl } from '@tauri-apps/plugin-opener';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, TOKEN_KEY, OAUTH_SCOPES } from './config.js';

// Generate random state for OAuth security
function randomState(): string {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Token management functions using localStorage
export async function saveToken(token: string): Promise<void> {
	localStorage.setItem(TOKEN_KEY, token);
}

export async function loadToken(): Promise<string | null> {
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch {
		return null;
	}
}

export async function wipeToken(): Promise<void> {
	try {
		localStorage.removeItem(TOKEN_KEY);
	} catch {
		// Ignore errors when wiping token
	}
}

// Check if existing token is still valid
export async function checkExistingToken(): Promise<string | null> {
	const token = await loadToken();
	if (!token) return null;

	try {
		const response = await fetch('https://api.github.com/user', {
			headers: { Authorization: `token ${token}` }
		});

		if (!response.ok) {
			await wipeToken();
			return null;
		}
		return token;
	} catch {
		await wipeToken();
		return null;
	}
}

// Initiate OAuth login flow
export async function loginWithGitHub(): Promise<void> {
	const state = randomState();

	try {
		const port = await invoke<number>('start_oauth', { state });

		const unlisten = await listen<string>('github_code', async (event) => {
			unlisten(); // Stop listening after receiving the event

			try {
				const token = await invoke<string>('exchange_code', {
					code: event.payload,
					clientId: GITHUB_CLIENT_ID,
					clientSecret: GITHUB_CLIENT_SECRET
				});

				await saveToken(token);

				// Dispatch custom event to notify components
				window.dispatchEvent(new CustomEvent('auth-success', { detail: { token } }));
			} catch (error) {
				console.error('Failed to exchange code for token:', error);
				window.dispatchEvent(new CustomEvent('auth-error', { detail: { error } }));
			}
		});

		const redirectUri = `http://localhost:${port}/callback`;
		const authUrl =
			'https://github.com/login/oauth/authorize?' +
			new URLSearchParams({
				client_id: GITHUB_CLIENT_ID,
				redirect_uri: redirectUri,
				scope: OAUTH_SCOPES,
				state
			});

		await openUrl(authUrl);
	} catch (error) {
		console.error('Failed to start OAuth flow:', error);
		window.dispatchEvent(new CustomEvent('auth-error', { detail: { error } }));
	}
}

// Ensure user is authenticated
export async function ensureAuth(): Promise<string | null> {
	const existingToken = await checkExistingToken();
	if (existingToken) {
		return existingToken;
	}

	await loginWithGitHub();
	return null;
}

// Get user information
export async function getUserInfo(token: string): Promise<any> {
	try {
		const response = await fetch('https://api.github.com/user', {
			headers: { Authorization: `token ${token}` }
		});

		if (!response.ok) {
			throw new Error('Failed to fetch user info');
		}

		return await response.json();
	} catch (error) {
		console.error('Failed to get user info:', error);
		throw error;
	}
}

// Logout function
export async function logout(): Promise<void> {
	await wipeToken();
	window.dispatchEvent(new CustomEvent('auth-logout'));
}
