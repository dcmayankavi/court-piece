import React, {Fragment} from 'react';

const getSymbol = (sign) => {
    switch (sign) {
      case "S":
        return <Fragment>&spades;</Fragment>;

      case "H":
        return <Fragment>&hearts;</Fragment>;

      case "D":
        return <Fragment>&diams;</Fragment>;

      case "C":
        return <Fragment>&clubs;</Fragment>;

      default:
        return "";
    }
  }

export {
  getSymbol
}