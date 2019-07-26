import React, { Component } from "react";
import "./App.scss";
import Header from "./components/Header";
import PlayArea from "./components/PlayArea";
import Registration from "./components/Registration";

class App extends Component {
  render() {
    const { serverData, socketId, socket } = this.props;

    if (serverData && serverData["gameAborted"]) {
      return (
        <div>
          Aborted: {serverData["gameAborted"].name} left the game in-between, to
          play again please re-register.
        </div>
      );
    }
    console.log(serverData);

    return (
      <div className="App">
        <Header
          game={serverData && serverData.game ? serverData.game : undefined}
        />

        {serverData &&
          (serverData["registerPlease"] ? (
            <Registration socket={socket} />
          ) : serverData.numberOfPlayers === 4 ? !serverData.game
            .winningTeam ? (
            <PlayArea
              serverData={serverData}
              socketId={socketId}
              socket={socket}
            />
          ) : (
            <div className="container">
              {serverData[socketId].team === serverData.game.winningTeam ? (
                "You won!"
              ) : (
                "You lose"
              )}
            </div>
          ) : (
            <div className="container">
              Waiting for {4 - serverData.numberOfPlayers} players.
            </div>
          ))}

        {serverData &&
        serverData["gameAborted"] && (
          <div>
            Aborted: <strong>{serverData["gameAborted"].name}</strong> left the
            game. To start with new game, please refresh.
          </div>
        )}
      </div>
    );
  }
}

export default App;
