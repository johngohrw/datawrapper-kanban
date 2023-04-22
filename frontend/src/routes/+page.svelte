<script lang="ts">
	import Board from '../components/Board.svelte';
	import WelcomeContent from '../components/WelcomeContent.svelte';
	import { user } from '../store';

	let currentUser: any;
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});
</script>

{#if currentUser?.id}
	<Board user={currentUser} />
{:else}
	<WelcomeContent />
{/if}

<style>
</style>
