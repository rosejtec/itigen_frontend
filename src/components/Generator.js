import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { getDistance } from 'geolib';
import { findNearest } from 'geolib';
import { getLatitude } from 'geolib';
import { useState, DatePicker } from 'react-datepicker';
import { gapi } from 'gapi-script';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Alert, AlertTitle } from '@material-ui/lab';
import Typical from 'react-typical';
const doc = new jsPDF()
const useStyles = theme => ({
  root: {
      flexGrow: 1,
      padding: theme.spacing(2)
   },
  media: {
    height: 140,
  },

  root2: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  title: {
    flex: '1 1 100%',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
 
})
const google = window.google = window.google ? window.google : {};
//var gapi = window.gapi;
var CLIENT_ID = "579604041414-l2b4jgn74hcol0ir8dbi4aq5entjdlev.apps.googleusercontent.com";
var API_KEY = "AIzaSyCUHroizUeI5ynDKqAM0gASmL3bum3tuSE";
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

class Generator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: "", value: "", coordsPair: [], final: [], formatted_address: [],
      final_address: [], flag: false, startTrip: "", timeSpent: [], place_ids: [], place_ids1: [],place_ids2: [], place_details: [], addTime: [],
      outTime: [], closeTimes: [], ranks: [], sdate: "", add: "", submit: false//ADDED
    };
    //this.Create2DArray(0,2)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleIn = this.handleIn.bind(this);
    this.handleFinalIn = this.handleFinalIn.bind(this);
    //this.handleFinalOut = this.handleFinalOut.bind(this);
    //this.handleOut = this.handleOut.bind(this);
    this.handleChangeIn = this.handleChangeIn.bind(this);
    this.handleFinalChangeIn = this.handleFinalChangeIn.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.Calculate = this.Calculate.bind(this);
    this.loadPDF = this.loadPDF.bind(this);
    this.calculateDetails = this.calculateDetails.bind(this); //ADDED
    this.sortRanks = this.sortRanks.bind(this); //ADDED
  }
 
 //current state of address object is changed
  handleChange = address => {

    this.setState({ address });
    geocodeByAddress(address)
      .then(results => console.log(results[0]));
  }

// Optimising itinerary based on distance
// Output : final and final_address
  Calculate = () => {
    const { coordsPair } = this.state;
    const { formatted_address } = this.state;
    const { place_ids1 } = this.state;
    var index = 0;
    var loopvar = coordsPair.length;
    console.log("Loop begins");
    console.log(place_ids1);
    for (var i = 0; i < loopvar; i++) {
      var test = coordsPair[index];
      var testadd = formatted_address[index];
      var testadd1 = place_ids1[index];

      coordsPair.splice(index, 1);
      formatted_address.splice(index, 1);
      place_ids1.splice(index, 1);

      var c = findNearest(test, coordsPair);
      this.state.final.push(test);
      this.state.final_address.push(testadd);
      this.state.place_ids2.push(testadd1);
      var index = coordsPair.indexOf(c);
      //console.log(index);
    }
    console.log("Loop Ends");
    // var topush = JSON.stringify(this.state.final); //ADDED
    // console.log(topush); //ADDED
    console.log(this.state.final);
    console.log(this.state.final_address);
    console.log(this.state.place_ids2);
    this.setState({ state: this.state });
  }
//Handles submission of places to go to
  handleSubmit(event) {
    this.setState({ submit: true});
    event.preventDefault();
    this.Calculate();
    this.calculateDetails();
  }
//stores values of latitude and longitude in coordsPair and formatted_address *NEED: place_ids
  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => this.state.formatted_address.push(results[0].formatted_address));



    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.state.coordsPair.push(latLng));
    console.log(this.state.formatted_address);
    console.log(this.state.coordsPair);

    geocodeByAddress(address)
    .then(results => this.state.place_ids.push(results[0].place_id));
    console.log(this.state.place_ids);

    geocodeByAddress(address)
    .then(results => this.state.place_ids1.push(results[0].place_id));
    console.log(this.state.place_ids1);
  
  }

// Handles values of time entered. Might NEED for hours.
  handleIn = (field, e) => {
    this.setState({ [field]: e.target.value });

  };
//All in times (not required for this section)
  handleFinalIn(event) {
    const a = this.state.timeSpent.push(parseInt(this.state.add));
    console.log(this.state.timeSpent);
    event.preventDefault();
  }

  //Pushes Events!!
 //ADDED
 handleClick() {

  gapi.load('client:auth2', () => {
    console.log('loaded client')

    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDOcs: DISCOVERY_DOCS,
      scope: SCOPES,
    })

    gapi.client.load('calendar', 'v3', () => console.log('yay!'))
    gapi.auth2.getAuthInstance().signIn().then(() => {

      const { place_details } = this.state
      var loopvar = place_details.length;
      var events = new Array(loopvar);
      var timestore = Date.parse(this.state.startTrip);
      console.log(this.state.startTrip);
      console.log("Loop begins");
      for (var i = 0; i < loopvar; i++) {
        //PROBLEMS
        console.log("In");
        var valin = new Date(timestore);
        console.log(valin)
        valin = valin.toISOString();
        //this.state.addTime.push(valin);
        var test = (this.state.timeSpent[i]*60*60*1000) + timestore;
        var valout = new Date(test);
        console.log(valout)
        valout = valout.toISOString();
        //this.state.outTime.push(valout);
        console.log(place_details[i]);
        
    
        console.log("Timestore");
        timestore = test;
        console.log(this.state.timeSpent[i]);
        console.log(timestore);
        var event = {
          'summary': this.state.place_details[i].name,
          'location': this.state.place_details[i].name,
          'description': 'Generated by Itigen',
          'start': {
            'dateTime': valin,
            'timeZone': 'Singapore'
          },
          'end': {
            'dateTime': valout,
            'timeZone': 'Singapore'
          },
          'reminders': {
            'useDefault': false,
            'overrides': [
              { 'method': 'email', 'minutes': 24 * 60 },
              { 'method': 'popup', 'minutes': 10 }
            ]
          }
        };
        events[i] = event;
      }
      console.log(events);
      console.log("Loop ends");
      const batch = gapi.client.newBatch();
      events.map((r, j) => {
        batch.add(gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': events[j]
        }))
      })

      batch.then(function () {
        console.log('all jobs now dynamically done!!!')
      });

      var e = events[0];
      batch.execute();

    })

  })
}
// Makes PDF
  loadPDF() {

    const { place_details } = this.state
    var loopvar = place_details.length;
    var timestore = Date.parse(this.state.startTrip);
    console.log("Loop begins");
    for (var i = 0; i < loopvar; i++) {
      //PROBLEMS
      console.log("In");
      var valin = new Date(timestore);
      console.log(valin)
      this.state.addTime.push(valin);
      var test = (this.state.timeSpent[i]*60*60*1000) + timestore;
      var valout = new Date(test);
      console.log(valout)
      this.state.outTime.push(valout);
      timestore = test;
    }

    var loopvar = this.state.place_details.length;
    console.log(loopvar);
    var event = [];

    for (var i = 0; i < loopvar; i++) {

      event.push([this.state.place_details[i].name, this.state.addTime[i], this.state.outTime[i]])
      console.log(event[i]);
    }

    console.log(event);

    doc.autoTable({
      head: [['Places (Optimal Order)', 'In Time ', 'Out Time']],
      body: event,
    })

    doc.save('table.pdf')
  }
//Changes the state of coordsPair and formatted_address
  handleRemove(i) {

    this.setState(state => ({
      coordsPair: state.coordsPair.filter((row, j) => j !== i)
    }));
    this.setState(state => ({
      formatted_address: state.formatted_address.filter((row, j) => j !== i)
    }));
  };
  //Take Start time: PROBLEM TAKES IN PREVIOUS DATE OBJECT
  handleChangeIn = (field, event) => {
    this.setState({[field]: event.target.value});
    console.log(this.state.startTrip);
    //event.preventDefault();
  }
  // Handles submitting of time
handleFinalChangeIn(event){
  this.setState({startTrip: this.state.startTrip});
  var ndate = new Date(this.state.startTrip);
  var i = ndate.getHours();
  var j = ndate.getMinutes();
  var sum = (i*100) + j;
  var p = parseInt(this.state.place_details[0].opening_hours.periods[0].open.time);//.opening_hours.periods[0].open
  console.log(p);
  console.log(sum);
  if( p> sum){
    console.log("error");
    this.setState({flag: true});
  }
  console.log(this.state.startTrip);
  event.preventDefault();
}
 
   //sort based on closing hours ?
   calculateDetails = async() =>{
    const {place_ids} = this.state;
    const {place_details} = this.state;
    const details_updated = [...place_details];
    for(var i=0; i<place_ids.length; i++){
      var request2 = {
        placeId: place_ids[i],
        fields: ['name','opening_hours', 'utc_offset_minutes']};
    var  m = await this.getDetailsAsync(request2);
    place_details.push(m);
    console.log(m);
    
    }
    const p =0;
    // var p = Date.parse(this.state.startTrip); //THIS NEEDS TO MOVE SOMEWHERE ELSE
    // console.log(p);
    console.log(place_details);
    var index = 0;
    var val="0000", val1=0;
    //Store closing hours in closeTimes[]
    for(let i =0; i< place_ids.length ; i++){
     // console.log(1);
      if(place_details[i]){
      console.log(place_details[i].opening_hours);
      val = place_details[i].opening_hours.periods[0].open.time;//replaced P, have to fix
      val1 = place_details[i].opening_hours.periods[0].open.day;
      if(val==="0000" && val1===0){this.state.closeTimes.push(2400); }
      else{
        this.state.closeTimes.push(parseInt(place_details[i].opening_hours.periods[0].close.time));
        //this.state.openTimes.push(parseInt(place_details[i].opening_hours.periods[0].open.time));
      }
      }
    }
     console.log(this.state.closeTimes);
     var closeCopy = this.state.closeTimes;
     //var openCopy = this.state.openTimes;
    var detailsCopy = this.state.place_details;
    var placedidsCopy = this.state.place_ids;
    //Sort based on closeTimes[]
    for (let i = 1; i < place_ids.length; i++) {
      // Choosing the first element in our unsorted subarray
      let current = closeCopy[i];
      let current1 = detailsCopy[i];
      let current2 = placedidsCopy[i];
      // The last element of our sorted subarray
      let j = i-1; 
      while ((j > -1) && (current < closeCopy[j])) {
          closeCopy[j+1] = closeCopy[j];
          detailsCopy[j+1] = detailsCopy[j];
          placedidsCopy[j+1] = placedidsCopy[j];
          j--;
      }
      closeCopy[j+1] = current;
      detailsCopy[j+1] = current1;
      placedidsCopy[j+1] = current2;
      console.log(detailsCopy);
  }

  console.log(closeCopy);
  console.log(detailsCopy);
  this.setState({closeTimes: closeCopy, place_details: detailsCopy, place_ids: placedidsCopy}); // this is going to screw us
  console.log(this.state.place_details);
  console.log(this.state.closeTimes);
  console.log(this.state.place_ids);
  this.sortRanks();//ADDED
}
getDetailsAsync(request) {
  let map = new google.maps.Map(document.createElement("div"));
    //this.googlePlaces = new google.maps.places.PlacesService(map);
    const service = new google.maps.places.PlacesService(map);
  return new Promise((resolve, reject) => {
    service.getDetails(request, callback2);

      function callback2(place, status) {
        if(status !== google.maps.places.PlacesServiceStatus.OK) return;
        if(place.opening_hours && place.utc_offset_minutes){
          console.log(`${place.opening_hours.weekday_text[0]}`);
          resolve(place);
        }
        else resolve(0);
      }
      }
  )}
  sortRanks(){
    const {place_ids}= this.state;
    const {place_ids2}= this.state;
    console.log("Sorting Ranks")
    console.log(this.state.final_address);
    console.log(this.state.place_details);
    console.log(this.state.place_ids);
    console.log(this.state.place_ids2);
    for(let i =0; i<place_ids.length; i++){
      let current = place_ids[i];
      let varindex = place_ids2.indexOf(place_ids[i]);
      this.state.ranks.push(varindex*i);
      console.log(this.state.ranks);
    }

    //Sort based on ranks[]
    var detailsCopy = this.state.place_details;
    var placedidsCopy = this.state.place_ids;
    var ranksCopy = this.state.ranks;
    for (let i = 1; i < this.state.ranks.length; i++) {
      // Choosing the first element in our unsorted subarray
      let current = detailsCopy[i];
      let current1 = placedidsCopy[i];
      let current2 = ranksCopy[i];
      // The last element of our sorted subarray
      let j = i-1; 
      while ((j > -1) && (current2 < ranksCopy[j])) {
          ranksCopy[j+1] = ranksCopy[j];
          detailsCopy[j+1] = detailsCopy[j];
          placedidsCopy[j+1] = placedidsCopy[j];
          j--;
      }
      ranksCopy[j+1] = current2;
      detailsCopy[j+1] = current;
      placedidsCopy[j+1] = current1;
  }
  this.setState({ranks: ranksCopy, place_details: detailsCopy, place_ids: placedidsCopy});
  console.log("Sorted");
  console.log(this.state.ranks);
  console.log(this.state.place_details);
  }
  getError = () => {
    return (
      <div className="col-md-10 mt-3 mx-auto">
   <Typography variant="h5" gutterBottom>
    <Alert severity="error">
    <AlertTitle>Error</AlertTitle>
    <strong>${this.state.place_details[0].name} is not open at this time!</strong>
  </Alert>
  </Typography>
   </div>
    );
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
      <div className="container">
        <div className="row">
          <div className="col-md-10 mt-5 mx-auto">
            <div className ="col-md-6 mx-auto p-3" style={{ color:"white", fontWeight:"bold", fontSize:20}} >
            <Typical
        steps={['Generate your itinerary here!', 1000]}
        loop={Infinity}
        wrapper="p"
        colour="white"
      />
       </div>
      <div className="col-md-6 mx-auto p-3">
            
            <PlacesAutocomplete
              value={this.state.address}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            >

              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
<Paper component="form" className={classes.root2}>
      <InputBase
        className={classes.input}
        {...getInputProps({
          placeholder: "Search Google Maps",
        })}
        inputProps={{ 'aria-label': 'search google maps' }}
      
      />
      <IconButton type="submit" disabled className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <Paper {...getSuggestionItemProps(suggestion, {
                    className,
                    style
                  })}  component="form" className={classes.root2} square="true" >
                    <span style={{ fontWeight: suggestion.highlight ? 700 : 400 }}>
                    <strong>
                {suggestion.formattedSuggestion.mainText} 
               </strong>{' '}
                <small>
               {suggestion.formattedSuggestion.secondaryText}
                </small>
                      </span>
                  </Paper>
                );
              })}
            </div>
          </div>
        )}
            </PlacesAutocomplete>
            <Button variant="contained" color="primary" style={{backgroundColor:"purple"}} onClick={e => this.handleSubmit(e)}>
             Submit
            </Button>

            </div>
           {/*here*/}
            <div class="col-md-10 mt-5 ml-5 mx-auto">
        <TableContainer component={Paper}>
              <Table style={{borderTop: '3px solid purple'}}stickyHeader aria-label="sticky table">
                <TableBody>
                  {this.state.formatted_address.map((x, i, handleRemove) =>
                    <TableRow key={`tr-${i}`}>
                      <TableCell component="th" scope="row"> {x}  </TableCell>
                      <TableCell>
                        <DeleteIcon onClick={() => this.handleRemove(i)} />
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </TableContainer>
        </div>
            <div className="col-md-10 mt-5 mx-auto">
              {!this.state.submit? null:
              <div>
                 <table className="col-md-6 mx-auto p-3"> {/*float-right mt-3*/}
              <thead>
                <tr>
                  <th>Start Date</th>
                </tr>
              </thead>
                  <tr>
                    <th>
                      <form>
                    <TextField
                        id="datetime-local"
                        type="datetime-local"
                        value={this.state.out}
                        defaultValue=""
                        onChange={e => this.handleChangeIn('startTrip', e)}
                        className={classes.textField}
                        InputLabelProps={{
                              shrink: true,
                        }}
                    />
              <IconButton onClick={this.handleFinalChangeIn}>
              <CheckCircleIcon/>
               </IconButton>
                    </form>
                    </th>
                  </tr>
            </table>
            <TableContainer component={Paper}style={{borderTop: '3px solid black', borderBottom: '3px solid black',
      borderRight: '3px solid black', borderLeft: '3px solid black'}}>
              <Table className={classes.table} aria-label="caption table">
                <caption>Places optimised according to opening_hours and distances.</caption>
                <TableHead>
                  <TableRow>
                  <TableCell align="left">Places (Optimal Order)</TableCell>
                  <TableCell align= "right">Time to be Spent (hrs)</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {this.state.place_details.map((item)=>(
                <TableRow key={this.state.place_details.indexOf(item)}>
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell align="right">
                    <form>
                        <input type= "number" step = "1" min="0" value={this.state.add} onChange={e => this.handleIn('add', e)} />
                        </form>
                  </TableCell>
                <TableCell>
                        <form className={classes.container} noValidate>
                          <IconButton onClick={this.handleFinalIn}>
                            <CheckCircleIcon/>
                          </IconButton>
                        </form>
                </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
            {this.state.flag?     
             this.getError() : null}
            <Button variant="contained" color="primary"  onClick={this.loadPDF}>Download PDF</Button>
            <Button variant="contained" color="primary" onClick={this.handleClick}>Add to GCalendar 📅</Button>
            </div>
                }
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
export default withStyles(useStyles)(Generator);