let image;
let dropCounter = 0;
let user;
let user2;

function allowDrop(event) {
  event.preventDefault()

}

function drag(event) {
  event.dataTransfer.setData("text", event.target.src)
  console.log(event.target, "logging dag event")
}

function drop(event) {
  event.preventDefault()
  console.log(event.target, "log drop event target")
  let dropImage = event.dataTransfer.getData("text")
  console.log(dropImage, "logging drop image event")
  event.target.innerHTML = `<img src=${dropImage}>`
  event.target.className = "occupied"
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
      const allEmpireShips = document.querySelectorAll(".empire")
      const allRebelShips = document.querySelectorAll(".rebel")
      dropCounter = 0;
      if (user2.side === "rebel") {
        allEmpireShips.forEach((empire) => {
          empire.style.display = "none"
        })
        allRebelShips.forEach((rebel) => {
          rebel.style.display = "block"
        })

      } //end of if statement
      else {
        allRebelShips.forEach((rebel) => {
          rebel.style.display = "none"
        })
        allEmpireShips.forEach((empire) => {
          empire.style.display = "block"
        })

      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const rows = 10;
  const cols = 10;
  const squareSize = 75;
  const side = "empire"

  const allEmpireShips = document.querySelectorAll(".empire")
  const allRebelShips = document.querySelectorAll(".rebel")

  //fetch request for player1
  fetch('http://localhost:3000/users/3')
    .then((response) => {
      return response.json()
    })
    .then((userData) => {
      user = userData
      user.side = "empire" //adding another hash to user with side = empire
      if (user.side === "empire") {
        allRebelShips.forEach((rebel) => {
          rebel.style.display = "none"
        })

      } //end of if statement
      else {
        allEmpireShips.forEach((empire) => {
          empire.style.display = "none"
        })
      }
    })

  //fetch request for player2
  fetch('http://localhost:3000/users/4')
    .then((response) => {
      return response.json()
    })
    .then((userData) => {
      user2 = userData
      user2.side = "rebel" //adding another hash to user2 with side = rebel
    })

  // get the board container element
  //board will be the same representation to playerTwoGuess
  //boardTwo will be the same as playerOneGuess
  const board = document.getElementById("board")
  const boardTwo = document.getElementById("boardTwo") //second board
  const playerOneGuess = document.getElementById("playerOneGuess")
  const playerTwoGuess = document.getElementById("playerTwoGuess")

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

      guessOne.dataset.id = 's' + j + i;
      guessTwo.dataset.id = 't' + j + i;


    }
  }

  //score container
  const scoreContainer = document.getElementById("score-display")
  scoreCounter = 0;

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
  console.log(this)
  if (event.target.parentElement.className === "grid-square" || event.target.parentElement.className === "occupied") {
    console.log(event.target)

    //if hit we're going to increment the score counter,
    //and set the playerScore id HTML to the score counter
    if (event.target.parentElement.className === "occupied") {
      event.target.src = "assets/images/deathstar_implosion.jpeg"
      scoreCounter++
      const playerScore = document.getElementById("playerScore")
      playerScore.innerText = scoreCounter

      if (scoreCounter === 17) {
        alert("You won!")
      }

      //if it's a miss, then nothing happens.
    } else if (event.target.parentElement.className !== "occupied") {
      document.getElementById(event.target.id).style.backgroundColor = "yellow"
    }
  }

}

//Todo list:
//guess board should display hit or miss once all ship positions have been set
//increment score
//if it's a hit (sound effect)
//use the h6 tag where the Value text is to decrement the Value, everytime its used
//alert the user when they used up their value points
//include the CSS style
//include audio
