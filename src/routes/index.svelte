<script>
    export let title;
    export let numTotal;
    export let numMen;
    export let numWomen;
    export let members;
</script>

<svelte:head>
    <title>{title}</title>

    <meta property="og:image" content="https://www.modu-blues.com/img/cloud9.png">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<main>
    <div class=wrapper>
        <center>

            <div>
                <a href="https://www.facebook.com/groups/cloud9.dancehall" class="fa fa-facebook"></a>
                <a href="https://www.instagram.com/modublues/" class="fa fa-instagram"></a>
                <a href="https://cafe.naver.com/modudance" class="fa fa-coffee"></a>
            </div>
            <h1>{title}</h1>

            <div class=cta ><a href="https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform">
                <button class="button-85">신청 및 자세한 정보</button>
            </a></div>

            <div>
            Total:{numTotal}

            Men:{numMen}

            Women:{numWomen}
            </div>
        </center>

        <ul class=members-container>
            {#each members as member}
                <li class="{`member ${member.sex} ${member.isNew}`}">
                    <div>{member.name}</div>
                </li>
            {/each}
        </ul>


        <div>
            <center><a href="https://docs.google.com/spreadsheets/d/1eY6ICmW2L5Tu0PFup-KH-bl_0t4xMHP7rqaHouruktY/edit#gid=1296169145">View in Google Sheets</a></center>
        </div>
    </div>

</main>


<style>
    :global(body) {
        background-color: rgb(241, 237, 237);
        margin: 0;
        font-family: sans-serif;

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
        margin: auto;
        max-width: 90vw;
        width: 592px;

        background-color: #fff;
        border: 1px solid #dadce0;
        border-radius: 8px;
        margin-bottom: 12px;
    }

    div.wrapper {
        margin: 0;
        padding: 24px;
        padding-top: 22px;
    }

    .cta {
        margin-bottom: 20px;
        width: 90%;
    }

    ul.members-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0px;

        gap: 5px;
        justify-content: center;
    }

    li.member {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

        list-style: none;
        display: block;
        width: 132px;
        height: 132px;

        border: 0px solid green;

        font-size: xx-large;

        display: flex;

        position: relative;

        text-shadow: 0 0 0.2em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.5em white,0 0 0.2em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.2em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.5em white,0 0 0.2em white, 0 0 0.5em white, 0 0 0.5em white, 0 0 0.5em white;

    }

    @media (max-width: 353px) {
        ul.members-container {
            gap: 2%;
        }
        li.member {
            width: 49%;
            height: 0;
            padding-bottom: 49%;

            font-size: large;
        }
        li.member div {
            padding-bottom: 49%;
        }
    }

    li.new {
        text-shadow: 0 0 0.2em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen,0 0 0.2em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.2em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen,0 0 0.2em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen, 0 0 0.5em lightgreen;
    }

    li.member div {
        overflow: hidden;
        z-index: 100;
        width: 100%;
        text-align: right;
        margin-right: 4px;
        margin-top: 4px;
    }

    li.member::before {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: 1;
        content: "";

        background-repeat: no-repeat;
        background-position: 90% -20%;
        background-size: 150%;
    }

    li.male::before {
        background-image: url("/img/man-dancing.png");

    }

    li.female::before {
        background-image: url("/img/woman-dancing.png");
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