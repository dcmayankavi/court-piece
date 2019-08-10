import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import App from "./App";

const AppContext = React.createContext();
class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverData: null,
      socketId: null,
      socket: null
    };
  }

  componentDidMount() {
    const socket = socketIOClient("/");
    socket.on("FromAPI", data => {
      this.setState({ serverData: data, socketId: socket.id, socket: socket });
    });
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <App
          serverData={this.state.serverData}
          socketId={this.state.socketId}
          socket={this.state.socket}
        />
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
