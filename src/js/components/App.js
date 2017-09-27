import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { signedIn: false }
  }

  onSignInClick() {
    chrome.identity.getAuthToken({ interactive: true }, this.onSignInCallback.bind(this));
  }

  onSignOutClick() {
    // not working
    // chrome.identity.launchWebAuthFlow({ url: 'https://accounts.google.com/logout' }, this.onSignOutCallback.bind(this));
    this.onSignOutCallback();
  }

  onSignInCallback(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    } 
    this.setState({ signedIn: true, token: token })

    this.calendarExampleRequest(token)
  }

  onSignOutCallback(token){
    this.setState({ signedIn: false })
  } 

  calendarExampleRequest(token) {
    var xhr = new XMLHttpRequest();
    var url = 'https://content.googleapis.com/calendar/v3/users/me/calendarList';
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization','Bearer ' + token);
    xhr.send();
     
    xhr.onreadystatechange = this.processRequest.bind(this);
  }

  processRequest(e) {
    if (e.currentTarget.readyState == 4 && e.currentTarget.status == 200) {
        var response = JSON.parse(e.currentTarget.responseText);
        console.log(response)
    }
  }

  render() {
    if (this.state.signedIn) {
      return (
        <button onClick={this.onSignOutClick.bind(this)} >Sign out</button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick.bind(this)} >Sign in with Google</button>
      );
    }
  }
}