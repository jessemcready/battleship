# Battleship

Play Battleship across two computers using this web app!

## [Demo Video](https://www.youtube.com/watch?v=zDsfUd7383A)

## Technology Stack

Written in vanilla Javascript, this app uses [socket.io](socket.io) and [Express](https://expressjs.com/) to deliver real time information betweeen two clients.  

## How to use

After cloning, open your terminal navigate to the `backend/battleship` folder and run `bundle && rails db:create && rails db:migrate && rails db:seed && rails s`. Make sure you have Postgres installed and running on your computer. In another terminal tab, navigate to the `frontend` folder. Run `npm install && npm start` or `yarn && yarn start` to install node modules and start the frontend up.  

## Playing

Right now, the app only supports two players in a room. So have two computers navigate to `localhost:3001`. Whoever is filling out the forms should be player one and a Rebel and the other player should not fill out any forms on their side. Once player one is done filling out the form, the game will start on both users screens. At this point both users should drag and drop the ship images from the side onto the game board.  Normal battleship position rules do not apply to space ships if you don't want them to, so have fun. Once both users have set their pieces, the game will begin. Click on the smaller board on the right to guess against your opponents board. Play with the sound on to really get immersed. 
