<script lang="ts">
	import { goto } from '$app/navigation';
	import { API_ENDPOINT } from '../../api';
	import { user } from '../../store';

	let email = '';
	let errorMessage = '';
	let isLoading = false;

	function clearError() {
		errorMessage = '';
	}

	async function handleLogin() {
		isLoading = true;
		const res = await fetch(API_ENDPOINT + `login?`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email
			})
		});
		const result = await res.json();
		if (Object.hasOwn(result, 'error')) {
			errorMessage = result?.error;
		} else if (result?.id) {
			user.set(result);
			goto(`/`);
		}
		isLoading = false;
	}
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login to Datawrapper Kanban" />
</svelte:head>

<div class="container h-full max-w-7xl mx-auto flex items-center justify-center">
	<div class="space-y-5">
		<h2>Log in</h2>
		<div class="form">
			<div>
				email:<input bind:value={email} on:keypress={clearError} placeholder="john@example.com" />
			</div>
			{#if errorMessage.length > 0}
				<div class="error-message">{errorMessage}</div>{/if}
			<div>
				<button on:click={handleLogin} disabled={isLoading}>Log in</button>
			</div>
		</div>

		<a href="register">Create a new account instead</a>
	</div>
</div>

<style lang="scss">
	input {
		color: black;
	}
	.error-message {
		color: red;
	}
</style>
