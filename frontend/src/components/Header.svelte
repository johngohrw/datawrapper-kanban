<script lang="ts">
	import { page } from '$app/stores';
	import { user } from '../store';

	let currentUser: any;
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	console.log('currentUser from header', currentUser);
</script>

<header>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			{#if currentUser}
				<li aria-current={$page.url.pathname === '/logout' ? 'page' : undefined}>
					<a href="/logout">Logout</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<style lang="scss">
	header {
		background: rgb(23, 31, 68);
		padding: 1rem;
	}
	ul {
		display: flex;
		list-style-type: none;

		li {
			margin-right: 2rem;
		}
	}
	a {
		font-weight: 600;
	}
</style>
