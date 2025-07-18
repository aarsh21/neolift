<script>
	let { children } = $props();
	import '../app.css';
	import { authStore } from '../lib/stores/auth.svelte.js';
	import { onMount } from 'svelte';

	onMount(() => {
		authStore.init();
	});
</script>

<main class="flex flex-col h-screen w-full bg-black">
	<div class="flex-1 flex flex-col items-center justify-center">
		{@render children()}
	</div>
</main>
