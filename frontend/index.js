let image;
let dropCounter = 0;

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
  if(dropCounter === 17) {
    alert("Your ship positions are set!")
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const rows = 10;
  const cols = 10;
  const squareSize = 75;
  const side = "empire"

  const allEmpireShips = document.querySelectorAll(".empire")
  const allRebelShips = document.querySelectorAll(".rebel")
  let user;

  fetch('http://localhost:3000/users/3')
    .then((response) => {
      return response.json()
    })
    .then((userData) => {
      user = userData
      user.side = "empire" //adding another hash to user with side = empire
      if(user.side === "empire") {
        allRebelShips.forEach((rebel) => {
          rebel.style.display = "none"
        })

      }//end of if statement
      else {
        allEmpireShips.forEach((empire) => {
          empire.style.display = "none"
        })
      }
    })

  // get the board container element
  const board = document.getElementById("board")

  // make the grid columns and rows
  for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {

      // create a new div HTML element for each grid square and make it the right size
      const square = document.createElement("div");
      board.appendChild(square);

      // give each div element a unique id based on its row and column, like "s00"
      square.id = 's' + j + i;
      square.className = "grid-square"
    }
  }

  const scoreContainer = document.getElementById("score-display")
  scoreCounter = 0;

  for (var i = 0; i < 9; i++) {
    document.getElementById(`s${i}0`).className = "occupied"
  }

  for (var i = 0; i < 8; i++) {
    document.getElementById(`s${i}1`).className = "occupied"
  }


  const allShipsContainer = document.getElementById("displayShip")

  allShipsContainer.addEventListener("ondragover", function(event) {
      event.dataTransfer.setData("text", event.target.id)

      if (event.target.tagName === "IMG") {
        console.log(event.dataTransfer.getData("text"))
      }

  })

}) //end of dom loader

// let clickTotal = 0;
// let startClick;
// let endClick;
//
// function addShips() {
//   console.log(image)
//
//     if (event.target.className === "grid-square" && clickTotal === 0) {
//       startClick = event.target.id
//       clickTotal++
//       console.log(startClick)
//     }
//     else if(event.target.className === "grid-square" && clickTotal === 1) {
//       endClick = event.target.id
//       clickTotal = 0;
//       console.log("this is our end click", endClick)
//
//   }
//
//
// }

function attackShips() {
  if (event.target.className === "grid-square" || event.target.className === "occupied") {
    console.log(event.target)

    //if hit we're going to increment the score counter,
    //and set the playerScore id HTML to the score counter
    if (event.target.className === "occupied") {
      document.getElementById(event.target.id).style.backgroundColor = "red"
      scoreCounter++
      const playerScore = document.getElementById("playerScore")
      playerScore.innerText = scoreCounter

      if(scoreCounter === 17) {
        alert("You won!")
      }

      //if it's a miss, then nothing happens.
    } else if (event.target.className !== "occupied") {
      document.getElementById(event.target.id).style.backgroundColor = "yellow"
    }
  }

}
