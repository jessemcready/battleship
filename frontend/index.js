let image;
let dropCounter = 0;
let user;
let user2;

function allowDrop(event) {
  event.preventDefault()

}

function drag(event) {
  event.dataTransfer.setData("URL", event.target.src)
}

function drop(event) {
  event.preventDefault()
  let dropImage = event.dataTransfer.getData("URL")
  const draggedImageId = dropImage.split('/')[dropImage.split('/').length - 1]
  event.target.innerHTML = `<img class="${draggedImageId}" src=${dropImage} draggable="true" ondragstart="drag(event)">`
  event.target.className = "occupied"
  let draggedImage = document.getElementById(draggedImageId)
  draggedImage.dataset.id -= 1
  if(draggedImage.dataset.id == 0){
    draggedImage.parentElement.style.display = 'none'
    const images = document.getElementsByClassName(`${draggedImageId}`)
    for(let i = 0; i < images.length; i++){
      images[i].setAttribute('draggable', false)
    }
  }
  dropCounter++
  if (dropCounter === 17) {
    alert("Your ship positions are set!")
    if (document.getElementById("board").style.display === "none") {
      document.getElementById("boardTwo").style.display = "none"
      document.getElementById("board").style.display = "grid"
      document.getElementById("playerOneGuess").style.display = "grid"
      document.getElementById("displayShip").style.display = "none"
    } else {
      document.getElementById("board").style.display = "none"
      document.getElementById("boardTwo").style.display = "grid"
      dropCounter = 0;
      displayShips(user2)
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const rows = 10;
  const cols = 10;
  const squareSize = 75;


  const userForm = document.getElementById('user-form')

  const allEmpireShips = document.querySelectorAll(".empire")
  const allRebelShips = document.querySelectorAll(".rebel")



  // get the board container element
  //board will be the same representation to playerTwoGuess
  //boardTwo will be the same as playerOneGuess
  const board = document.getElementById("board")
  const boardTwo = document.getElementById("boardTwo") //second board
  const playerOneGuess = document.getElementById("playerOneGuess")
  const playerTwoGuess = document.getElementById("playerTwoGuess")
  const gameArea = document.getElementById('gameArea')

  userForm.addEventListener('click', event => {
    document.getElementById('Cantina_Band').autoplay = true
    document.getElementById('Cantina_Band').load()
  })

  userForm.addEventListener('submit', event => {
    event.preventDefault();
    const player1 = userForm.querySelectorAll('input')[0].value
    const player2 = userForm.querySelectorAll('input')[1].value
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
        turn: false
      })
    }).then(res => res.json()).then(userData => {
      user = userData
      user.side = 'rebel'
      document.getElementById('player-one-score').innerText = `${user.name}'s Score`
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
        user2.side = 'empire'
        document.getElementById('player-two-score').innerText = `${user2.name}'s Score`
        userForm.parentElement.style.display = 'none'
        gameArea.style.display = 'block'
      }).then( () => {
        displayShips(user)
        document.getElementById('Cantina_Band').pause()
        document.getElementById('Theme_Music').autoplay = true
        document.getElementById('Theme_Music').loop = true
        document.getElementById('Theme_Music').load()
      })
    })
  })


  // make the grid columns and rows
  for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
      // create a new div HTML element for each grid square and make it the right size
      const square1 = document.createElement("div");
      board.appendChild(square1);

      const square2 = document.createElement("div");
      boardTwo.appendChild(square2);

      const guessOne = document.createElement("div")
      playerOneGuess.appendChild(guessOne)

      const guessTwo = document.createElement("div")
      playerTwoGuess.appendChild(guessTwo)

      // give each div element a unique id based on its row and column, like "s00"
      square1.id = 's' + j + i;
      square1.className = "grid-square"

      square2.id = 't' + j + i;
      square2.className = "grid-square"

      guessOne.dataset.id = 't' + j + i;
      guessOne.className = "grid-square"
      guessTwo.dataset.id = 's' + j + i;
      guessTwo.className = "grid-square"

    }
  }

  //score container
  const scoreContainer = document.getElementById("score-display")
  scoreCounter = 0;
  scoreCounterTwo = 0;

  const allShipsContainer = document.getElementById("displayShip")

  allShipsContainer.addEventListener("ondragover", function(event) {
    event.dataTransfer.setData("text", event.target.id)

    if (event.target.tagName === "IMG") {
      console.log(event.dataTransfer.getData("text"))
    }

  }) //image is our draggable event


  playerOneGuess.addEventListener("click", attackShips.bind(playerOneGuess))
  playerTwoGuess.addEventListener("click", attackShips.bind(playerTwoGuess))





}) //end of dom loader

function attackShips() {

  const playerOneSetBoard = document.getElementById("board")
  const playerTwoSetBoard = document.getElementById("boardTwo")

  const playerScore = document.getElementById("playerScore")
  const playerTwoScore = document.getElementById("playerTwoScore")

  const tieFighterFire = document.getElementById('TIE_Fighter_Fire')
  const xWingFire = document.getElementById('XWing_Fire')
  const explodeShip = document.getElementById('XWing_Explode')
  const vaderHaveYou = document.getElementById('Darth_Vader_I_Have_You_Now')
  const yodaForce = document.getElementById('Yoda_Force')
  const vaderDontFail = document.getElementById('Darth_Vader_Dont_Fail')
  const itsATrap = document.getElementById('Its_A_Trap')


  //check this.id for playerOne click is equal to board or boardTwo
  if (event.target.className === "grid-square") {
    if (this.id === "playerOneGuess") {
      if (playerTwoSetBoard.querySelector(`#${event.target.dataset.id}`).className === "occupied") {
        yodaForce.play()
        xWingFire.play()
        event.target.style.backgroundColor = "red"
        playerTwoSetBoard.querySelector(`#${event.target.dataset.id}`).innerHTML = `<img src="https://media.giphy.com/media/xupGR5MORpnk4/giphy.gif">`
        scoreCounter++
        playerScore.innerText = scoreCounter
        if (scoreCounter === 17) {
          explodeShip.play()
          alert("The Rebels are Victorious")
        }
        this.style.display = "none"
        playerOneSetBoard.style.display = "none"
        playerTwoSetBoard.style.display = "grid"
        document.getElementById("playerTwoGuess").style.display = "grid"
      } else if (playerTwoSetBoard.querySelector(`#${event.target.dataset.id}`).className !== "occupied") {
        itsATrap.play()
        xWingFire.play()
      event.target.style.backgroundColor = "yellow"
      playerTwoSetBoard.querySelector(`#${event.target.dataset.id}`).style.backgroundColor = "yellow"
      this.style.display = "none"
      playerOneSetBoard.style.display = "none"
      playerTwoSetBoard.style.display = "grid"
      document.getElementById("playerTwoGuess").style.display = "grid"
    }
  } //end of if statement in line 169
  else {
    if (playerOneSetBoard.querySelector(`#${event.target.dataset.id}`).className === "occupied") {
      vaderHaveYou.play()
      tieFighterFire.play()
      event.target.style.backgroundColor = "red"
      playerOneSetBoard.querySelector(`#${event.target.dataset.id}`).innerHTML = `<img src="https://media.giphy.com/media/xupGR5MORpnk4/giphy.gif">`
      scoreCounterTwo++
      playerTwoScore.innerText = scoreCounterTwo
      if (scoreCounterTwo === 17) {
        explodeShip.play()
        alert("The Empire has Defeated the Rebel Scum")
      }
      this.style.display = "none"
      playerTwoSetBoard.style.display = "none"
      playerOneSetBoard.style.display = "grid"
      document.getElementById("playerOneGuess").style.display = "grid"
    } else if (playerOneSetBoard.querySelector(`#${event.target.dataset.id}`).className !== "occupied") {
      vaderDontFail.play()
      tieFighterFire.play()
    event.target.style.backgroundColor = "yellow"
    playerOneSetBoard.querySelector(`#${event.target.dataset.id}`).style.backgroundColor = "yellow"
    this.style.display = "none"
    playerTwoSetBoard.style.display = "none"
    playerOneSetBoard.style.display = "grid"
    document.getElementById("playerOneGuess").style.display = "grid"
      }
    }
  }
}

function displayShips(playerOne){
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

//Todo list:

//secondary (styling)
//if it's a hit (sound effect)
//include the CSS style
//include audio
