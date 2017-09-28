
import React from "react";
import request from "superagent";
import DatePicker from "react-datepicker";
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    var s = moment().set({'hour': 9, 'minute': 0}); 
    var e = moment().set({'hour': 18, 'minute': 0});
    var d = moment().set({'hour': 1, 'minute': 0}); 

    this.state = { signedIn: false, start: s, end: e, startDate: moment(), people:['evulpe@thoughtworks.com', 'ssimon@thoughtworks.com'], slotDuration: d}
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
        }    
  }


    processRequest(err, res) {
        var events = res.body.items;
        var availableSlotStart = this.state.start;
        console.log(events);

       if(res.status == 200){
          for(var i = 0; i <  events.length; i++){
            var eventTime = new Date(events[i].start.dateTime);

           if( moment(availableSlotStart).isBefore(eventTime)){
              console.log(moment(availableSlotStart).toDate() + ' ' + eventTime);
            }
            availableSlotStart = new Date(events[i].end.dateTime);

           if(  i == ( events.length - 1 ) && (moment(availableSlotStart).isBefore(this.state.end))) {
              console.log(availableSlotStart + ' ' + this.state.end);
            }
          }
        }
      };

  handleChange(date) {
    this.setState({
      startDate: date
    });
      
    this.state.start.set({'date': date.get('date'), 'month': date.get('month'), 'year': date.get('year')});
    this.state.end.set({'date': date.get('date'), 'month': date.get('month'), 'year': date.get('year')});

  }
    
 handleTimeChange(time) {
    var hour = Math.floor(time/3600);
    var minutes = (time - hour*3600) / 60;
    console.log("start time");
    console.log(hour);  
    console.log(minutes);
    this.setState({ time });
    this.state.start.set({'hour': hour, 'minute': minutes})
  }


  handleDurationChange(duration) {
    var hour = Math.floor(duration/3600);
    var minutes = (duration - hour*3600) / 60;
    console.log("duration");
    console.log(hour);  
    console.log(minutes);
    this.setState({ duration });
    this.state.slotDuration.set({'hour': hour, 'minute': minutes})
  }
    
  render() {
    if (this.state.signedIn) {
      return (
        <div>
        <button onClick={this.onSignOutClick.bind(this)} >Sign out</button>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange.bind(this)}
        />
        <label>Start</label>
        <TimePicker format={24} start="09:00" end="18:00" step={15} onChange={this.handleTimeChange.bind(this)} value={this.state.time} />
        <label>Diration</label>
        <TimePicker format={24} start="00:00" end="02:00" step={15} onChange={this.handleDurationChange.bind(this)} value={this.state.duration} />
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