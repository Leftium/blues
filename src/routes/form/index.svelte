<script>
    import { Button, Alert, Col, Container, Row } from 'sveltestrap';

    import GoogleFormInput from '$lib/components/GoogleFormInput.svelte'

    import { goto } from '$app/navigation';

    export let title;
    export let text;
    export let html;
    export let formUrl;
    export let formAction;
    export let formParams;

    let form=null;
    let submitResultMessage = '';
    let alertColor = 'primary'

    let disabled=false;

    async function scrollToForm() {
        await goto('#form', { replaceState: true });
    }

    function handleChange(e) {
        submitResultMessage = '';
        disabled = false;
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
            alertColor = 'success';
            disabled = true;
        } else {
            submitResultMessage = `신청 오류: ${resp.status} ${resp.statusText}`;
            alertColor = 'danger';
        }

    }

</script>

<svelte:head>
    <title>{title}</title>

    <meta property="og:image" content="https://www.modu-blues.com/img/cloud9.png">


    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">


</svelte:head>

<main>
    <div class=info>
        <center><h1 class=title >{title}</h1></center>

        {#if formParams.length}
            <center>
                <a href='#' on:click={scrollToForm}>신청 양직 바로 가기</a>
            </center>
        {/if}

        {@html html}
    </div>
    {#if formParams.length}
        <form id=form bind:this='{form}' on:submit|preventDefault={handleSubmit}>
            <div class=required-mark>* 필수항목</div>
            {#each formParams as formParam}
                <GoogleFormInput params={formParam} onChange={handleChange} />
            {/each}


            <Container>
                <Row>
                    <Col class="col-8">
                        <Alert
                            class="alert form-control-lg"
                            color={alertColor}
                            isOpen={!!submitResultMessage}
                        >{submitResultMessage}</Alert>
                    </Col>
                    <Col class="col-4">
                        <Button
                            class='submit form-control-lg'
                            color='primary'
                            type=submit
                            {disabled}
                        >제출</Button>
                    </Col>
                </Row>

            </Container>
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
        background-color: rgb(241, 237, 237) !important;
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
        margin-left: 0;
        margin-right: 0;
        margin-bottom: 0.2em;
    }
    .info :global(p) {
        margin-top: 0.2em;

    }

    .info :global(legend) {
        font-weight: bolder;
    }


    :global(fieldset) {
        border-width: 1px;
        border-style: solid;
        border-color: lightgray;
        padding: .1em 1em;
        margin-bottom: 1em;
    }

    :global(legend) {
        float: initial;
        width: initial;
        margin: initial;
    }

    .required-mark {
        color: red;
    }

    form {
        padding: 0.5em;
    }

    :global(button:focus) {
        box-shadow: none !important;
    }

    :global(.col:first-child) {
        padding-left: 0;
        padding-right: 0;
    }

    :global(.col:last-child) {
        padding-left: .5em;
        padding-right: 0;
    }

    :global(.alert),
    :global(.submit) {
        text-align: center;
        font-size: 16px;
        width: 100%;
        padding: 6px 2px;
        margin-bottom: 0;
    }
</style>