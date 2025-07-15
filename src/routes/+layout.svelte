<script>
	let { children } = $props();
	import '../app.css';
</script>

<main class="flex flex-col h-screen w-full bg-black items-center justify-center">
	{@render children()}
</main>
