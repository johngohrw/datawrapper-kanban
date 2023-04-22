<script lang="ts">
	import { API_ENDPOINT } from '../api';
	import Board from '../components/Board.svelte';
	import WelcomeContent from '../components/WelcomeContent.svelte';
	import { user } from '../store';
	import { onMount } from 'svelte';

	let currentUser: any;
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	onMount(async () => {
		const res = await fetch(API_ENDPOINT + `users`);
		const users = await res.json();
		console.log('users', users);
	});
</script>

<p>Current User: {JSON.stringify(currentUser)}</p>

{#if currentUser?.id}
	User is {JSON.stringify(currentUser)}
	<Board user={currentUser} />
{:else}
	<WelcomeContent />
{/if}

<style>
</style>
