<script>
    import GoogleFormInput from '$lib/components/GoogleFormInput.svelte'

    export let title;
    export let text;
    export let html;
    export let formUrl;
    export let formAction;
    export let formParams;

    let form=null;
    let submitResultMessage = '';
    let submitError = false;

    function handleChange(e) {
        submitResultMessage = '';
    }

    async function handleSubmit(e) {
        let formData = new FormData(e.target);

        let formEntries = Object.fromEntries(formData.entries());

        let resp = await fetch('/form/submitGoogleForm', {
            method: 'POST',
            body: JSON.stringify({
                formAction,
                formEntries
            })
        })

        if (resp.status == 200) {
            submitResultMessage = '신청 완료!'
            submitError = false;
        } else {
            submitResultMessage = `신청 오류: ${resp.status} ${resp.statusText}`;
            submitError = true;
        }

    }

</script>

<svelte:head>
    <title>{title}</title>

    <meta property="og:image" content="https://www.modu-blues.com/img/cloud9.png">

</svelte:head>

<main>
    <div class=info>
        <h1 class=title >{title}</h1>

        {@html html}
    </div>
    {#if formParams.length}
        <form bind:this='{form}' on:submit|preventDefault={handleSubmit}>
            {#each formParams as formParam}
                <GoogleFormInput params={formParam} onChange={handleChange} />
            {/each}
            <input type=submit><span class='result' class:submitError >{submitResultMessage}</span>
        </form>
    {/if}
    <div>
        <center>
            <a href="{formUrl}">구글 양식 보기</a>
        </center>
    </div>
</main>

<style>
    :global(body) {
        background-color: rgb(241, 237, 237);
        margin: 0;
        font-family: sans-serif;

    }

    main {
        background-color: white;
    }

    @media (min-width: 501px) {
        main {
            margin: auto;
            max-width: 90vw;
            width: 592px;

            background-color: #fff;
            border: 1px solid #dadce0;
            border-radius: 8px;
            margin-bottom: 12px;
        }
    }

    .title {
        font-size: 1.6em;
        margin-left: .5em;
        margin-right: .5em;
    }

    div.info {
        padding: 1em;
        font-size: 1.2em;
    }

    .info :global(h1),
    .info :global(h2),
    .info :global(h3),
    .info :global(h4),
    .info :global(h5) {
        margin-bottom: 0.2em;
    }
    .info :global(p) {
        margin-top: 0.2em;

    }

    .info :global(legend) {
        font-weight: bolder;
    }

    span.result {
        color: green;
    }

    span.result.submitError {
        color: red;
    }
</style>