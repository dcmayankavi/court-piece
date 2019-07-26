import React from "react";
import "./index.scss";
import Player from "../Player";
import Card from "../Card";

const getPlayers = (serverData, socketId) => {
  let players = {
    self: {
      id: socketId,
      ...serverData[socketId]
    }
  };

  let optPlayer = 1;
  Object.keys(serverData).map((key, index) => {
    if (key !== "game" && key !== "numberOfPlayers" && key !== socketId) {
      if (players.self.team === serverData[key].team) {
        players = {
          ...players,
          partner: {
            id: key,
            ...serverData[key]
          }
        };
      } else {
        players = {
          ...players,
          [`optPlayer${optPlayer}`]: {
            id: key,
            ...serverData[key]
          }
        };
        optPlayer++;
      }
    }
  });

  return players;
};

const PlayArea = ({ serverData, socketId, socket }) => {
  console.log(serverData);
  const { self, partner, optPlayer1, optPlayer2 } = getPlayers(
    serverData,
    socketId
  );

  const { game: { tricks, trickCard } } = serverData;

  return (
    <div className="play-area">
      <div className="container">
        <Player className="center" {...partner} />
        <div className="opposite-team-n-center">
          <Player {...optPlayer2} />
          <div className="center-area">
            <div className="center-area-content">
              {tricks[self.id] && (
                <Card className="self" card={tricks[self.id]} />
              )}
              {tricks[partner.id] && (
                <Card className="partner" card={tricks[partner.id]} />
              )}
              {tricks[optPlayer1.id] && (
                <Card className="opt-player-1" card={tricks[optPlayer1.id]} />
              )}
              {tricks[optPlayer2.id] && (
                <Card className="opt-player-2" card={tricks[optPlayer2.id]} />
              )}
            </div>
          </div>
          <Player {...optPlayer1} />
        </div>
        <Player
          className="center"
          self
          {...self}
          socket={socket}
          cardAllowed={trickCard}
        />
      </div>
    </div>
  );
};

export default PlayArea;
