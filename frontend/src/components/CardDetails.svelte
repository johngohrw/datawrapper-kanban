<script lang="ts">
	import { editTaskAPI } from '../api';

	export let task: BoardTask | null;
	export let onClose: () => void;
	export let updateTask: (columnId: number, taskId: number, newValues: object) => void;

	let formState: BoardTask | any = null;

	$: if (task) {
		formState = task;
	}

	function handleFormChange(e: Event, field: string) {
		if (formState) {
			formState[field] = (e.target as HTMLInputElement).value;
		}
	}

	function handleSave() {
		const body = { ...formState };
		delete body.createdAt;
		delete body.updatedAt;
		delete body.columnId;
		delete body.id;
		if (task) {
			editTaskAPI(task?.id, body);
			updateTask(task?.columnId, task?.id, body);
			onClose();
		} else {
			console.error('Cannot save task');
		}
	}
</script>

<div class="card-details">
	<div class="flex flex-row justify-between items-center mb-3">
		<div class="text-xl font-bold">Edit Task</div>
		<button class="close-button" on:click={onClose}>X</button>
	</div>
	<div class="text-xs text-gray-500 mb-0.5">Title</div>
	<input
		class="input-text mb-2"
		value={formState?.title}
		on:input={(e) => handleFormChange(e, 'title')}
	/>
	<div class="text-xs text-gray-500 mb-0.5">Description</div>
	<textarea
		class="input-text mb-2"
		value={formState?.description}
		on:input={(e) => handleFormChange(e, 'description')}
	/>
	<div class="flex justify-end">
		<button class="btn btn-blue" on:click={handleSave}>Save</button>
	</div>
</div>

<style>
	input,
	textarea {
		background-color: rgb(241, 241, 241);
		outline: none !important;
		border: 0px;
	}
	textarea {
		max-height: 400px;
	}
	.close-button {
		font-size: 22px;
		font-weight: 600;
	}
	.card-details {
		height: 100%;
		max-height: 90vh;
		border-radius: 4px;
		background: rgb(231, 231, 231);
		color: rgb(39, 39, 39);
		padding: 1rem;

		box-shadow: 3px 3px 13px 5px rgba(0, 0, 0, 0.1);
	}
</style>
