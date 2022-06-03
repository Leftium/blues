<script>
    export let params = null;
    export let onChange = null;

    let group = null;
    let type = 'text';
    if (params.options.length) {
        type = 'radio'
        group = params.options[0]
    }

    function handleFocus(e) {
        onChange(e);
        this.select();
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
                <input type='radio'
                       bind:group={group}
                       on:change={onChange}
                       name="entry.{params.entry}"
                       value={option}
                       required={params.required}>
                {option}
            </label>
        {/each}
    {:else}
        <label>
            <input on:focus={handleFocus} name="entry.{params.entry}" required={params.required}>
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