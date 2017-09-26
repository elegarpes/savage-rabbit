import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loggedin: false }
  }

  onSignInClick() {
    chrome.identity.getAuthToken({ interactive: true}, this.onSignInCallback.bind(this));
  }

  onSignInCallback(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    } 
    this.setState({ loggedin: true })
  }

  render() {
    console.log('render');
    if (this.state.loggedin) {
      return (
        <span>Logged in!</span>
      );
    } else {
      return (
        <button onClick={this.onSignInClick.bind(this)} >Sign in with Google</button>
      );
    }
  }
}



        //var x = new XMLHttpRequest();
        //x.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
        //x.onload = function() {
        //    alert(x.response);
        //};
    //x.send();
