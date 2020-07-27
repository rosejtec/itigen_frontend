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
		  <Route exact path="/">
		  <Redirect to="/landing" /> 
        </Route>

		<Route exact path="/itigen_frontend">
		  <Redirect to="/landing" /> 
        </Route>
		
			<Navbar />
			<div className="container">
			<Route exact path="/landing" component={Landing} />

			  <Route exact path="/generator" component={Generator}/>
			  <Route exact path="/itinerary" component={Itinerary} />

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

