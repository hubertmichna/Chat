import React, { Component } from 'react'

import '../Styles/Components/Sidebar.css'

class Sidebar extends Component {

    chatExist(friendId, userId) {
        const { chats } = this.props
        let exist = false
        for(let key in chats) {
            if(chats[key][friendId] && chats[key][userId]) {
                exist = true
            }
        }

        return exist
    }

    isActiveChat(friendId) {
        for(let chat in this.props.messages) {
            if(this.props.messages[chat].friendId === friendId) {
                return true
            }
        }
        return false
    }

    render() {
        return(
            <div className="sidebar" id="sidebar">
                <div className="sidebarUsers">
                    {
                        this.props.users.map(user => {
                            return(
                                <div className="user" key={user.id} onClick={() => this.props.chooseChat(user.id, user.username)} style={{backgroundColor: this.isActiveChat(user.id) ? '#2980B9' : '#2C3E50'}}>
                                    <i className="fa fa-user-circle" style={{color: user.online ? '#468966' : '#E74C3C', margin: 'auto 0'}}/>
                                    <span>{user.username}</span>
                                    <div>
                                    {this.chatExist(user.id, this.props.userId)
                                        ?
                                        <i className="fa fa-comments" style={{color: this.props.unReadMessages.indexOf(user.id) === -1 ? "#ffffff" : "green"}}/>
                                            :
                                        <span/>
                                    }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}

export default Sidebar