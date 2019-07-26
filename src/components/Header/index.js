import React from "react";
import { getSymbol } from "../../lib/helper";
import classnames from "classnames";
import "./index.scss";

function Header({ game }) {
  const { trump: trumpSign, tricksCount = {} } = game || {};

  const trump = getSymbol(trumpSign);
  const colorClass = (trumpSign === "D" || trumpSign === "H") && "red";

  return (
    <header className="header">
      <div className="container">
        <div className="left-section">
          <h2>Court piece</h2>
        </div>
        {game && (
          <div className="right-section">
            <div className="trump-detail">
              <label className="label">Trump </label>
              <span className="separator">:</span>
              <span className={classnames("content", colorClass)}>{trump}</span>
            </div>
            <div className="team-score-detail">
              <label className="label">Number of Tricks by Your Team </label>
              <span className="separator">:</span>
              <span className="content">{tricksCount.blue || 0}</span>
            </div>
            <div className="team-score-detail">
              <label className="label">Number of Tricks by Opposite Team</label>
              <span className="separator">:</span>
              <span className="content">{tricksCount.green || 0}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
