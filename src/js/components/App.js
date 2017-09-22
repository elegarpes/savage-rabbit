const API_KEY = '250219173677-h726op0dq4h2irkquch1pdu33ctd1b4j.apps.googleusercontent.com'

import React from "react";

export default class App extends React.Component {
  
  loadYoutubeApi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.setApiKey(API_KEY);
        gapi.client.load('youtube', 'v3', () => {
          this.setState({ gapiReady: true });
        });
      });
    };

    document.body.appendChild(script);
  }

  componentDidMount() {
    this.loadYoutubeApi();
  }

  render() {
    return (
      <h2>app</h2>
    );
    //if (this.state.gapiReady) {
    //  return (
    //    <h1>GAPI is loaded and ready to use.</h1>
    //  );
    };
  }

