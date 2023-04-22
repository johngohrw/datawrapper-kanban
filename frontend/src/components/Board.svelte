<script lang="ts">
	import { onMount } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { API_ENDPOINT, addColumnAPI, addTaskAPI, editColumnAPI, editTaskAPI } from '../api';
	import Card from './Card.svelte';

	export let user: User;
	let isDragging = false;

	let board: BoardColumn[] = [];
	let originalBoardState = {};

	let editedColumn: number = -1;
	let newColumnName: string = '';

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

	function handleTaskEdit(task: BoardTask) {
		console.log(task);
	}

	function handleEdit(columnId: number) {
		newColumnName = board.find((column) => column.id === columnId)?.title || '';
		editedColumn = columnId;
	}

	function handleEditFinish(e: KeyboardEvent | FocusEvent, column: BoardColumn) {
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
		console.log('newTask', newTask);

		const columnToAdd = board.find((column) => column.id === columnId);
		if (columnToAdd) {
			columnToAdd.tasks.push(newTask);
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
</script>

<div class="board-container">
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
							on:blur={(e) => handleEditFinish(e, column)}
							on:keypress={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleEditFinish(e, column);
								}
							}}
						/>
					{:else}
						<button title="Edit this column" on:click={() => handleEdit(column.id)}>
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
						<div on:keydown={() => {}} on:click={() => handleTaskEdit(task)}>
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
	}
	.top-section {
		margin-bottom: 2rem;
	}
	.board {
		/* border: 1px solid black; */

		display: flex;
		flex-flow: row nowrap;
		gap: 1rem;
	}
	.column {
		/* border: 1px solid red; */
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
		display: flex;
		flex-flow: column nowrap;
		gap: 0.5rem;
		margin-bottom: 1rem;

		border-radius: 6px;
		outline-width: 0 !important;

		background: transparent;
		transition-duration: 150ms;
	}
	.card-container:empty {
		background: rgba(255, 255, 255, 0.1);
	}
	.card-container.dragging {
		background: rgba(255, 255, 255, 0.1);
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
