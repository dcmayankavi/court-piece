import React, { Component } from "react";
import "./index.scss";
import { getSymbol } from "../../lib/helper";

class TrumpSelection extends Component {
  constructor(props) {
    super(props);

    this.handlebtnClick = this.handlebtnClick.bind(this);
    this.state = {
      trump: ""
    };
  }

  handlebtnClick(e) {
    const { socket, gameId } = this.props;
    const { trump } = this.state;
    socket.emit("trumpSelected", { trump, gameId });
  }

  render() {
    const { trump } = this.state;
    return (
      <div className="trump-selection">
        <div className="container">
          <h3 className="trump-selection-title">
            Choose trump card from below options:{" "}
          </h3>
          <div className="form-row">
            <div className="form-column input">
              <label className="trump-H red">
                <input
                  type="radio"
                  name="trump"
                  value="H"
                  onChange={({ target }) =>
                    this.setState({ trump: target.value })}
                />
                <span>{getSymbol("H")}</span>
              </label>
              <label className="trump-S">
                <input
                  type="radio"
                  name="trump"
                  value="S"
                  onChange={({ target }) =>
                    this.setState({ trump: target.value })}
                />
                <span>{getSymbol("S")}</span>
              </label>
              <label className="trump-D red">
                <input
                  type="radio"
                  name="trump"
                  value="D"
                  onChange={({ target }) =>
                    this.setState({ trump: target.value })}
                />
                <span>{getSymbol("D")}</span>
              </label>
              <label className="trump-C">
                <input
                  type="radio"
                  name="trump"
                  value="C"
                  onChange={({ target }) =>
                    this.setState({ trump: target.value })}
                />
                <span>{getSymbol("C")}</span>
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-column input">
              <button
                className="submit"
                onClick={this.handlebtnClick}
                disabled={!trump}
              >
                Select Trump
              </button>
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default TrumpSelection;
