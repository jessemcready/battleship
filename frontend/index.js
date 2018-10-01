document.addEventListener('DOMContentLoaded', () => {
  const rows = 10;
  const cols = 10;
  const squareSize = 50;

  // get the container element
  const board = document.getElementById("board");

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

    board.addEventListener("click", function(event){
      if(event.target.className === "grid-square" || event.target.className === "occupied") {
        console.log(event.target)

      if(event.target.className === "occupied") {
        document.getElementById(event.target.id).style.backgroundColor = "red"
      }
      else if(event.target.className !== "occupied") {
        document.getElementById(event.target.id).style.backgroundColor = "yellow"
      }
    }

    }) //end of grid event listener

    for (var i = 0; i < 9; i++) {
        document.getElementById(`s${i}0`).className = "occupied"
    }

    for (var i = 0; i < 8; i++) {
        document.getElementById(`s${i}1`).className = "occupied"
    }




})
