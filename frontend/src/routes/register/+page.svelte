<script lang="ts">
	let name = '';
	let email = '';

	function handleRegister() {
		console.log(name, email);
	}
</script>

<svelte:head>
	<title>Register</title>
	<meta name="description" content="Register with Datawrapper Kanban" />
</svelte:head>

<div class="container h-full max-w-7xl mx-auto flex items-center justify-center">
	<div class="space-y-5">
		<h2>New User</h2>
		<div>
			name:<input bind:value={name} placeholder="John Smith" />
		</div>
		<div>
			email:<input bind:value={email} placeholder="john@example.com" />
		</div>
		<div>
			<button on:click={handleRegister}>Register</button>
		</div>

		<a href="login">Already have an account? Log in instead</a>
	</div>
</div>

<style lang="scss">
	input {
		color: black;
	}
</style>
