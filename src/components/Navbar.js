import React, { Component } from 'react'
import { withRouter,Redirect } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Logo from "./circle-cropped.png";
import Tab from '@material-ui/core/Tab';

const useStyles = (theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  img: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
 
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    //alignItems: 'center',
    flexGrow: 1,
    backgroundColor: "#cccccc" 

  },
  toolbar: {
    flexWrap: 'wrap',
    flexGrow: 1,

  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
});


class Landing extends Component {


  render() {

    const {classes} = this.props;


    return (
      <React.Fragment>
      <AppBar position="static" color="inherit" elevation={3} className={classes.appBar}>
     
      <Toolbar className={classes.toolbar}>

      <div className={classes.img}>
      <Avatar alt="Remy Sharp" src={Logo}/>
      </div>      
        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              itigen
          </Typography>


          <Link variant="button" color="textPrimary" href="/landing" className={classes.link}>
                Home
          </Link>
          <Link variant="button" color="textPrimary" href="/generator" className={classes.link}>
            Generator
          </Link>
          <Link variant="button" color="textPrimary" href="/itinerary" className={classes.link}>
            Itinerary
          </Link>

        </Toolbar>
      </AppBar>
          </React.Fragment>

    )
  }
}

export default withStyles(useStyles)(withRouter(Landing));