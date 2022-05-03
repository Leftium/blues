<script>
    export let title;
    export let numTotal;
    export let numMen;
    export let numWomen;
    export let members;
</script>


<h1>{title}</h1>

Total: {numTotal}

Men: {numMen}

Women: {numWomen}

<pre>{JSON.stringify(members, null, 4)}</pre>