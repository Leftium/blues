<script>
    import html2canvas from 'html2canvas';

    export let title;
    export let numTotal;
    export let numMen;
    export let numWomen;
    export let members;
    export let ctaUrl;
    export let sheetsId;

    export let subdomain;

    export let messages;

    export let party;

    import { ConfettiExplosion } from 'svelte-confetti-explosion';
    import { fade } from 'svelte/transition'
    import { page } from '$app/stores';
    import { shuffle } from '$lib/common';

    import { browser } from '$app/env';
    import { Button, Input, Alert, Container, Row, Col } from 'sveltestrap';

    let sharingStyle = $page.url.searchParams.has('share')
    let listStyle = $page.url.searchParams.has('a');

    let showTitle = true;
    let showTotals = true;
    let messageIndex = -1;
    let message = nextMessage() || ''

    let shareMessage = '버튼을 누르세요'


    let lastMessageTime = +(new Date())
    if(browser) {
        lastMessageTime = +(new Date())
        function step() {
            const now = +(new Date())
            if ((now - lastMessageTime) > 5 * 1000) {
                message = nextMessage();
                lastMessageTime = now
            }
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }



    let shareElement;


    let shareLink = new URL($page.url);

    shareLink.searchParams.set('share', '1');

    let isVisible = false;
    async function handleClickShare() {

        let options = {
            x: window.scrollX,
            y: window.scrollY,
        }

        shareMessage = '공유 준비중...'

        const canvas = await html2canvas(shareElement, options);
        const dataUrl = canvas.toDataURL();

        const blob = await (await fetch(dataUrl)).blob();
        const filesArray = [new File([blob], 'blues.png', { type: blob.type, lastModified: new Date().getTime() })];

        const shareData = {
            files: filesArray,
            // url: 'https://www.modu-blues.com/',
            text: `${title}\n${numTotal}명 신청 (남${numMen} 여${numWomen})`,
            title
        };
        try {
            navigator.share(shareData).then(() => {
                shareMessage = 'Shared successfully'
            }).catch(err => shareMessage = err)
        } catch (e) {
            shareMessage = e.message
        }
    }

    async function handleClickCopy() {

        let options = {
            x: window.scrollX,
            y: window.scrollY,
        }

        shareMessage = '복사 준비중...'

        html2canvas(shareElement, options).then(async function(canvas){
            try {
                canvas.toBlob((blob) => {
                    navigator.clipboard.write([
                        new ClipboardItem({ "image/png": blob })
                    ]);
                }, "image/png");
                shareMessage = 'Successfully copied!'
            } catch (error) {
                shareMessage = error.message
            }
        });
    }

    function nextMessage() {
        messageIndex++;
        if (messageIndex >= messages.length) {
            messageIndex = 0
            shuffle(messages)
        }
        return messages[messageIndex]?.message
    }

    function handleClickMessage() {
        message = nextMessage()
        lastMessageTime = +(new Date())
    }

</script>

<svelte:head>
    <title>{title}</title>

    <meta property="og:image" content="https://www.modu-blues.com/img/cloud9.png">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <link rel="stylesheet" type="text/css" href="css/snowfall.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</svelte:head>

<div class=confetti>
    {#if isVisible}
        <ConfettiExplosion particleCount={100} stageHeight=1600 --x="50vw" --y="-20px"/>
    {/if}
</div>

{#if party && !sharingStyle}
    <snowfall>
        {#each Array(50) as a}
            <snowflake><img src="img/snowflake.png">️</snowflake>
        {/each}
    </snowfall>
{/if}

<main>
    {#if sharingStyle}
        <Container>
            <Row>
                <Col xs="6"><Input type="checkbox" label="제목" class=form-control-lg bind:checked={showTitle} /></Col>
                <Col xs="6"><Input type="checkbox" label="신청자 명수" class=form-control-lg bind:checked={showTotals} /></Col>
            </Row>
            <Row>
                <Col xs="6"><Button on:click={handleClickShare} color='primary' block> 공유하기</Button></Col>
                <Col xs="6"><Button on:click={handleClickCopy} color='primary' block> 복사하기</Button></Col>
            </Row>

            <Alert color='primary'>{shareMessage}</Alert>

        </Container>
    {/if}

    <div bind:this={shareElement}>
        <center>
            <div class:sharingStyle class:listStyle>
                <a href="https://www.facebook.com/groups/cloud9.dancehall" class="fa fa-facebook"></a>
                {#if subdomain != 'balboa'}
                    <a href="https://www.instagram.com/modublues/" class="fa fa-instagram"></a>
                    <a href="https://cafe.naver.com/modudance" class="fa fa-coffee"></a>
                {/if}
            </div>
            <h1 class=title hidden={!showTitle} contentEditable={sharingStyle}>{title}</h1>

            <div class=cta class:sharingStyle class:listStyle><a href="{ctaUrl}">
                <button class="button-85">신청 및 자세한 설명</button>
            </a></div>

            {#if message}
                <div class=transition-enforcement>
                    {#key message}
                        <div class=message transition:fade={{duration: 500}} on:click={handleClickMessage}>{message}</div>
                    {/key}
                </div>
            {/if}

            <div class=totals class:listStyle hidden={!showTotals}>
                <span class=total>{numTotal}명 신청</span>

                <span class=men>남{numMen}</span>&nbsp;<span class=women>여{numWomen}</span>
            </div>
        </center>

        <ul class=members-container class:sharingStyle class:listStyle>
            {#each members as member}
                <li class=member style="background-image: url({`${member.backgroundImage}`})">
                    {#if member.referals}
                        <div class=referer>{member.referals}</div>
                    {:else if member.referer}
                        <div class=referer>{member.referer}</div>
                    {/if}
                    <div class="{`${member.sex} ${(member.referer ? 'new' : '')}`}">{member.name}</div>
                </li>
            {/each}
        </ul>
    </div>

    <div class:sharingStyle class:listStyle>
        <center>
            <a href="https://docs.google.com/spreadsheets/d/{sheetsId}/edit#gid=1296169145">구글 시트 보기</a>
            | <a href="{shareLink}" sveltekit:reload>공유하기</a>
        </center>
    </div>
</main>


<style>
    :global(body) {
        background-color: rgb(241, 237, 237);
        margin: 0;
        font-family: sans-serif;

    }

    .confetti {
        z-index: 10000;
        pointer-events: none;
        position: fixed;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    .sharingStyle,
    .listStyle {
        display: none;
    }

    .fa {
        padding: 10px;
        font-size: 25px;
        width: 25px;
        height: 25px;
        text-align: center;
        text-decoration: none;
        margin: 5px 8px;
        border-radius: 50%;
        box-sizing: content-box;
    }

    .fa-facebook {
        background: #3B5998;
        color: white;
    }

    .fa-instagram {
        background: #125688;
        color: white;
    }

    .fa-coffee {
        background: #03C75A;
        color: white;
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

    h1 {
        margin-block-start: 0;
    }

    .title {
        font-size: 1.6em;
        margin-left: .5em;
        margin-right: .5em;
    }

    .cta {
        margin-bottom: 20px;
        width: 90%;
    }

    .transition-enforcement {
        display: grid;
    }

    .transition-enforcement > * {
        grid-column: 1/2;
        grid-row: 1/2;
    }

    .message {
        font-size: 1.1em;
        font-weight: bold;
        text-shadow: 0 0 0.2em gold, 0 0 0.5em gold, 0 0 0.5em gold, 0 0 0.5em gold,0 0 0.2em gold, 0 0 0.5em gold, 0 0 0.5em gold, 0 0 0.5em gold, 0 0 0.2em gold, 0 0 0.5em gold, 0 0 0.5em gold, 0 0 0.5em gold,0 0 0.2em gold, 0 0 0.5em gold, 0 0 0.5em gold, 0 0 0.5em gold;

        margin-bottom: .5em;
    }

    .totals {
        font-size: 1.2em;
        font-weight: bolder;
    }

    .totals .men {
        color: blue;
    }

    .totals .women {
        color: #FE2EA0;
    }

    ul.members-container {
        display: flex;
        flex-wrap: wrap;
        padding: 0px;

        gap: 1%;
        justify-content: center;
    }

    li.member {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        align-content: flex-end;
        overflow: hidden;

        border-radius: 0.5em;

        width: 24%;
        aspect-ratio: 1 / 1;

        margin-bottom: 1%;

        list-style: none;

        font-size: 1.2em;

        text-shadow: 0 0 0.2em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.5em white,0 0 0.2em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.2em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.5em white,0 0 0.2em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.5em white;


        background-repeat: no-repeat;
        background-position: 0% 0%;
        background-size: 100%;

        box-shadow: #00000059 0 5px 15px;
    }

    li.member div {
        width: 100%;
        align-self: flex-end;

        margin-right: 4%;
        margin-bottom: 4%;

        text-align: right;
        font-weight: bold;
    }

    li .male {
        color: blue;
    }

    li .female {
        color: #FE2EA0;
    }

    li.member .referer {
        font-size: .7em;
        color: darkgray;
        opacity: .9;
    }

    ul.sharingStyle li.member {
       box-shadow: none;
    }

    li .new {
        text-shadow: 0 0 0.2em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen,0 0 0.2em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.2em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen,0 0 0.2em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen;
    }

    /* CSS */
.button-85 {
  padding: 0.6em 2em;
  border: none;
  outline: none;
  color: rgb(255, 255, 255);
  background: #111;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  width: 100%;
  font-size: 18px;
  font-weight: 700;
}

.button-85:before {
  content: "";
  background: linear-gradient(
    45deg,
    #ff0000,
    #ff7300,
    #fffb00,
    #48ff00,
    #00ffd5,
    #002bff,
    #7a00ff,
    #ff00c8,
    #ff0000
  );
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing-button-85 20s linear infinite;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

@keyframes glowing-button-85 {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.button-85:after {
  z-index: -1;
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: #222;
  left: 0;
  top: 0;
  border-radius: 10px;
}

snowfall {
    left: -100px;
}

</style>