<script>
    export let title;
    export let numTotal;
    export let numMen;
    export let numWomen;
    export let members;
</script>

<main>
    <center>
        <h1>{title}</h1>

        <div class=cta ><a href="https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform">
            <button class="button-85">신청</button>
        </a></div>

        <div>
        Total: {numTotal}

        Men: {numMen}

        Women: {numWomen}
        </div>
    </center>

    <ul class=members-container>
        {#each members as member}
            <li class="{`member ${member.sex}`}">
                <div>{member.name}</div>
            </li>
        {/each}
    </ul>

    <div>
        <center><a href="https://docs.google.com/spreadsheets/d/1eY6ICmW2L5Tu0PFup-KH-bl_0t4xMHP7rqaHouruktY/edit#gid=1296169145">View in Google Sheets</a></center>
    </div>

</main>


<style>
    :global(body) {
        background-color: rgb(241, 237, 237);
        font-family: sans-serif;
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
        padding: 24px;
        padding-top: 22px;
    }

    .cta {
        margin-bottom: 20px;;
    }

    ul.members-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0px;

        gap: 5px;
    }

    li.member {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

        list-style: none;
        display: block;
        width: 144px;
        height: 144px;
        text-align: center;

        border: 0px solid green;

        font-size: xx-large;
        font-weight: 900;

        display: flex;
        justify-content: center;

	position: relative;
    }

    li.member div {
        align-self: center;
        z-index: 100;
    }

    li.member::before {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: .6;
        content: "";

        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
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