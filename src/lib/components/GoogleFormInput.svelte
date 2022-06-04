<script>
    import 'bootstrap/dist/css/bootstrap.min.css';

    import { FormGroup, FormText, Input, Label } from 'sveltestrap';
    import { localStorageStore } from "@babichjacob/svelte-localstorage/svelte-kit";
    import { localStorageStore as browserStorage  } from "@babichjacob/svelte-localstorage/browser";

    import { browser, dev, mode, prerendering } from '$app/env';

    export let params = null;
    export let onChange = null;

    let group = null;
    let type = 'text';

    let store = null;
    if (browser) {
        store = (params.remember ? localStorageStore : browserStorage)(params.entry, '');
        if (!params.remember) {
            store.set(null);
        }

        if (params.options.length) {
            type = 'radio';
            group = $store || params.options[0];
        }
    }

    function handleChange(e) {
        store.set(e.target.value);
        onChange(e);
    }

    function handleFocus(e) {
        this.select();
    }

</script>

<FormGroup>
    {#if type == 'radio'}
        <Label class=label>
            {#if params.required}
                <span class=required-mark>*</span>
            {/if}
            {params.name}
        </Label>
        {#each params.options as option}
            <Input
                type=radio
                name="entry.{params.entry}"
                bind:group={group}
                on:change={handleChange}
                class=form-control-lg
                value={option}
                label={option}
                required={params.required}
            />
        {/each}
    {:else}
        <Label class=label for="entry.{params.entry}">
            {#if params.required}
                <span class=required-mark>*</span>
            {/if}
            {params.name}
        </Label>
        {#if params.description}
            <FormText color="muted">{params.description}</FormText>
        {/if}

        <Input
            name="entry.{params.entry}"
            id="entry.{params.entry}"
            required={params.required}
            value={$store}
            on:focus={handleFocus}
            on:input={handleChange}
            class=form-control-lg
        />

    {/if}


</FormGroup>

<style>
    :global(.label) {
        display: block;
        margin-top: 1.5em;
        margin-bottom: 0.1em;
        font-size: 1.1em;
        font-weight: bold;
    }

    .required-mark {
        color: red;
    }
</style>