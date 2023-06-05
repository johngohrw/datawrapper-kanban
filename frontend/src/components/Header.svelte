<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '../store';

	let currentUser: any;
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	function handleLogout() {
		user.set(null);
		goto('/');
	}
</script>

<header>
	<nav>
		<span class="font-bold">Simple Kanban</span>
		{#if currentUser}
			<div>
				<span class="mr-2">Signed in as {currentUser.name}</span>
				<button on:click={handleLogout} class="btn btn-blue">Logout</button>
			</div>
		{:else}
			<a href="/login">Sign in</a>
		{/if}
	</nav>
</header>

<style lang="scss">
	header {
		background: rgb(23, 31, 68);
		padding: 1rem;
		position: sticky;
		top: 0;
	}
	nav {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
	}

	a {
		font-weight: 600;
	}
</style>
