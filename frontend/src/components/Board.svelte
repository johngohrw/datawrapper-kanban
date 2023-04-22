<script lang="ts">
	import { onMount } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { API_ENDPOINT } from '../api';

	export let user: User;
	let isDragging = false;

	type BoardTask = {
		id: number;
		title: string;
		description: string;
		columnId: number;
	};

	type BoardColumn = {
		id: number;
		title: string;
		userId: number;
		tasks: BoardTask[];
	};

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
		console.log(columnId, event);
		isDragging = false;
		const columnIndex = board.findIndex((col) => col.id === columnId);
		board[columnIndex].tasks = event.detail.items;
		board = [...board];

		if (event.detail.info.trigger === 'droppedIntoZone') {
			console.log(columnId);
			// call task edit api here
		}
	}
	function handleClick(e: MouseEvent) {
		console.log(e);
		alert('dragabble elements are still clickable :)');
	}

	function handleEdit(columnId: number) {
		newColumnName = board.find((column) => column.id === columnId)?.title || '';
		editedColumn = columnId;
	}

	function handleEditFinish(e: KeyboardEvent | FocusEvent, column: BoardColumn) {
		column.title = (e.target as HTMLInputElement).value;
		editedColumn = -1;

		// call column edit api here
	}
</script>

<div>
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
						<div class="board-card" on:keypress={() => {}} on:click={handleClick}>
							<div class="board-card-title">{task.title}</div>
							<div class="board-card-description">
								{task.description}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.top-section {
		margin-bottom: 2rem;
	}
	.board {
		/* border: 1px solid black; */

		display: flex;
		flex-flow: row nowrap;
		gap: 0.5rem;
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
		height: 100%;
		display: flex;
		flex-flow: column nowrap;
		gap: 0.5rem;

		border-radius: 6px;
		outline-width: 0 !important;

		background: transparent;
		transition-duration: 150ms;
	}
	.card-container.dragging {
		background: rgba(255, 255, 255, 0.1);
	}
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
