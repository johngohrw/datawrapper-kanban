<script lang="ts">
	export let task: BoardTask;
</script>

<div class="card-details">
	<div class="card-details-title">
		{task.title}
	</div>

	<div class="card-details-description">
		{task.description}
	</div>
</div>

<style>
	.card-details {
	}
	.card-details-title {
	}
	.card-details-description {
	}
</style>
