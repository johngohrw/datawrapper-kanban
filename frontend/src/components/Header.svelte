<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { user } from '../store';

	let currentUser: any;
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	$: console.log('currentUser from header', currentUser);

	function handleLogout() {
		user.set(null);
		goto('/');
	}
</script>

<header>
	<nav>
		<a href="/">Home</a>
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
