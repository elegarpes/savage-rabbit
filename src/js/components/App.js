
import React from "react";
import request from "superagent";
import DatePicker from "react-datepicker";
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    var s = moment().set({'hour': 9, 'minute': 0, 'second': 0}); 
    var e = moment().set({'hour': 18, 'minute': 0, 'second': 0});
    var d = moment().set({'hour': 1, 'minute': 0, 'second': 0}); 

    this.state = { signedIn: false, 
      startDay: s, 
      endDay: e, 
      startDate: moment(), 
      people:['evulpe@thoughtworks.com', 'ssimon@thoughtworks.com'], 
      slotDuration: d}
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
    this.setState({ signedIn: true, token: token });
  }

  onSignOutCallback(token){
    this.setState({ signedIn: false })
  } 

  showAvailability(){
    var calendarId;
    var token = this.state.token; 
    for (var i = 0; i < this.state.people.length; i++){
      calendarId = this.state.people[i];
      console.log(calendarId);
      var url = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events';

      var startTime = this.state.startDay.toISOString();
      var endTime = this.state.endDay.toISOString();

      request
      .get(url)
      .set('Authorization', 'Bearer ' + token)
      .query({ singleEvents: 'true'})
      .query({ orderBy: 'startTime'})
      .query({ timeMin: startTime})
      .query({ timeMax: endTime})
      .end(this.processRequest.bind(this))
    }    
  }


  processRequest(err, res) {
    var events = res.body.items;
    var availableSlotStart = new Date(this.state.startDay);

    console.log(events);

    if(res.status == 200){
      for(var i = 0; i <  events.length; i++){
        var eventTime = new Date(events[i].start.dateTime);

        if( this.isAvailableSlot(availableSlotStart, eventTime) ){
          console.log(moment(availableSlotStart).toDate() + ' - ' + eventTime);
        }
        availableSlotStart = new Date(events[i].end.dateTime);

        if( i == (events.length - 1) && this.isAvailableSlot(availableSlotStart, this.state.endDay)) {
          console.log(availableSlotStart + ' - ' + moment(this.state.endDay).toDate());
        }
      }
    }
  };

  isAvailableSlot(slotStart, nextEventStart){
    var availableSlotDuration = nextEventStart - slotStart;
    var interviewDuration = moment.duration(this.state.duration,'seconds');
    var miliSecondsMargin = 1000;

    return ( moment(slotStart).isBefore(nextEventStart) && (availableSlotDuration + miliSecondsMargin >= interviewDuration) );
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });

    this.state.startDay.set({'date': date.get('date'), 'month': date.get('month'), 'year': date.get('year')});
    this.state.endDay.set({'date': date.get('date'), 'month': date.get('month'), 'year': date.get('year')});

  };

  handleTimeChange(time) {
    var hour = Math.floor(time/3600);
    var minutes = (time - hour*3600) / 60;
    this.setState({ time });
    this.state.startDay.set({'hour': hour, 'minute': minutes, 'second': 0})
  }


  handleDurationChange(duration) {
    // var converter = new Converter(duration);
    var hour = Math.floor(duration/3600);
    var minutes = (duration - hour*3600) / 60;

    this.setState({ duration });
    this.state.slotDuration.set({'hour': hour, 'minute': minutes, 'second': 0})
  }

  render() {
    if (this.state.signedIn) {
      return (
        <div>
        <button onClick={this.onSignOutClick.bind(this)} >Sign out</button>
        <br/>
        <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange.bind(this)}
        />
        <br/>
        <label>Start</label>
        <TimePicker format={24} start="09:00" end="18:00" step={30} onChange={this.handleTimeChange.bind(this)} value={this.state.time} />
        <label>Duration</label>
        <TimePicker format={24} start="00:15" end="02:00" step={15} onChange={this.handleDurationChange.bind(this)} value={this.state.duration} />
        <br/>
        <button onClick={this.showAvailability.bind(this)} >Show</button>

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