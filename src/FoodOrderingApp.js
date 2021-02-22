import React, {Component} from 'react'

//Router import for redirection.
import {Route, Switch} from "react-router-dom";

//Imports of different pages in the application
import Home from './screens/home/Home';
import Profile from './screens/profile/Profile';
import Details from './screens/details/Details';

/**
 * Food Ordering Application controller
 */
class FoodOrderingApp extends Component {
    constructor() {
        super();
        this.baseUrl = 'http://localhost:8080/api/'
    }

    render() {
        return (
            //Routing accomplishment
            <Switch>
                <Route exact path='/' render={(props) => <Home {...props} baseUrl={this.baseUrl}/>}/>
                <Route exact path='/profile' render={(props) => <Profile {...props} />}/>
                <Route exact path="/restaurant/:id" render={(props) => <Details {...props} baseUrl={this.baseUrl} />}/>
            </Switch>
        )
    }
}

export default FoodOrderingApp;