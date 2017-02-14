import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { DragSource } from 'react-dnd';
import Draggable from 'react-draggable'
import * as firebase from 'firebase'

import ItemTypes from '../ItemTypes';

import '../Styles/Components/MessageWindow.css'

const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    width: 400,
    backgroundColor: '#C0C0C0',
    transition: 'all 0.5 linear',
};

const boxSource = {
    beginDrag(props) {
        const { id, left, top } = props;
        return { id, left, top };
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}


class MessageBoard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            width: 400,
            height: 500,
            text: "",
        }

        this.handleDrag = this.handleDrag.bind(this)
        this.handleStart = this.handleStart.bind(this)
    }

    handleDrag(e) {
        let x = e.screenX - this.state.startDragX
        let y = e.screenY - this.state.startDragY
        let width = this.state.startDragWidth + x
        let height = this.state.startDragHeight + y
        if(width > 100 && height > 100) {
            this.setState({height: height, width: width})
        }
    }

    handleStart(e) {
        this.setState({startDragX: e.screenX, startDragY: e.screenY, startDragWidth: this.state.width, startDragHeight: this.state.height})
    }

    writeMessage(e) {
        if (e.charCode === 13) {
            let message = {}
            let d = new Date()
            message.date = d.getDate() + "/" + (d.getMonth() + 1) + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
            message.username = this.props.userN
            message.text = this.state.text

            firebase.database().ref('messages/' + this.props.id).push(message)
            firebase.database().ref('users/' + this.props.friendId + '/unReadMessages/' + this.props.userId).set({
                chatKey: this.props.chatKey,
                date: message.date
            })
            this.setState({text: ""})
        }
    }

    componentWillReceiveProps() {
        if(document.getElementById("scroll")) {
            var element = document.getElementById("scroll")
            element.scrollTop = element.scrollHeight
        }
    }

    componentDidMount() {
        this.scrollToBottom()
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        const node = ReactDOM.findDOMNode(this.messagesEnd)
        if(node) {
            node.scrollIntoView({behavior: "smooth"})
        }
    }

    render() {
        const { hideSourceOnDrag, left, top, title, deleteChat, id, messages, connectDragSource, isDragging, connectDragPreview } = this.props;
        if (isDragging && hideSourceOnDrag) {
            return null;
        }
        return connectDragPreview(
            <div style={{ ...style, height: this.state.height, width: this.state.width, left, top }}>
                {connectDragSource(
                <div className="dragHandle">
                    <span/>
                    <span>{title}</span>
                    <i className="fa fa-times messageDelete" onClick={() => deleteChat(id)}/>
                </div>
                )}
                <div className="messageContainer" id="scroll">
                    {
                        messages.map((message,i) => {
                            return(
                                <div key={message.date + `${i}`} className="singleMessage" style={{backgroundColor: this.props.userN !== message.username ? '#E0E0E0' : '#ffffff'}}>
                                    <div>{message.username}<span style={{float: 'right'}}>{message.date}</span></div>
                                    <div>{message.text}</div>
                                </div>
                            )
                        })
                    }
                    <div
                        style={ {float:"left", clear: "both"} }
                        ref={(el) => { this.messagesEnd = el }}>
                    </div>
                </div>
                <div className="messageInput">
                        <input
                            type="text"
                            value={this.state.text}
                            onChange={(e) => this.setState({text: e.target.value})}
                            onKeyPress={(e) => this.writeMessage(e)}
                        />
                        <Draggable
                            position={{x: this.state.x, y: this.state.y}}
                            onStart={this.handleStart}
                            onDrag={this.handleDrag}
                        >
                            <i className="fa fa-arrows arrow"
                               draggable="true"
                               style={{color: '#9D9D9D'}}
                            />
                        </Draggable>
                    </div>
            </div>
        );
    }
}

export default DragSource(ItemTypes.BOX, boxSource, collect)(MessageBoard)