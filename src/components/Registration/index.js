import React, { Component } from "react";
import "./index.scss";

class Registration extends Component {
  constructor(props) {
    super(props);

    this.handlebtnClick = this.handlebtnClick.bind(this);
    this.state = {
      name: "",
      gender: "",
      dob: ""
    };
  }

  handlebtnClick(e) {
    const {socket} = this.props;
    socket.emit("newPlayerRequest", this.state);
  }

  render() {
    const { name, gender, dob } = this.state;
    return (
      <div className="player-registration container">
        <div className="form-row">
          <label className="form-column label">Name:</label>
          <div className="form-column input">
            <input
              type="text"
              onChange={({ target }) => this.setState({ name: target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <label className="form-column label">Gender:</label>
          <div className="form-column input">
            <label className="radio-btn">
              <input
                type="radio"
                name="gender"
                value="m"
                onChange={({ target }) =>
                  this.setState({ gender: target.value })
                }
              />{" "}
              Male
            </label>
            <label className="radio-btn">
              <input
                type="radio"
                name="gender"
                value="f"
                onChange={({ target }) =>
                  this.setState({ gender: target.value })
                }
              />{" "}
              Female
            </label>
          </div>
        </div>
        <div className="form-row">
          <label className="form-column label">Date of Birth:</label>
          <div className="form-column input">
            <input
              type="date"
              onChange={({ target }) => this.setState({ dob: target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <label className="form-column label" />
          <div className="form-column input">
            <button
              className="submit"
              onClick={this.handlebtnClick}
              disabled={!(name && gender && dob)}
            >
              Register & Start
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Registration;
