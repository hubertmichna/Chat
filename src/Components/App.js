import React, { Component } from 'react';
import '../Styles/Components/App.css';
import * as firebase from 'firebase'

import Main from './Main'


let config = {
  apiKey: "AIzaSyDqtyzUJCD_NtRSZXa9vmJhedB_LY4lSv8",
  authDomain: "chat-3f768.firebaseapp.com",
  databaseURL: "https://chat-3f768.firebaseio.com",
  storageBucket: "chat-3f768.appspot.com",
  messagingSenderId: "988071252344"
};
firebase.initializeApp(config);

class App extends Component {
  render() {
    return (
          <Main />
    );
  }
}

export default App;
