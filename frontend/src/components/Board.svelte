<script lang="ts">
	import { API_ENDPOINT, addColumnAPI, addTaskAPI, editColumnAPI, editTaskAPI } from '../api';
	import { onMount } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
	import CardDetails from './CardDetails.svelte';
	import Card from './Card.svelte';

	export let user: User;
	let isDragging = false;

	let board: BoardColumn[] = [];
	let originalBoardState = {};

	let editedColumn: number = -1;
	let newColumnName: string = '';

	let taskToEdit: BoardTask | null = null;

	// initial board state fetch
	onMount(async () => {
		const res = await fetch(API_ENDPOINT + `board/${user.id}`);
		const { board: boardState } = await res.json();
		board = Object.values(boardState);
		originalBoardState = boardState;
	});

	function handleConsider(columnId: number, event: CustomEvent) {
		isDragging = true;
		const columnIndex = board.findIndex((col) => col.id === columnId);
		board[columnIndex].tasks = event.detail.items;
		board = [...board];
	}

	function handleFinalize(columnId: number, event: CustomEvent) {
		isDragging = false;
		const columnIndex = board.findIndex((col) => col.id === columnId);
		board[columnIndex].tasks = event.detail.items;
		board = [...board];

		if (event.detail.info.trigger === 'droppedIntoZone') {
			const taskId = event.detail.info.id;
			editTaskAPI(taskId, { columnId });
		}
	}

	function handleColumnEdit(columnId: number) {
		newColumnName = board.find((column) => column.id === columnId)?.title || '';
		editedColumn = columnId;
	}

	function handleColumnEditFinish(e: KeyboardEvent | FocusEvent, column: BoardColumn) {
		column.title = (e.target as HTMLInputElement).value;
		editedColumn = -1;
		editColumnAPI(column.id, { title: column.title });
	}

	async function handleAddTask(columnId: number) {
		const newTask = await addTaskAPI({
			title: '',
			description: '',
			columnId
		});
		const columnToAdd = board.find((column) => column.id === columnId);
		if (columnToAdd) {
			columnToAdd.tasks.push(newTask);
			taskToEdit = newTask;
		}
		board = [...board];
	}

	async function handleAddColumn() {
		const newColumn = await addColumnAPI({
			title: 'New Column',
			userId: user.id
		});
		board.push({ tasks: [], ...newColumn });
		board = [...board];
	}

	function handleEditTask(task: BoardTask) {
		taskToEdit = task;
	}

	function handleUpdateTask(columnId: number, taskId: number, newValues: object) {
		const columnForTask = board.find((column) => column.id === columnId);
		if (columnForTask) {
			let taskToEdit = columnForTask.tasks.find((task) => task.id === taskId);
			taskToEdit = { ...taskToEdit, ...(newValues as BoardTask) };
		}
		board = [...board];
	}
</script>

<div class="board-container">
	{#if taskToEdit}
		<div class="edit-modal">
			<CardDetails
				task={taskToEdit}
				onClose={() => {
					taskToEdit = null;
				}}
				updateTask={handleUpdateTask}
			/>
		</div>
	{/if}
	<div class="top-section">
		<h3>Welcome, {user.name}</h3>
	</div>
	<div class="board">
		{#each board as column (column.id)}
			<div class="column">
				<div class="column-title">
					{#if editedColumn === column.id}
						<input
							class="input-text"
							bind:value={newColumnName}
							on:blur={(e) => handleColumnEditFinish(e, column)}
							on:keypress={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleColumnEditFinish(e, column);
								}
							}}
						/>
					{:else}
						<button title="Edit this column" on:click={() => handleColumnEdit(column.id)}>
							{column.title}
						</button>
					{/if}
				</div>
				<div
					class={`card-container ${isDragging && 'dragging'}`}
					use:dndzone={{ items: column.tasks }}
					on:consider={(e) => handleConsider(column.id, e)}
					on:finalize={(e) => handleFinalize(column.id, e)}
				>
					{#each column.tasks as task (task.id)}
						<div on:keydown={() => {}} on:click={() => handleEditTask(task)}>
							<Card {task} />
						</div>
					{/each}
				</div>
				<button class="card-adder" on:click={() => handleAddTask(column.id)}>New task</button>
			</div>
		{/each}
		<div class="column-adder-container">
			<button class="column-adder" on:click={() => handleAddColumn()}>New column</button>
		</div>
	</div>
</div>

<style>
	.board-container {
		position: relative;
		height: 100%;
	}
	.edit-modal {
		position: absolute;
		width: clamp(300px, 100%, 500px);

		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.top-section {
		margin-bottom: 2rem;
	}
	.board {
		display: flex;
		flex-flow: row nowrap;
		gap: 1rem;

		min-height: 150px;
	}
	.column {
		width: 240px;
		min-width: 240px;
	}
	.column-title {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
		font-weight: 600;
		height: 38px;
	}

	.column-title button {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.card-container {
		min-height: 100px;
		height: calc(100% - 110px);
		display: flex;
		flex-flow: column nowrap;
		gap: 0.5rem;
		margin-bottom: 1rem;

		border-radius: 6px;
		outline-width: 0 !important;

		background: rgba(255, 255, 255, 0.1);
		transition-duration: 150ms;
	}
	.card-container:empty {
		/* background: rgba(255, 255, 255, 0.1); */
	}
	.card-container.dragging {
		/* background: rgba(255, 255, 255, 0.1); */
	}
	.card-adder {
		width: 100%;
		padding: 1rem;
		border-radius: 4px;

		background: rgba(148, 148, 148, 0.1);
		color: rgb(211, 211, 211);
		font-size: 12px;
	}
	.column-adder-container {
		width: 240px;
		min-width: 240px;
		padding-top: 46px;
	}
	.column-adder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		border-radius: 4px;

		background: rgba(148, 148, 148, 0.1);
		color: rgb(211, 211, 211);
		font-size: 12px;
	}
</style>
