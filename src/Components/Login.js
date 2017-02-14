import React, { Component } from 'react';
import * as firebase from 'firebase'



class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            message: '',
            success: false,
            signUp: false,
            email: "",
            password: "",
            username: "",
        }

    }

    logIn() {
        const auth = firebase.auth()


        const promise = auth.signInWithEmailAndPassword(this.state.email, this.state.password)
        promise.catch(e => this.setState({message: e.message}))
    }

    signUp() {
        const auth = firebase.auth()
        const usersUsernames = []
        firebase.database().ref('users/').once('value', snap => {
            for(let key in snap.val()) {
                if(snap.val().hasOwnProperty(key)) {
                    usersUsernames.push(snap.val()[key].username)
                }
            }

            if(usersUsernames.indexOf(this.state.username) === -1) {

                auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then(e => {
                        this.setState({message: "You are successfully logged in!", success: true})
                        firebase.database().ref('/users/' + e.uid).set({username: this.state.username})
                    })
                    .catch(e => {
                        this.setState({message: e.message})
                    })
            } else {
                this.setState({message: "There is already someone with that username"})
            }

        })
    }

    createAcc() {
        this.setState({mail: "", password: "", message: "", signUp: true})
    }


    componentDidMount() {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser) {
            } else {
            }
        })
    }


    render() {
        const success = this.state.success
        const message = this.state.message
        return (
            <div>
                <div className="login">
                    <input
                        value={this.state.email}
                        onChange={(e) => this.setState({email: e.target.value})}
                        type="text"
                        placeholder="Email"
                    />
                    <input
                        value={this.state.password}
                        onChange={(e) => this.setState({password: e.target.value})}
                        type="password"
                        placeholder="password"
                    />
                    {this.state.signUp ?
                        <div>
                        <input
                            value={this.state.username}
                            onChange={(e) => this.setState({username: e.target.value})}
                            type="text"
                            placeholder="username"
                        />
                        <div className="loginActionButtons">
                            <button  onClick={() => this.signUp()}>Sign Up</button>
                            <button  onClick={() => this.setState({signUp: false})}>Back</button>
                        </div>
                        </div>
                            :
                        <div className="loginActionButtons">
                            <button onClick={() => this.logIn()}>Log In</button>
                            <button onClick={() => this.createAcc()}>Sign Up</button>
                        </div>
                    }
                    <p className="login-message" style={{ color: success ? "green" : "red" }}>{message}</p>
                </div>
            </div>
        );
    }
}

export default Login;

