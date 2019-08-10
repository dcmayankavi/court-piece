const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const port = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname, "../build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const server = http.createServer(app);
const io = socketIo(server);

const shuffle = arra1 => {
  var ctr = arra1.length,
    temp,
    index;

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
};

let cards = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "H7",
  "H8",
  "H9",
  "H10",
  "HJ",
  "HQ",
  "HK",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "C10",
  "CJ",
  "CQ",
  "CK",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
  "DJ",
  "DQ",
  "DK",
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
  "S9",
  "S10",
  "SJ",
  "SQ",
  "SK"
];
let courtPiece = {};
let playerGameMap = {};
let numberOfGames = 0;

const is1stBiggerThan2nd = (first, second) => {
  const firstCardNumber = first.substr(1);
  const secondCardNumber = second.substr(1);

  const cardValue = {
    "1": 14,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13
  };

  return cardValue[firstCardNumber] > cardValue[secondCardNumber];
};

const checkTrickWinner = ({ tricks, trump }) => {
  let winner;

  Object.keys(tricks).map(playerId => {
    if (winner) {
      if (tricks[winner][0] === tricks[playerId][0]) {
        if (is1stBiggerThan2nd(tricks[playerId], tricks[winner])) {
          winner = playerId;
        }
      } else if (tricks[playerId][0] === trump) {
        winner = playerId;
      }
    } else {
      winner = playerId;
    }
  });
  return winner;
};

const cardPlayed = ({ gameId, cardPlayed }, socketId) => {
  let { game, numberOfPlayers, ...gamePlayers } = courtPiece[gameId];
  const currentPlayerId = game.players[game.currentPlayer];

  // Remove played card from user's cards
  const index = gamePlayers[currentPlayerId].cards.indexOf(cardPlayed);
  index > -1 && gamePlayers[currentPlayerId].cards.splice(index, 1);

  if (game.currentPlayer < 3) {
    if (game.currentPlayer === 0) game.trickCard = cardPlayed[0];
    game.tricks[currentPlayerId] = cardPlayed;
    game.currentPlayer = game.currentPlayer + 1;
  } else {
    game.tricks[currentPlayerId] = cardPlayed;

    const trickWinner = checkTrickWinner(game);

    game.tricksCount[gamePlayers[trickWinner].team] =
      game.tricksCount[gamePlayers[trickWinner].team] + 1;

    if (game.tricksCount[gamePlayers[trickWinner].team] >= 7) {
      game["winningTeam"] = gamePlayers[trickWinner].team;
    }

    game.tricks = {};
    game.trickCard = undefined;
    game.currentPlayer = 0;

    // Change opener
    const winnerIndex = game.players.indexOf(trickWinner);
    let newPlayers = [trickWinner];
    let newIndex = winnerIndex;
    for (var i = 0; i < 3; i++) {
      newIndex = newIndex < 3 ? newIndex + 1 : 0;
      newPlayers.push(game.players[newIndex]);
    }
    game.players = newPlayers;
  }

  Object.keys(gamePlayers).map(playerId => {
    gamePlayers[playerId]["loading"] = true;
  });

  gamePlayers[game.players[game.currentPlayer]]["loading"] = false;

  getApiAndEmit(socketId);
};

const initGame = gameId => {
  let { game, numberOfPlayers, ...gamePlayers } = courtPiece[gameId];

  console.log("Game started!");
  // Distribute cards 1st five cards
  for (var i = 0; i < 5; i++) {
    Object.keys(gamePlayers).map(playerId => {
      gamePlayers[playerId].cards.push(game.cards.shift());
    });
  }

  // Let opener decide Trump
  Object.keys(gamePlayers).map(playerId => {
    gamePlayers[playerId]["loading"] = true;
    gamePlayers[playerId]["selectTrump"] = playerId === game.opener;
  });
};

const trumpSelected = ({ gameId, trump }, socketId) => {
  let { game, numberOfPlayers, ...gamePlayers } = courtPiece[gameId] || {};

  // Updated trump
  game["trump"] = trump;
  gamePlayers[game.opener]["selectTrump"] = false;
  gamePlayers[game.players[game.currentPlayer]]["loading"] = false;

  // Distribute cards 1st five cards
  for (var i = 0; i < 8; i++) {
    Object.keys(gamePlayers).map(playerId => {
      gamePlayers[playerId].cards.push(game.cards.shift());
    });
  }

  console.log("All card distributed!");
  getApiAndEmit(socketId);
};

let interval;
io.on("connection", socket => {
  const { id: socketId } = socket;

  socket.on("newPlayerRequest", data => {
    if (
      numberOfGames === 0 ||
      courtPiece[`game-${numberOfGames}`].numberOfPlayers === 4 ||
      courtPiece[`game-${numberOfGames}`].gameAborted
    ) {
      numberOfGames++;
      courtPiece = {
        ...courtPiece,
        [`game-${numberOfGames}`]: {
          numberOfPlayers: 1,
          game: {
            cards: shuffle(cards),
            opener: socketId,
            players: [socketId],
            currentPlayer: 0,
            tricks: {},
            tricksCount: {
              blue: 0,
              green: 0
            }
          },
          [socketId]: {
            myGameId: `game-${numberOfGames}`,
            team: "blue",
            cards: [],
            ...data
          }
        }
      };
    } else {
      const { numberOfPlayers } = courtPiece[`game-${numberOfGames}`];
      courtPiece = {
        ...courtPiece,
        [`game-${numberOfGames}`]: {
          ...courtPiece[`game-${numberOfGames}`],
          game: {
            ...courtPiece[`game-${numberOfGames}`].game,
            players: [
              ...courtPiece[`game-${numberOfGames}`].game.players,
              socketId
            ]
          },
          numberOfPlayers: numberOfPlayers + 1,
          [socketId]: {
            myGameId: `game-${numberOfGames}`,
            cards: [],
            team: numberOfPlayers + 1 === 3 ? "blue" : "green",
            ...data
          }
        }
      };

      courtPiece[`game-${numberOfGames}`].numberOfPlayers === 4 &&
        initGame(`game-${numberOfGames}`);
    }

    playerGameMap = {
      ...playerGameMap,
      [socketId]: `game-${numberOfGames}`
    };

    getApiAndEmit(socketId);
  });

  socket.on("trumpSelected", data => trumpSelected(data, socketId));
  socket.on("cardPlayed", data => cardPlayed(data, socketId));

  console.log("New client connected");
  getApiAndEmit(socketId);

  socket.on("disconnect", () => {
    console.log("Client disconnected");

    if (
      courtPiece[`game-${numberOfGames}`] &&
      courtPiece[`game-${numberOfGames}`][socketId]
    ) {
      courtPiece[`game-${numberOfGames}`] = {
        ...courtPiece[`game-${numberOfGames}`],
        gameAborted: courtPiece[`game-${numberOfGames}`][socketId]
      };
      getApiAndEmit(socketId);
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

const getApiAndEmit = async socketId => {
  io.sockets.emit(
    "FromAPI",
    courtPiece[playerGameMap[socketId]] || {
      registerPlease: true
    }
  ); // Emitting a new message. It will be consumed by the client
};
