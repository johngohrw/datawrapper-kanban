<script lang="ts">
	import { API_ENDPOINT } from '../../api';
	import { validEmailRegex } from '../../utils';
	import { user } from '../../store';
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';

	let nameErrorMessage = '';
	let emailErrorMessage = '';
	let errorMessage = '';

	let isLoading = false;

	function validate() {
		let clean = true;
		if (name.length <= 0) {
			nameErrorMessage = 'Please enter a name!';
			clean = false;
		}
		if (email.length <= 0 || !validEmailRegex.test(email)) {
			emailErrorMessage = 'Please enter a valid email!';
			clean = false;
		}
		return clean;
	}

	async function handleRegister() {
		if (!validate()) {
			return;
		}
		isLoading = true;
		try {
			const res = await fetch(API_ENDPOINT + `signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
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
	<title>Register</title>
	<meta name="description" content="Register with Datawrapper Kanban" />
</svelte:head>

<div class="container h-full w-full max-w-7xl mx-auto flex items-center justify-center">
	<div class="space-y-5 w-full max-w-md">
		<a href="/">Back</a>
		<h2>New User</h2>
		<form on:submit={(e) => e.preventDefault()}>
			<div class="flex flex-col mb-2">
				<div class="mb-1">Name</div>
				<input
					class="input-text"
					bind:value={name}
					on:keypress={() => {
						nameErrorMessage = '';
					}}
					placeholder="John Smith"
				/>
				{#if nameErrorMessage.length > 0}
					<div class="error-message text-red-600 text-sm">{nameErrorMessage}</div>
				{/if}
			</div>

			<div class="flex flex-col mb-2">
				<div class="mb-1">Email address</div>
				<input
					class="input-text"
					bind:value={email}
					on:keypress={() => {
						emailErrorMessage = '';
					}}
					placeholder="john@example.com"
				/>
				{#if emailErrorMessage.length > 0}
					<div class="error-message text-red-600 text-sm">{emailErrorMessage}</div>
				{/if}
			</div>
			{#if errorMessage.length > 0}
				<div class="error-message text-red-600 text-sm">{errorMessage}</div>
			{/if}
			<div class="flex justify-end">
				<button on:click={handleRegister} disabled={isLoading} class="btn btn-blue">Register</button
				>
			</div>
		</form>
		<div class="flex justify-end">
			<a href="login" class="text-sm">Already have an account? Log in instead</a>
		</div>
	</div>
</div>

<style lang="scss">
</style>
