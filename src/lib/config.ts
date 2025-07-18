// OAuth Configuration
import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_CLIENT_SECRET } from '$env/static/public';

export const GOOGLE_CLIENT_ID = PUBLIC_GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = PUBLIC_GOOGLE_CLIENT_SECRET;

// OAuth settings
export const OAUTH_PORTS = [8000, 8001, 8002];
export const OAUTH_SCOPES = 'openid email profile';
export const OAUTH_SUCCESS_MESSAGE = 'OAuth finished. You may close this tab.';

// Storage key for the token
export const TOKEN_KEY = 'google_token';
