<script>
	export let members;

	console.log({members})

	export let width = 1200;
	export let height = 630;
	export let satori = false;

	const aspectRatio = width/height;

	function getMaxSizeOfSquaresInRect(n, x, y) {
		// Compute number of rows and columns, and cell size
		var ratio = x / y;
		var ncols_float = Math.sqrt(n * ratio);
		var nrows_float = n / ncols_float;

		// Find best option filling the whole height
		var nrows1 = Math.ceil(nrows_float);
		var ncols1 = Math.ceil(n / nrows1);
		while (nrows1 * ratio < ncols1) {
			nrows1++;
			ncols1 = Math.ceil(n / nrows1);
		}
		var cell_size1 = y / nrows1;

		// Find best option filling the whole width
		var ncols2 = Math.ceil(ncols_float);
		var nrows2 = Math.ceil(n / ncols2);
		while (ncols2 < nrows2 * ratio) {
			ncols2++;
			nrows2 = Math.ceil(n / ncols2);
		}
		var cell_size2 = x / ncols2;

		// Find the best values
		var nrows, ncols, cell_size;
		if (cell_size1 < cell_size2) {
			nrows = nrows2;
			ncols = ncols2;
			cell_size = cell_size2;
		} else {
			nrows = nrows1;
			ncols = ncols1;
			cell_size = cell_size1;
		}
		return cell_size
	}

	const bg = 'lightblue';

	const size = getMaxSizeOfSquaresInRect(members.length, width-16, height-16);
	console.log({size})
	console.log({members})

</script>

<div
	style="background-color: {bg}; max-width: {width}px; display: flex;"
	style:height={satori ? `${height}px` : undefined}
>
	<div class=container style="background-color: {bg}; width: {width}px; height: {height}px;" style:display={satori ? 'flex' : 'flex'}>
		{#each members as member}
			<div
				class=member
				style:width={`${size-2}px`}
				style:height={`${size-2}px`}
				style:background-image={`url(https://www.modu-blues.com${member.backgroundImage})`}

			>{member.name}</div>
		{/each}
	</div>
</div>

<style>
	.container {
		flex-wrap: wrap;
		justify-content: center;
		align-content: flex-start;
	}
	.member{
		border: 1px solid black;
		background-image: url(https://www.modu-blues.com/img/special/male.jpg);
		background-repeat: no-repeat;
        background-position: 0% 0%;
        background-size: 100% 100%;
	}
</style>