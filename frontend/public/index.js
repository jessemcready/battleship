let image;
let dropCounter = 0;
let user = {};
let user2 = {};
const room = 'abc'

function allowDrop(event) {
  event.preventDefault()
}

function drag(event) {
  event.dataTransfer.setData("URL", event.target.src)
}

function drop(event) {
  // prevent drop from doing it's normal duty
  event.preventDefault()
  // get the image url that we set in the drag function
  let dropImage = event.dataTransfer.getData("URL")
  // grab the ID of the image
  const draggedImageId = dropImage.split('/')[dropImage.split('/').length - 1]
  // set the board square innerHTML to be the image we dragged
  event.target.innerHTML = `<img class="${draggedImageId}" src=${dropImage} draggable="true" ondragstart="drag(event)">`
  // set the board class to occupied so we can check on click
  event.target.className = "occupied"
  // get the original image tag in our display ships container
  let draggedImage = document.getElementById(draggedImageId)
  // decrease the dataset id, which acts as a counter for how many of those ships you can have
  draggedImage.dataset.id -= 1
  // if our counter hits 0
  if(draggedImage.dataset.id == 0){
    // hide the image on the side
    draggedImage.parentElement.style.display = 'none'
    // get all images that have the class name that we set on line 23
    const images = document.getElementsByClassName(`${draggedImageId}`)
    // loop through those images and make them no longer draggable
    for(let i = 0; i < images.length; i++){
      images[i].setAttribute('draggable', false)
    }
  }
  // increase our drop counter
  dropCounter++
  // if we reach 17 drops, out board is set so emit that and send an alert
  if (dropCounter === 17) {
      socket.emit("ship set")
      alert("Your ship positions are set!")
    }
  }

document.addEventListener('DOMContentLoaded', () => {
  // get the board container element
  //board will be the same representation to playerTwoGuess
  //boardTwo will be the same as playerOneGuess
  const board = document.getElementById("board")
  const playerOneGuess = document.getElementById("playerOneGuess")
  const gameArea = document.getElementById('gameArea')
  const tieFighterFire = document.getElementById('TIE_Fighter_Fire')
  const xWingFire = document.getElementById('XWing_Fire')
  const explodeShip = document.getElementById('XWing_Explode')
  const vaderHaveYou = document.getElementById('Darth_Vader_I_Have_You_Now')
  const yodaForce = document.getElementById('Yoda_Force')
  const vaderDontFail = document.getElementById('Darth_Vader_Dont_Fail')
  const itsATrap = document.getElementById('Its_A_Trap')
  const userForm = document.getElementById('user-form')
  const allEmpireShips = document.querySelectorAll(".empire")
  const allRebelShips = document.querySelectorAll(".rebel")
  const scoreContainer = document.getElementById("score-display")
  const allShipsContainer = document.getElementById("displayShip")
  let playerScore = document.getElementById("playerScore")
  let playerTwoScore = document.getElementById("playerTwoScore")
  let scoreCounter = 0;
  let scoreCounterTwo = 0;

  //leaderboard
  const leaderboard = document.getElementById("leaderboard")
  fetch('http://localhost:3000/leaderboard')
  .then(response => response.json())
  .then(leaderboardJsonObject => {
    const leaders = leaderboardJsonObject.map((leader) => {
      return (`
        <p>${leader.name}</p>
        <p>${leader.win} - ${leader.loss}</p>
        `)
    }).join('')
    leaderboard.innerHTML += leaders
  })

  //socket******************************************************//
  socket.on("battle", function() {
    // when we get the battle event, we show the guessing board
    console.log("Time to battle")
    document.getElementById("playerOneGuess").style.display = "grid"
    document.getElementById("displayShip").style.display = "none"
  })
  socket.on("player joined", function(message) {
    console.log(message)
  })

  socket.on("start a game", function(players) {
    // we check if the user === anyone in the players object
    // if they aren't equal to at least one
    if(JSON.stringify(user) !== JSON.stringify(players[0]) || JSON.stringify(user) !== JSON.stringify(players[1])) {
      // check to see if the user is players[0]
      if(JSON.stringify(user) === JSON.stringify(players[0])){
        // if user is already set to players[0], which we do for the original person who
        // submits the form, we just make sure the user is set, and then
        // we set the side and the turn
        user = players[0]
        user.side = 'rebel'
        user.turn = true
      } else {
        // otherwise we're in player 2, so we set the second person's user
        // to whoever was second on the form
        user = players[1]
        // we then set the side to empire and turn to false because player one goes first
        user.side = 'empire'
        user.turn = false
        // we also update the place where we will be displaying our score
        playerScore = playerTwoScore
        playerTwoScore = document.getElementById("playerScore")
      }
    }
    // we then grab the form container
    const formContainer = document.getElementById("user-form-container")
    const mainPageHeader = document.getElementById("main-page-header")
    // hide the form container
    formContainer.style.display = 'none'
    mainPageHeader.style.display = 'none'
    // and display the game area, which at first is just your board to set
    // and your ships
    gameArea.style.display = 'block'
    // set the players score container with their names
    document.getElementById('player-one-score').innerText = `${players[0].name}'s Score`
    document.getElementById('player-two-score').innerText = `${players[1].name}'s Score`
    // then display the ships appropriate for the user
    displayShips(user)
  })

  socket.on("connect", function() {
    // when we join the socket, we then join a room
    socket.emit("room", room)
  })

  socket.on("check", function(squareId) {
    // when we click on our guessing board
    // we check if we are the person who is being attacked
    if(user.turn == false) {
      // if we are being attacked, we check whether the guess from one user
      // hits anywhere on our user's actually set board
      if (board.querySelector(`#${squareId}`).className === "occupied") {
        // if the other user guessed a hit, play some sounds
        vaderHaveYou.play()
        tieFighterFire.play()
        // then on our user's side, we change where our ship was hit to the explosion
        board.querySelector(`#${squareId}`).innerHTML = `<img src="https://media.giphy.com/media/xupGR5MORpnk4/giphy.gif">`
        // increment the other players score
        scoreCounterTwo++
        // display the other players new score
        playerTwoScore.innerText = scoreCounterTwo
        // emit to our express server that we have been hit at squareId
        socket.emit("hit or miss", "hit", squareId)
      } else {
        // if we missed, we play sounds
        vaderDontFail.play()
        tieFighterFire.play()
        // display that the user attacked a square but missed and indicate the miss
        // on our set board with a yellow square
        board.querySelector(`#${squareId}`).style.backgroundColor = "yellow"
        // then emit to our express server that the attack missed
        socket.emit("hit or miss", "miss", squareId)
      }
    }
  })

  socket.on('registerHitOrMiss', function(guess, squareId){
    // after socket.emit('hit or miss'), our express server grabs that event
    // and then sends back an io.emit('registerHitOrMiss')
    // on our client side, we receive this 'registerHitOrMiss' event
    if(user.turn){
      // if we were the one who guessed
      if(guess === 'hit'){
        // we check if our guess was a hit , if it was, make our
        // guessing board reflect the hit with a red background on the square
        document.getElementById(`square-${squareId}`).style.backgroundColor = "red"
        // increment our score counter
        scoreCounter++
        // display our new score
        playerScore.innerText = scoreCounter
        // check to see if we won the game
        if (scoreCounter === 17) {
          explodeShip.play()
          alert(`${user.name} has won!`)
          // add win to user in the database
          socket.emit("add win", user)
        } else {
          // if we didn't win yet, emit 'change' to change sides
          socket.emit('change');
        }
      } else {
        // if our guess missed, update our guessing board with a yellow background
        document.getElementById(`square-${squareId}`).style.backgroundColor = "yellow"
        // and change sides
        socket.emit('change');
      }
    }
  })

  socket.on('add win to user', function(winningUser){
    if(JSON.stringify(winningUser) === JSON.stringify(user)){
      fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          win: ++user.win
        })
      })
    } else{
      fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          loss: ++user.loss
        })
      })
    }
  })

  socket.on('changeTurns', function() {
    // check to see if it our turn
    if(user.turn){
      // if it is our turn, make it not our turn
      user.turn = false
    } else {
      // otherwise make it our turn
      user.turn = true
    }
  })

  // these 3 lines are the grid squares that we append later on
  const rows = 10;
  const cols = 10;
  const squareSize = 75;

  // add an event listener on our form so that when the user clicks it
  // we start playing the greatest cantina song of all time
  userForm.addEventListener('click', event => {
    document.getElementById('Cantina_Band').autoplay = true
    document.getElementById('Cantina_Band').load()
  })

  // we also add a submit listener on the same form
  userForm.addEventListener('submit', event => {
    // prevent the form from reloading the page
    event.preventDefault();
    // get both player names
    const player1 = userForm.querySelectorAll('input')[0].value
    const player2 = userForm.querySelectorAll('input')[1].value
    // make a post request to make these users
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: player1,
        win: 0,
        loss: 0,
        turn: true
      })
    }).then(res => res.json()).then(userData => {
      user = userData
    }).then( () => {
      fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: player2,
          win: 0,
          loss: 0,
          turn: false
        })
      }).then(res => res.json()).then(userData => {
        user2 = userData
        // after our second user has been created, then we
        // hide the form and display our game area
        userForm.parentElement.style.display = 'none'
        gameArea.style.display = 'block'
      }).then( () => {
        // once everything has been created, we stop the cantina background music
        document.getElementById('Cantina_Band').pause()
        // and start the theme music for the fight
        document.getElementById('Theme_Music').autoplay = true
        // we loop it so it plays the whole time
        document.getElementById('Theme_Music').loop = true
        document.getElementById('Theme_Music').load()
        // we then emit to our express server that we're ready to start
        // and we pass in our two users
        socket.emit("start game",user,user2)
      })
    })
  })


  // make the grid columns and rows
  for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
      // create a new div HTML element for each grid square and make it the right size
      const square1 = document.createElement("div");
      board.appendChild(square1);

      const guessOne = document.createElement("div")
      playerOneGuess.appendChild(guessOne)

      // give each div element a unique id based on its row and column, like "s00"
      square1.id = 's' + j + i;
      square1.className = "grid-square"

      guessOne.dataset.id = 's' + j + i;
      guessOne.id = `square-s` + j + i;
      guessOne.className = "grid-square"

    }
  }

  // add a drag event listener to our ship images
  allShipsContainer.addEventListener("ondragover", function(event) {
    event.dataTransfer.setData("text", event.target.id)

    if (event.target.tagName === "IMG") {
      console.log(event.dataTransfer.getData("text"))
    }

  }) //image is our draggable event

  // add an event listener to our guessing board
  // so that on click we try to attack ships
  playerOneGuess.addEventListener("click", attackShips.bind(playerOneGuess))

}) //end of dom loader

function attackShips() {
  // if it is our turn to guess
  if(user.turn){
    const playerOneSetBoard = document.getElementById("board")

    //check this.id for playerOne click is equal to board or boardTwo
    if (event.target.className === "grid-square") {
      if (this.id === "playerOneGuess") {
        // if we clicked on a place to guess, emit the 'guess' event
        // to our express server
        event.target.className = 'guessed'
        socket.emit("guess", event.target.dataset.id)
      }
    } //end of if statement in line 169
  }
} //end of attack ships function


function displayShips(playerOne){
  // displayShips will take in our user, and display only
  // the ships that match whatever side they picked in
  // the pregame form
  const allEmpireShips = document.querySelectorAll(".empire")
  const allRebelShips = document.querySelectorAll(".rebel")
  if(playerOne.side === 'rebel'){
    allEmpireShips.forEach(ship => {
      ship.style.display = 'none';
    })
    allRebelShips.forEach(ship => {
      ship.style.display = 'block';
    })
  }else{
    allRebelShips.forEach(ship => {
      ship.style.display = 'none';
    })
    allEmpireShips.forEach(ship => {
      ship.style.display = 'block';
    })
  }
}
