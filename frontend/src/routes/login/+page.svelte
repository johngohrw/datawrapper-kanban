<script lang="ts">
	import { goto } from '$app/navigation';
	import { API_ENDPOINT } from '../../api';
	import { user } from '../../store';

	let email = '';
	let errorMessage = '';
	let isLoading = false;

	async function handleLogin() {
		isLoading = true;
		try {
			const res = await fetch(API_ENDPOINT + `login`, {
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
		} catch (e: any) {
			errorMessage = e.message;
			console.error(e);
		}

		isLoading = false;
	}
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login to Simple Kanban" />
</svelte:head>

<div class="container h-full max-w-7xl mx-auto flex items-center justify-center">
	<div class="space-y-5 w-full max-w-md">
		<a href="/">Back</a>
		<h2>Log in</h2>
		<form on:submit={(e) => e.preventDefault()}>
			<div class="flex flex-col">
				<div class="mb-1">Please enter your email address</div>
				<input
					class="input-text"
					bind:value={email}
					on:keypress={() => {
						errorMessage = '';
					}}
					placeholder="john@example.com"
				/>
			</div>
			{#if errorMessage.length > 0}
				<div class="error-message text-red-600 text-sm">{errorMessage}</div>
			{/if}
			<div class="flex justify-end mt-2">
				<button type="submit" on:click={handleLogin} disabled={isLoading} class="btn btn-blue"
					>Log in</button
				>
			</div>
		</form>
		<div class="flex justify-end">
			<a href="register" class="text-sm">Not a user? Create a new account instead</a>
		</div>
	</div>
</div>

<style lang="scss">
</style>
