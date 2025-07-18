<script lang="ts">
	import AuthButton from '../lib/components/AuthButton.svelte';
	import { authStore } from '../lib/stores/auth.svelte.js';

	const { state } = authStore;
</script>

<div class="flex flex-col items-center justify-center space-y-8">
	<h1 class="text-5xl/loose text-orange-500 font-bold">Hello, Neolifters :D</h1>

	{#if state.isAuthenticated && state.user}
		<div class="text-center">
			<h2 class="text-2xl text-white mb-4">Welcome back, {state.user.name || state.user.login}!</h2>
			<p class="text-gray-300 mb-6">You are now authenticated with GitHub OAuth.</p>
			<div class="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md">
				<h3 class="text-lg font-semibold text-white mb-3">Your GitHub Info:</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-400">ID:</span>
						<span class="text-white">{state.user.id}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Username:</span>
						<span class="text-white">@{state.user.login}</span>
					</div>
					{#if state.user.name}
						<div class="flex justify-between">
							<span class="text-gray-400">Name:</span>
							<span class="text-white">{state.user.name}</span>
						</div>
					{/if}
					{#if state.user.email}
						<div class="flex justify-between">
							<span class="text-gray-400">Email:</span>
							<span class="text-white">{state.user.email}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="text-center">
			<h2 class="text-2xl text-white mb-4">GitHub OAuth Demo</h2>
			<p class="text-gray-300 mb-6">Sign in with GitHub to access your profile information.</p>
		</div>
	{/if}

	<AuthButton />
</div>
