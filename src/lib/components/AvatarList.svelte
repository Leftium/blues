<script>
	export let count = 300;
	export let width = 1200;
	export let height = 630;
	export let seed = '한글';
	export let satori = false;

	const bg = 'lightblue';

</script>

<div
	style="background-color: {bg}; max-width: {width}px; display: flex;"
	style:height={satori ? `${height}px` : undefined}
>
	<div style="background-color: {bg}; width: {width}px; height: {height}px;" style:display={satori ? 'flex' : 'grid'}>
		<p
			class="seed"
			style:transform={satori ? `translateX(${width / 2}px) translateX(-50%);` : undefined}
			style:font-size={satori ? '50px' : 'min(5vw, 50px)'}
			class:grid={!satori}
		>
			{seed}
		</p>
	</div>
</div>

<style>
	.grid {
		justify-self: center;
		align-self: center;
		grid-column: 1;
		grid-row: 1;
	}

	.seed {
		position: absolute;
		z-index: 1;
		align-self: center;
		background-color: #868e9699;
		color: white;
		padding: 0.5em 1.5em;
		min-width: 100px;
		text-align: center;
	}
</style>