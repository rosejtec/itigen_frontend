import React, { Component }  from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { getDistance }from 'geolib';
import {findNearest} from 'geolib';
import {getLatitude} from 'geolib';
import {useState, DatePicker} from 'react-datepicker';
import { gapi } from 'gapi-script';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
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
import night from "./Midnight.jpg";
import Grid from '@material-ui/core/Grid';


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
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
 
})
//var gapi = window.gapi;
var CLIENT_ID = "579604041414-l2b4jgn74hcol0ir8dbi4aq5entjdlev.apps.googleusercontent.com";
var API_KEY = "AIzaSyCUHroizUeI5ynDKqAM0gASmL3bum3tuSE";
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

class Itinerary extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      address:"", value: "" , coordsPair: [] , final : [], addTime:[], outTime:[], add: "", out:"", formatted_address:[],
      final_address:[], flag: false, sumbit:false
    };
    //this.Create2DArray(0,2)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleIn = this.handleIn.bind(this);
    this.handleFinal = this.handleFinal.bind(this);
    this.handleOut = this.handleOut.bind(this);
    this.handleClick= this.handleClick.bind(this);
    this.handleRemove= this.handleRemove.bind(this);
    this.Calculate=this.Calculate.bind(this);
    this.loadPDF= this.loadPDF.bind(this);
  }
 

 handleChange = address => {
  
  this.setState({ address });
  
}


Calculate = () => {
  const {coordsPair} = this.state;
  const {formatted_address} = this.state;

  var index =0;
  var loopvar = coordsPair.length;
  console.log("Loop begins");
  for(var i = 0; i<loopvar; i++ ) {
    var test = coordsPair[index];
    var testadd =formatted_address[index];

    coordsPair.splice(index, 1);
    formatted_address.splice(index, 1);

    var c = findNearest(test,coordsPair);
    this.state.final.push(test);
    this.state.final_address.push(testadd);
    var index = coordsPair.indexOf(c);
    //console.log(index);
  }
  console.log("Loop Ends");
  var topush = JSON.stringify(this.state.final); //ADDED
  console.log(topush); //ADDED
  // const user = {
  //   prev_itinerary: topush
  // }
  // //push_itin(user);
  // push_itin(user).then(res => {
  //   if (res) {
  //     this.props.history.push(`/itinerary`)
  //   } 
  // })
  console.log(this.state.final);
  console.log(this.state.final_address);

   //this.setState({ state: this.state });
}

handleSubmit(event) {
  this.setState({ submit: true });

  event.preventDefault();
  this.Calculate();
  }

handleSelect = async(address) => {

  const{formatted_address}= this.state;
  
    geocodeByAddress(address)
    .then(results => formatted_address.push(results[0].formatted_address),  this.setState({formatted_address: formatted_address}));
    
    geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .then(latLng =>   this.state.coordsPair.push(latLng));
    geocodeByAddress(address)
    .then(results => console.log(results))

    console.log(formatted_address);
    console.log(this.state.coordsPair);

 }
 

 handleIn = (field, e) => {
  this.setState({ [field]: e.target.value });
  
};



handleOut = (field, e) => {
  this.setState({ [field]: e.target.value });  
};


handleFinal (event) {
  this.state.addTime.push(this.state.add); 
  console.log(this.state.addTime);
  this.state.outTime.push(this.state.out); 
  console.log(this.state.outTime);
  event.preventDefault();

  this.setState({add: ""})
  this.setState({out: ""})
  
}

//ADDED
handleClick(){

  gapi.load('client:auth2', ()=> {
    console.log('loaded client')

    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDOcs: DISCOVERY_DOCS,
      scope: SCOPES,
  })

  gapi.client.load('calendar', 'v3', () => console.log('yay!'))
  gapi.auth2.getAuthInstance().signIn().then(()=>{

const {final_address} = this.state
var loopvar = this.state.final.length;

var events= new Array(loopvar);

console.log("Loop begins");
for(var i = 0; i<loopvar; i++ ) {
 
  console.log("In");
  var valin = new Date(this.state.addTime[i]);
  valin = valin.toISOString();
  var valout = new Date(this.state.outTime[i]);
  valout = valout.toISOString();
  console.log(final_address[i]);
  console.log(valin)
  console.log(valout)
  
  var event = {
    'summary': this.state.final_address[i],
    'location':  this.state.final[i],
    'description': '',
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
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
      ]
    }      
  };

      events[i] = event;
}

var check=false;
//Have a check for overlap in timings
console.log("checking timings"); 
for(var i = 0; i<events.length ; i++){
  var intime = Date.parse(events[i].start.dateTime);
  var outtime= Date.parse(events[i].end.dateTime);
  var lasttime="";
  if(i!=0){lasttime = Date.parse(events[i-1].end.dateTime)}
  console.log(intime);
  console.log(outtime);
  console.log(intime-outtime);
  if(intime-outtime > 0){
    console.log("error");
    check = true;
    this.setState({flag: true});
  }
  else if(i!=0){
    if(lasttime-intime > 0){
      check= true;
      console.log("error");
      this.setState({flag: true});
    }
  } 
}


if(check===false) {
    console.log(events);
    console.log("Loop ends");
    const batch = gapi.client.newBatch();
    events.map((r, j) => {
    batch.add(gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': events[j]
    }))

  
  batch.then(function(){
  console.log('all jobs now dynamically done!!!')
  });

  var e=events[0];
  batch.execute();
})
}
  


})

})
}


loadPDF(){

  var loopvar = this.state.final_address.length;
  console.log(loopvar);
  var event= [];

  for (var i=0; i<loopvar;i++) {

    event.push([this.state.final_address[i],this.state.addTime[i],this.state.outTime[i]])
    console.log(event[i]);
  }



  for(var i = 0; i< event.length ; i++){
    var intime = Date.parse(event[i][1]);
    var outtime= Date.parse(event[i][2]);
    var lasttime="";
    var check=false;  
    if(i!=0){lasttime = Date.parse(event[i-1][2])}
    console.log(intime);
    console.log(outtime);
    console.log(intime-outtime);
    
    if(intime-outtime > 0){
      console.log("error");
      check=true;
      this.setState({flag: true});
    }
    else if(i!=0){
      if(lasttime-intime > 0){
        check= true;
        console.log("error");
        this.setState({flag: true});
      }
    } 
  }

  if (check === false){
    console.log(event);
  
    doc.autoTable({
      head: [['Places (Optimal Order)', 'In Time	', 'Out Time']],
      body: event,
    })
    
    doc.save('table.pdf')
  }
  
}

handleRemove(i) {

  this.setState(state => ({
    coordsPair: state.coordsPair.filter((row, j) => j !== i)
  }));
  this.setState(state => ({
    formatted_address: state.formatted_address.filter((row, j) => j !== i)
  }));
};

getError = () => {
  return (
    <div className="col-md-10 mt-3 mx-auto">
 <Typography variant="h5" gutterBottom>
  <Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  <strong>Overlapping Time!</strong>
</Alert>
</Typography>
 </div>
  );
};


render() {

  const { classes } = this.props;

  const{final_address}= this.state;

  const{formatted_address}= this.state;
console.log(formatted_address)
  return (
    <div>
      
    <div className="container">

    <div className="row">


    <div className="col-md-10 mt-5 ml-5 mx-auto">
    < div className="float-right mt-3">
    <Button variant="contained" color="primary" style={{ backgroundColor:"#370484" }} onClick={e => this.handleSubmit(e)}>
             Submit
          </Button>
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
</div>

</div>


<div  class="col-md-10 mt-5 ml-5 mx-auto" >

<TableContainer component={Paper}>
<Table  style={{borderTop: '4px solid #370484'}} stickyHeader  aria-label="sticky table">
<TableBody>
{formatted_address.map((x, i,  handleRemove) =>  
<TableRow key={x.id}>
<TableCell component="th" scope="row"> {x}  </TableCell> 
<div className="float-right">
  <TableCell>
  <DeleteIcon onClick={() => this.handleRemove(i)} />
</TableCell>   
</div>
</TableRow>)}
</TableBody>
</Table>
</TableContainer> 

</div>
    
 
<div className="col-md-10 mt-5 mx-auto">

  {!this.state.submit? null :
  <div>
      <TableContainer component={Paper}  
      style={{borderTop: '3px solid black', borderBottom: '3px solid black',
      borderRight: '3px solid black', borderLeft: '3px solid black'}}>
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell>Places (Optimal Order)</TableCell>
            <TableCell align="left">In Time</TableCell>
            <TableCell align="left">Out Time</TableCell>
            <TableCell align="left">Confirm</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {final_address.map((item) => (
            <TableRow key={final_address.indexOf(item)}>
              <TableCell component="th" scope="row">
                {item}
              </TableCell>
              <TableCell align="right"> 
              <form className={classes.container} noValidate>
  <TextField
    id="datetime-local"
    label="Next appointment"
    type="datetime-local"
    value={this.state.add}
    defaultValue=""
    onChange={e => this.handleIn('add', e)} 
    className={classes.textField}
    InputLabelProps={{
      shrink: true,
    }}
  />
</form>
                        
              </TableCell>
              <TableCell align="right">
              <form className={classes.container} noValidate>
  <TextField
    id="datetime-local"
    label="Next appointment"
    type="datetime-local"
    value={this.state.out}
    defaultValue=""
    onChange={e => this.handleOut('out', e)}
    className={classes.textField}
    InputLabelProps={{
      shrink: true,
    }}
  />
</form>
              </TableCell>
              <TableCell align="right">
              <form className={classes.container} noValidate>
              <IconButton onClick={this.handleFinal}>
              <CheckCircleIcon/>
               </IconButton>
               
            </form>
              </TableCell>
            </TableRow>
           ) )}
        </TableBody>
      </Table>
    </TableContainer>

  
    {this.state.flag?     
             this.getError() : null}
    
      <Button variant="contained"  color="primary" onClick={this.loadPDF}>
        Download PDF
        </Button>
        <Button variant="contained"  color="primary" onClick={this.handleClick}>
        Add to Calender
        </Button>
        </div>
    }
    </div>
  </div>
  </div>
  </div>
  );}
}

export default withStyles(useStyles)(Itinerary);