import React, { Component } from 'react';
import * as firebase from 'firebase'

import Sidebar from './Sidebar'
import MessageBoard from './MessageBoard'
import Header from './Header'

class Chat extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: [],
            chats: [],
            userId: props.userId,
            messages: {},
            unReadMessages: [],
        }

        this.loadUsers = this.loadUsers.bind(this)
        this.loadChats = this.loadChats.bind(this)
        this.chooseChat = this.chooseChat.bind(this)
        this.firebaseMessages = this.firebaseMessages.bind(this)
        this.deleteChat = this.deleteChat.bind(this)
    }


    chooseChat(friendId, title) {
        let chatFound = false
        for(let chat in this.state.chats) {
            if(this.state.chats[chat][`${this.state.userId}`] && this.state.chats[chat][`${friendId}`]) {
                chatFound = true
                firebase.database().ref('users/' + this.props.userId + '/unReadMessages/' + friendId).remove()
                firebase.database().ref('messages/' + chat).limitToLast(60).on('value', (snap) => this.firebaseMessages(snap, chat, title, friendId))
            }
        }

        if(!chatFound) {
            let chat = {
                [friendId]: true,
                [this.state.userId]: true
            }
            firebase.database().ref('members/').push(chat)
        }
    }

    firebaseMessages(snap, chat, title, friendId) {
        let messages = this.state.messages
        messages[chat] = {}
        messages[chat].conversation = []
        if(snap.val()) {
            for (let message in snap.val()) {
                if(snap.val().hasOwnProperty(message)) {
                    messages[chat].conversation.push(snap.val()[message])
                    messages[chat].title = title
                    messages[chat].friendId = friendId
                }
            }
        } else {
            messages[chat].title = title
            messages[chat].friendId = friendId
        }
        this.setState({messages: messages})
    }

    deleteChat(chat) {
        firebase.database().ref('messages/' + chat).off()
        let newState = Object.assign({}, this.state.messages)
        delete newState[chat]
        this.setState({messages: newState})
    }

    loadUsers(snap) {
        let users = []
        for(let key in snap.val()) {
            if(key !== this.props.userId) {
                let user = {
                    online: snap.val()[key].online ? true : false,
                    username: snap.val()[key].username,
                    unReadMessages: snap.val()[key].unReadMessages,
                    id: key,
                }
                users.push(user)
            }
        }
        this.setState({users: users})
    }

    loadChats(snap) {
        let chats = {}
        for(let key in snap.val()) {
            if(snap.val()[key][`${this.state.userId}`]) {
                chats[key] = snap.val()[key]
            }
        }
        this.setState({chats: chats})

    }

    componentDidMount() {

        let myConnectionsRef = firebase.database().ref('users/' + this.props.userId + '/online');
        let lastOnlineRef = firebase.database().ref('users/' + this.props.userId + '/lastOnline');

        let connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', function(snap) {
            if (snap.val() === true) {

                let con = myConnectionsRef.push(true);
                con.onDisconnect().remove();
                lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            }
        });


        firebase.database().ref('users/').on('value', this.loadUsers)
        firebase.database().ref('members/').on('value', this.loadChats)
        firebase.database().ref('users/' + this.props.userId).once('value', snap => {

            this.setState({userN: snap.val().username})
        })
        firebase.database().ref('users/' + this.props.userId + '/unReadMessages').on('value', snap => {
            let unReadMessages = []
            for(let key in snap.val()) {
                if(this.state.messages[snap.val()[key].chatKey]) {
                    firebase.database().ref('users/' + this.props.userId + '/unReadMessages/' + key).remove()
                } else {
                    unReadMessages.push(key)
                }
            }
            this.setState({unReadMessages: unReadMessages})
        })

    }



    render() {
        return (
            <div className="container">
                <Header logOut={this.props.logOut}/>
                <div className="containerChat">
                    <Sidebar messages={this.state.messages} users={this.state.users} chooseChat={this.chooseChat} chats={this.state.chats} userId={this.props.userId} unReadMessages={this.state.unReadMessages}/>
                    <MessageBoard messages={this.state.messages} userId={this.props.userId} userN={this.state.userN} deleteChat={this.deleteChat}/>
                </div>
            </div>
        );
    }
}

export default Chat;

