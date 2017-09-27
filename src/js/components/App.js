
import React from "react";
import request from "superagent";
import DatePicker from "react-datepicker";
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    var s = new Date(); // TODO parse date from UI
    s.setHours(9,0,0,0);// starting time is 9am

    var e = new Date(s);
    e.setHours(18,0,0,0);// end time is 6pm

    this.state = { signedIn: false, start: s, end: e}
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
    var calendarId = 'ssimon@thoughtworks.com';
    var url = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events';

    var startTime = this.state.start.toISOString();
    var endTime = this.state.end.toISOString();

    request
    .get(url)
    .set('Authorization', 'Bearer ' + token)
    .query({ singleEvents: 'true'})
    .query({ orderBy: 'startTime'})
    .query({ timeMin: startTime})
    .query({ timeMax: endTime})
    .end(this.processRequest.bind(this))
  };

  processRequest(err, res) {
    var events = res.body.items;
    var cursor = this.state.start;

    if(res.status == 200){
      for(var i = 0; i <  events.length; i++){
        var eventTime = new Date(events[i].start.dateTime);

        if( (eventTime - cursor) > 0){
          console.log(cursor + ' ' + eventTime);
        } 
        cursor = new Date(events[i].end.dateTime);

        if( i == ( events.length - 1 )) {
          console.log(cursor + ' ' + this.state.end);
        }
      }
    }
  }

  handleChange(date) {
    this.setState({
      start: date
    });
  }

  render() {
    if (this.state.signedIn) {
      return (
        <div>
        <button onClick={this.onSignOutClick.bind(this)} >Sign out</button>
        <div> <DatePicker selected={moment()} onChange={this.handleChange}/> </div>
        </div>
        );
    } else {
      return (
        <button onClick={this.onSignInClick.bind(this)} >Sign in with Google</button>
        );
    }
  }

  // <DatePicker selected={this.state.start} onChange={this.handleChange}/>
}