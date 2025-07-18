<script lang="ts">
	import { authStore } from '../stores/auth.svelte.js';

	const { state, login, logout } = authStore;
</script>

<div class="flex items-center space-x-4">
	{#if state.isLoading}
		<div class="flex items-center space-x-2">
			<div
				class="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"
			></div>
			<span class="text-white">Loading...</span>
		</div>
	{:else if state.isAuthenticated && state.user}
		<div class="flex items-center space-x-3">
			<img
				src={state.user.avatar_url}
				alt={state.user.name || state.user.login}
				class="w-8 h-8 rounded-full"
			/>
			<div class="text-white">
				<div class="font-medium">{state.user.name || state.user.login}</div>
				<div class="text-sm text-gray-300">@{state.user.login}</div>
			</div>
			<button
				onclick={logout}
				class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
			>
				Logout
			</button>
		</div>
	{:else}
		<button
			onclick={login}
			class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
					clip-rule="evenodd"
				></path>
			</svg>
			<span>Login with GitHub</span>
		</button>
	{/if}

	{#if state.error}
		<div class="bg-red-900 border border-red-700 text-red-100 px-4 py-2 rounded-lg">
			<p class="text-sm">{state.error}</p>
		</div>
	{/if}
</div>
