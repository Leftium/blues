<script>
    export let params = null;

    let group = null;
    let type = 'text';
    if (params.options.length) {
        type = 'radio'
        group = params.options[0]
    }

</script>

<div>
    <h2>{params.name}</h2>
    {#if params.description}
        <div>{params.description}</div>
    {/if}

    {#if type == 'radio'}
        {#each params.options as option}
            <label>
                <input type='radio' bind:group={group} name="entry.{params.entry}" value={option}>
                {option}
            </label>
        {/each}
    {:else}
        <label>
            <input name="entry.{params.entry}">
        </label>
    {/if}


</div>

<style>
    label {
        display: block;
    }

    h2 {
        margin-bottom: 0.2em;
    }

</style>