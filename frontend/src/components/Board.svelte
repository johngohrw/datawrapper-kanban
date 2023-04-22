<script lang="ts">
	import { onMount } from 'svelte';
	import { API_ENDPOINT } from '../api';

	export let user: User;

	let board = {};

	// initial board state fetch
	onMount(async () => {
		const res = await fetch(API_ENDPOINT + `board/${user.id}`);
		const { board: boardState } = await res.json();
		board = boardState;
	});
</script>

<div>
	<div>Board!</div>
	<div>Welcome, {user.name}</div>
	{#each Object.values(board) as column}
		<div>{column.id}</div>
	{/each}
</div>
