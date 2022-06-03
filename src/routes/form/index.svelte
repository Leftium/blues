<script>
    export let title;
    export let text;
    export let html;
    export let formUrl;
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
</style>