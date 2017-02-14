import React, { Component } from 'react';
import * as firebase from 'firebase'

import Login from './Login'
import Chat from './Chat'

class Main extends Component {
    constructor() {
        super()

        this.state = {
            firebaseUser: null,
            resolved: false,
        }

        this.logOut = this.logOut.bind(this)
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser) {
                this.setState({firebaseUser: firebaseUser, resolved: true})
            } else {
                this.setState({firebaseUser: null, resolved: true})
            }
        })
    }

    logOut() {
        firebase.auth().signOut()
    }

    render() {
        return (
            <div>
                {this.state.resolved ? (this.state.firebaseUser ? <Chat logOut={this.logOut} userId={this.state.firebaseUser.uid} /> : <Login/>) : null}
            </div>
        );
    }
}

export default Main;

