<script>
    import html2canvas from 'html2canvas';

    export let title;
    export let numTotal;
    export let numMen;
    export let numWomen;
    export let members;

    import { page } from '$app/stores'

    let sharingStyle = $page.url.searchParams.has('share');
    let mainElement;


    let shareLink = new URL($page.url);

    shareLink.searchParams.set('share', '1');

    function handleClickTitle() {
        console.log('handleClickTitle')
        if (sharingStyle) { // Only on sharing version.

            let options = {
                x: window.scrollX,
                y: window.scrollY,
                height: Math.min(500*1.6, mainElement.offsetHeight - 30)



            }

            html2canvas(mainElement, options).then(function(canvas){
                try {
                    canvas.toBlob((blob) => {
                        navigator.clipboard.write([
                            new ClipboardItem({ "image/png": blob })
                        ]);
                    }, "image/png");
                    console.log('Successfully copied!');
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

<main bind:this={mainElement}>
    <center>
        <div class:sharingStyle>
            <a href="https://www.facebook.com/groups/cloud9.dancehall" class="fa fa-facebook"></a>
            <a href="https://www.instagram.com/modublues/" class="fa fa-instagram"></a>
            <a href="https://cafe.naver.com/modudance" class="fa fa-coffee"></a>
        </div>
        <h1 class=title on:click={handleClickTitle}>{title}</h1>

        <div class=cta class:sharingStyle ><a href="https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform">
            <button class="button-85">신청 및 자세한 정보</button>
        </a></div>

        <div class=totals>
            <span class=total>신청자&nbsp;총:{numTotal}</span>

            <span class=men>남:{numMen}</span>&nbsp;<span class=women>여:{numWomen}</span>
        </div>
    </center>

        <ul class=members-container class:sharingStyle>
            {#each members as member}
                <li class="{`member ${member.sex} ${member.isNew}`}" style="background-image: url(/img/kelly/{`${member.num}`}.jpg)">
                    <span>{member.name}</span>
                </li>
            {/each}
        </ul>


        <div>
            <center>
                <a href="https://docs.google.com/spreadsheets/d/1eY6ICmW2L5Tu0PFup-KH-bl_0t4xMHP7rqaHouruktY/edit#gid=1296169145">View in Google Sheets</a>
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
        overflow: hidden;

        width: 24%;
        aspect-ratio: 1 / 1;

        margin-bottom: 1%;

        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

        list-style: none;

        font-size: 140%;

        text-shadow: 0 0 0.2em lightgray, 0 0 0.5em lightgray, 0 0 0.5em lightgray, 0 0 0.5em lightgray,0 0 0.2em lightgray, 0 0 0.5em lightgray, 0 0 0.5em lightgray, 0 0 0.5em lightgray, 0 0 0.2em lightgray, 0 0 0.5em lightgray, 0 0 0.5em lightgray, 0 0 0.5em lightgray,0 0 0.2em lightgray, 0 0 0.5em lightgray, 0 0 0.5em lightgray, 0 0 0.5em lightgray;


        background-repeat: no-repeat;
        background-position: 0% 0%;
        background-size: 100%;
    }

    li.member span {
        width: 100%;
        align-self: flex-end;

        margin-right: 4%;
        margin-bottom: 4%;

        text-align: right;
        font-weight: bold;
    }

    li.male span {
        color: blue;
    }

    li.female span {
        color: #FE2EA0;
    }

    ul.sharingStyle li.member {
       box-shadow: none;
    }

    @media (max-width: 353px) {
        li.member {
            width: 32%;
        }
    }

    li.new {
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