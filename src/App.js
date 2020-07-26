import React, { Component } from 'react'
import { BrowserRouter as Router, Route,  Redirect
} from 'react-router-dom'


import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Itinerary from './components/Itinerary'
import Generator from './components/Generator'
import ParticlesBg from 'particles-bg';


class App extends Component {
	render() {
	  return (
			<Router>
			
		  <div className="Apps">

		 
		 
		  <header className="App-header">
		  
			<Navbar />

			<div className="container">
			  <Route exact path="process.env.PUBLIC_URL + /generator" component={Generator}/>
			  <Route exact path="process.env.PUBLIC_URL + /itinerary" component={Itinerary} />
	          <Route exact path="process.env.PUBLIC_URL + /landing" component={Landing} />

			  <div className="App">
		  <ParticlesBg type="circle" bg={true} />
          </div>
			</div>
			</header>

		  </div>


		</Router>
	
	  )
	}
  }


export default App;

