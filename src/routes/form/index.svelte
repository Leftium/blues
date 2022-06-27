<script>
    import { Button, Alert, Col, Container, Row } from 'sveltestrap';

    import GoogleFormInput from '$lib/components/GoogleFormInput.svelte'

    import { goto } from '$app/navigation';

    export let title;
    export let text;
    export let html;
    export let images;
    export let formUrl;
    export let formAction;
    export let formParams;
    export let confirmUrl;
    export let headerImage;

    const SUNDAY_BLUES_URLS = [
        'https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/formResponse',
        'https://docs.google.com/forms/d/e/1FAIpQLSfuB4VwcQD2e6AYl7u6_Ht9u2GyqHoS6jUdusvIRh_1BrCSsw/formResponse',
        'https://docs.google.com/forms/d/e/1FAIpQLSeWt1kc4tjafI60kQDloBpsxpoG3Why-U7XxWgcBIkwNYVRLw/formResponse'
    ]

    let form=null;
    let submitResultMessage = '';
    let alertColor = 'primary'

    let disabled=false;

    function scrollToForm() {
        // https://stackoverflow.com/a/11986374/117030
        // Finds y value of given object
        function findPos(obj) {
            var curtop = 0;
            if (obj.offsetParent) {
                do {
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            return [curtop];
            }
        }
        window.scroll(0,findPos(form));
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
            if (SUNDAY_BLUES_URLS.includes(formAction)) {
                submitResultMessage += ` <a href='${confirmUrl}' rel=external class=alert-link>확인</a>`;
            }
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
    {#if headerImage}
        <img class=header-image src='{headerImage}'>
    {/if}
    <div class=info>
        <center><h1 class=title >{title}</h1></center>

        {#if formParams.length}
            <center>
                <a href='#' on:click|preventDefault={scrollToForm}>신청 양식 바로 가기</a>
            </center>
        {/if}

        {@html html}

        {#each images as image}
            <div class=image>
                <h3>{image.caption}</h3>
                <img src="{image.src}"/>
            </div>
        {/each}
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
                        >{@html submitResultMessage}</Alert>
                    </Col>
                    <Col class="col-4">
                        <Button
                            class='submit form-control-lg'
                            color='primary'
                            type=submit
                            {disabled}
                        >신청</Button>
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

    .header-image {
        width: 100%;
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
        border-width: 1px !important;
        border-style: solid !important;
        border-color: lightgray !important;
        padding: .1em 1em !important;
        margin-bottom: 1em !important;
    }

    :global(.wrap-youtube) {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;
    }
    :global(.youtube) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    :global(legend) {
        float: initial !important;
        width: initial !important;
        margin: initial !important;
    }

    .image {
        margin-top: 3em;
    }

    .image img {
        width: 100%;
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
        font-size: 16px !important;
        width: 100%;
        padding: 6px 2px !important;
        margin-bottom: 0;
    }
</style>