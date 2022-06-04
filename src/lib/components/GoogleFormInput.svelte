<script>
    import 'bootstrap/dist/css/bootstrap.min.css';

    import { FormGroup, FormText, Input, Label } from 'sveltestrap';

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

<FormGroup>
    {#if type == 'radio'}
        <Label class=label>{params.name}</Label>
        {#each params.options as option}
            <Input
                type=radio
                name="entry.{params.entry}"
                bind:group={group}
                on:change={onChange}
                value={option}
                label={option}
                required={params.required}
            />
        {/each}
    {:else}
        <Label class=label for="entry.{params.entry}">{params.name}</Label>
        {#if params.description}
            <FormText color="muted">{params.description}</FormText>
        {/if}

        <Input
            name="entry.{params.entry}"
            id="entry.{params.entry}"
            required={params.required}
            on:focus={handleFocus}
        />

    {/if}


</FormGroup>

<style>
    :global(.label) {
        display: block;
        margin-top: 2em;
        margin-bottom: 0.1em;
        font-size: 1.2em;
        font-weight: bold;
    }
</style>