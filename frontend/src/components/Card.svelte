<script lang="ts">
	export let task: BoardTask;
</script>

<div class="board-card">
	<div class="board-card-title">
		{task.title}
	</div>

	<div class="board-card-description">
		{task.description}
	</div>
</div>

<style>
	.board-card {
		min-height: 100px;
		width: 100%;
		padding: 1rem;
		border-radius: 4px;

		background-color: #dfd9d9 !important;
	}
	.board-card-title {
		color: rgb(26, 26, 26);
		font-size: 14px;
		margin-bottom: 0.5rem;
	}
	.board-card-description {
		color: rgb(75, 75, 75);
		font-size: 11px;
	}
</style>
