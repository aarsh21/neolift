<script>
	let { children } = $props();
	import '../app.css';
	import { authStore } from '../lib/stores/auth.svelte.js';
	import { onMount } from 'svelte';
	import AuthButton from '../lib/components/AuthButton.svelte';

	onMount(() => {
		authStore.init();
	});

	const { state } = authStore;
</script>

<main class="flex flex-col h-screen w-full bg-black justify-center items-center">
	{#if state.isAuthenticated && state.user}
		<div class="flex-1 flex flex-col items-center justify-center">
			{@render children()}
		</div>
	{:else}
		<h1 class="text-5xl/loose text-orange-500 font-bold mx-3 mb-8">Hello, Neolifters :D</h1>
	{/if}
	<AuthButton />
</main>
