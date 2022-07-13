<script>
    import html2canvas from 'html2canvas';

    export let title;
    export let numTotal;
    export let numMen;
    export let numWomen;
    export let members;
    export let ctaUrl;
    export let sheetsId;

    import { ConfettiExplosion } from 'svelte-confetti-explosion';
    import { tick } from 'svelte';
    import { page } from '$app/stores';

    let sharingStyle = $page.url.searchParams.has('share');
    let mainElement;


    let shareLink = new URL($page.url);

    shareLink.searchParams.set('share', '1');

    let isVisible = false;
    function handleClickTitle() {
        console.log('handleClickTitle')
        if (sharingStyle) { // Only on sharing version.

            let options = {
                x: window.scrollX,
                y: window.scrollY,
            }

            html2canvas(mainElement, options).then(async function(canvas){
                try {
                    canvas.toBlob((blob) => {
                        navigator.clipboard.write([
                            new ClipboardItem({ "image/png": blob })
                        ]);
                    }, "image/png");
                    console.log('Successfully copied!');
                    // Trigger confetti.
                    isVisible = false;
                    await tick();
                    isVisible = true;
                } catch (error) {
                    console.log(error.name, error.message);
                }
            });
        }
    }

</script>

<svelte:head>
    <title>{title}</title>

    <meta property="og:image" content="https://www.modu-blues.com/img/cloud9.png">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<div class=confetti>
    {#if isVisible}
        <ConfettiExplosion particleCount={100} stageHeight=1600 --x="50vw" --y="-20px"/>
    {/if}
</div>

<main bind:this={mainElement}>
    <center>
        <div class:sharingStyle>
            <a href="https://www.facebook.com/groups/cloud9.dancehall" class="fa fa-facebook"></a>
            <a href="https://www.instagram.com/modublues/" class="fa fa-instagram"></a>
            <a href="https://cafe.naver.com/modudance" class="fa fa-coffee"></a>
        </div>
        <h1 class=title on:click={handleClickTitle}>{title}</h1>

        <div class=cta class:sharingStyle ><a href="{ctaUrl}">
            <button class="button-85">신청 및 자세한 정보</button>
        </a></div>

        <div class=totals>
            <span class=total>신청자&nbsp;{numTotal}명</span>

            <span class=men>남&nbsp;{numMen}명</span>&nbsp;<span class=women>여&nbsp;{numWomen}명</span>
        </div>
    </center>

        <ul class=members-container class:sharingStyle>
            {#each members as member}
                <li class=member style="background-image: url({`${member.backgroundImage}`})">
                    {#if member.referer}
                        <div class=referer>{member.referer}</div>
                    {:else if member.referals}
                        <div class=referer>{member.referals}</div>
                    {/if}
                    <div class="{`${member.sex} ${(member.referer ? 'new' : '')}`}">{member.name}</div>
                </li>
            {/each}
        </ul>


        <div class:sharingStyle>
            <center>
                <a href="https://docs.google.com/spreadsheets/d/{sheetsId}/edit#gid=1296169145">View in Google Sheets</a>
                | <a href="{shareLink}" sveltekit:reload>Share</a>
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

    .sharingStyle {
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
        font-style: italic;
        color: darkgray;
        opacity: .7;
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
</style>