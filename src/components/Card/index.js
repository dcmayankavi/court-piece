import React from "react";
import CARD_CSS_CLASSES from "../../constants/cards";
import { getSymbol } from "../../lib/helper";
import classnames from "classnames";
import "./index.scss";

const Rules = ({ card, style, onCardClick, className, disabled }) => {
  if (!card) {
    return (
      <div id={card} className={classnames("card back-cover")}>
        <img
          className="face"
          src="images/card-cover.jpg"
          alt="Card cover"
          width="80"
          height="120"
        />
      </div>
    );
  }

  const cardNumber = card.substr(1);
  const sign = card[0];

  // Code is repeated to avoid the usage of dangerouslySetInnerHTML
  // TODO can be improved.
  const getSymbols = () => {
    return CARD_CSS_CLASSES[cardNumber].map(o => (
      <div key={o} className={o}>
        {getSymbol(sign)}
      </div>
    ));
  };

  const addIfKQJ = () => {
    let path = "";
    if (cardNumber === "K") {
      path = "images/king.gif";
    } else if (cardNumber === "J") {
      path = "images/jack.gif";
    } else if (cardNumber === "Q") {
      path = "images/queen.gif";
    } else {
      return "";
    }

    return <img className="face" src={path} alt="" width="80" height="120" />;
  };

  const getNumber = () => {
    switch (cardNumber) {
      case "A":
      case "1":
        return "A";
      case "K":
        return "K";
      case "Q":
        return "Q";
      case "J":
        return "J";
      default:
        return cardNumber;
    }
  };

  const cardHolderClassName =
    sign === "D" || sign === "H" ? "front red" : "front";

  const handleCardClick = () => {
    if (disabled) {
      return;
    }

    onCardClick && onCardClick(card);
  };

  return (
    <div
      id={card}
      className={classnames(className, "card", { "card-disabled": disabled })}
      style={style}
      onClick={handleCardClick}
    >
      <div className={cardHolderClassName}>
        <div className="index top">
          <span className="number">{getNumber()}</span>
          <span className="symbol">{getSymbol(sign)}</span>
        </div>
        {addIfKQJ()}
        {getSymbols()}
        <div className="index bottom">
          <span className="number">{getNumber()}</span>
          <span className="symbol">{getSymbol(sign)}</span>
        </div>
      </div>
    </div>
  );
};

export default Rules;
