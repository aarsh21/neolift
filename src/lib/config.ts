// OAuth Configuration
import { PUBLIC_GITHUB_CLIENT_ID, PUBLIC_GITHUB_CLIENT_SECRET } from '$env/static/public';

export const GITHUB_CLIENT_ID = PUBLIC_GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = PUBLIC_GITHUB_CLIENT_SECRET;

// OAuth settings
export const OAUTH_PORTS = [8000, 8001, 8002];
export const OAUTH_SCOPES = 'repo read:org';
export const OAUTH_SUCCESS_MESSAGE = 'OAuth finished. You may close this tab.';

// Storage key for the token
export const TOKEN_KEY = 'github_token';
