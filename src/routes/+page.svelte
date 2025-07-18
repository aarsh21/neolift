<script lang="ts">
	import { authStore } from '../lib/stores/auth.svelte.js';

	const { state } = authStore;
</script>

<div class="flex flex-col items-center justify-center space-y-8">
	<div class="text-center">
		<h2 class="text-2xl text-white mb-4">Welcome back, {state.user.name}!</h2>
		<p class="text-gray-300 mb-6">You are now authenticated with Google OAuth.</p>
		<div class="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md">
			<h3 class="text-lg font-semibold text-white mb-3">Your Google Info:</h3>
			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-400">ID:</span>
					<span class="text-white">{state.user.id}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-400">Name:</span>
					<span class="text-white">{state.user.name}</span>
				</div>
				{#if state.user.given_name}
					<div class="flex justify-between">
						<span class="text-gray-400">First Name:</span>
						<span class="text-white">{state.user.given_name}</span>
					</div>
				{/if}
				{#if state.user.family_name}
					<div class="flex justify-between">
						<span class="text-gray-400">Last Name:</span>
						<span class="text-white">{state.user.family_name}</span>
					</div>
				{/if}
				<div class="flex justify-between">
					<span class="text-gray-400">Email:</span>
					<span class="text-white">{state.user.email}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-400">Verified:</span>
					<span class="text-white">{state.user.verified_email ? 'Yes' : 'No'}</span>
				</div>
			</div>
		</div>
	</div>
</div>
