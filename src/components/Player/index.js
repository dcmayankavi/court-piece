import React, { Fragment } from "react";
import classnames from "classnames";
import male from "../../images/male.png";
import female from "../../images/female.png";
import TrumpSelection from "../TrumpSelection";
import Card from "../Card";
import "./index.scss";

function Player({
  className,
  self,
  name,
  gender,
  cards,
  loading,
  team,
  selectTrump,
  myGameId,
  cardAllowed,
  socket
}) {
  const icon = gender === "f" ? female : male;
  const playerProfile = (
    <div className="player-info-wrapper">
      <img className="player-icon" src={icon} alt="Player Icon" />,
      <div className="player-name">{name}</div>,
      <span className={classnames("team-marker", team)} />
    </div>
  );

  let haveAllowedCard = false;
  for (var i = 0; i < cards.length; i++) {
    if (cards[i] && cards[i][0] === cardAllowed) {
      haveAllowedCard = true;
      break;
    }
  }

  const handleCardClick = card => {
    socket.emit("cardPlayed", { cardPlayed: card, gameId: myGameId });
  };

  return (
    <Fragment>
      <div
        className={classnames("player-wrapper", className, {
          "player-self": self,
          loading: loading && !selectTrump
        })}
      >
        {self ? (
          <div className="my-profile">{playerProfile}</div>
        ) : (
          playerProfile
        )}
        {cards && (
          <div className="cards-container">
            {cards.map((card, index) => (
              <Card
                key={index}
                card={self && card}
                disabled={
                  loading || (haveAllowedCard && card[0] !== cardAllowed)
                }
                onCardClick={self && handleCardClick}
              />
            ))}
          </div>
        )}
      </div>
      {self && selectTrump && (
        <TrumpSelection socket={socket} gameId={myGameId}>
          <h3 className="cards-container-title">Your first 5 cards: </h3>
          <div className="cards-container">
            {cards &&
              cards.map((card, index) => (
                <Card
                  key={index}
                  card={card}
                  disabled={
                    loading || (haveAllowedCard && card[0] !== cardAllowed)
                  }
                  onCardClick={handleCardClick}
                />
              ))}
          </div>
        </TrumpSelection>
      )}
    </Fragment>
  );
}

export default Player;
