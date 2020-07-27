import React, { Component } from 'react'
import PlacesAutocomplete, {
geocodeByAddress,
getLatLng } from 'react-places-autocomplete';
import { withStyles } from '@material-ui/core/styles';
    import {        
      Grid,
        Card,
        CardContent,
        Typography,
        CardHeader
    } from '@material-ui/core/'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { CardMedia } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Rating from '@material-ui/lab/Rating';
import { WaveTopBottomLoading } from 'react-loadingg';
import ParticlesBg from 'particles-bg';
import Typical from 'react-typical';
import Divider from '@material-ui/core/Divider';

    const useStyles = theme => ({
        root: {
            flexGrow: 1,
            padding: theme.spacing(2)
         },
        media: {
          height: 140,
        },
        bg: {
          height: '100vh',
        },
        root2: {
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 500,
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
        }
    })
    // const buttonStyles = makeStyles((theme) => ({ //ADDED
    //   button: {
    //     margin: theme.spacing(0),
    //   },
    // }));
const google = window.google = window.google ? window.google : {}


class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { address: '' ,coordsPair: [],formatted_address:[], store_result:[],pics:[], details:[], loading: false};
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.calculateDetails= this.calculateDetails.bind(this);
    
    this.baseState = this.state 

  }
 
  handleChange = address => {
    this.setState({ address });
  };
 
  handleSelect = async (address) => {
    let results = await geocodeByAddress(address);
    let latLng = await getLatLng(results[0]);
    this.state.coordsPair.push(latLng);
    let codeResults = await geocodeByAddress(address);
  
    console.log(this.state.coordsPair);
    const { coordsPair } = this.state;
    const { store_result } = this.state;
    const store_result_updated = [...store_result]; //<----here
  
    let map = new google.maps.Map(document.createElement("div"));
    this.googlePlaces = new google.maps.places.PlacesService(map);
  
    var request = {
      location: coordsPair[0],
      radius: "5000",
      type: ["restaurant", "point_of_interest"],
    };
  
    var  m = await this.getStuffAsync(request);
    console.log(m);

  
    this.setState({ store_result: m}, function () {
      //<----here
      console.log(this.state.store_result);
      console.log(this.state.store_result.length);


    });

    var p= await this.calculateDetails();
    console.log(this.state.details);
    this.setState({ state: this.state });

};

 getStuffAsync(request) {
  return new Promise((resolve, reject) => {
    this.googlePlaces.nearbySearch(request, (results, status)=> {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        const {store_result}= this.state;
        console.log(results.length);
        var store_result_updated=new Array (20)
        for (var i = 0; i < results.length; i++) {
          store_result_updated[i]= results[i].place_id;
          console.log(store_result_updated[i]);
          
        }
        }
        resolve(store_result_updated);
  });
 })
 }

 


calculateDetails= async()=>{
 
  console.log("details");

    const {store_result}= this.state; 
    const {details} = this.state;
    const {pics} = this.state;

  
    const details_updated = [...details]; //<----here
    const photos_updated = [...pics];
    let map = new google.maps.Map(document.createElement('div'));
    this.googlePlaces = new google.maps.places.PlacesService(map);
   /// console.log(this.state.store_result.length);
    //console.log(this.state.store_result);

    for(var i = 0; i < 20; i++) {
      this.setState({loading: true});
      var request2 = {
        placeId: store_result[i],
        fields: ['name', 'rating', 'formatted_phone_number', 'geometry','website','opening_hours','review','price_level', 'photos' ]
      };
      var m = await this.getStuffDetails(request2)
      // if(m!==undefined) {
      //   details.push(m)
      // }
      console.log(details)
      
    }
    this.setState({loading: false});

  }


getStuffDetails(request) {
  let map = new google.maps.Map(document.createElement('div'));
    this.googlePlaces = new google.maps.places.PlacesService(map);

  return new Promise((resolve, reject) => {
    this.googlePlaces.getDetails(request, (place, status)=> {
      if (status == google.maps.places.PlacesServiceStatus.OK && place.photos) {
        resolve(place)
        this.state.details.push(place)
      } else {
        resolve(undefined)
      }
    });
   })
 }


handleSubmit(event) {  
  this.setState(this.baseState)
}


  render() {
    const {details}= this.state;
    const { classes } = this.props;
    return (

    <div className="container">
    <div className="row">

    <div className ="col-md-12 mt-3 " style={{ color:"white", fontWeight:"bold", fontSize:20}} >

<Typical
    steps={['Hello welcome to itigen. You can start your travel search by entering any place you want below', 500]}
    wrapper="p"
    colour="white"
  />

 </div>
    <div className="col-md-6 mt-3 mx-auto">

    <div>
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
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
            {/* <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            /> */}
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
                  })} elevation={1} component="form" className={classes.root2} square="true" >
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
     
         {/* <Button variant="contained" color="primary" onClick={e => this.handleSubmit(e)}>
             New Place
          </Button> */}
          </div>

          <Divider variant="middle" />

 {this.state.loading? (<WaveTopBottomLoading />) : null}

<div className="col-md-12 mt-5 mx-auto">
<div className={classes.root}>
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {details.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={details.indexOf(elem)}>
                        <Card >
       <CardActionArea>
        <CardMedia
          className={classes.media}
          image = {elem.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 })}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {elem.name}
          </Typography>
          <Typography variant="h5" component="h2">
          <Rating name="half-rating-read" defaultValue={elem.rating} precision={0.1} size="small" readOnly />
          </Typography>
          <Typography variant="h5" component="h2">
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          Phone: {elem.formatted_phone_number}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" target="_blank" href={elem.website}>
          Learn More
        </Button>
      </CardActions>
    </Card>
                     </Grid>
                ))}
            </Grid>
        </div>


</div>
</div>
<ParticlesBg type="circle" bg={true} />

</div>

    

    );
  }
}


export default withStyles(useStyles)(Landing);