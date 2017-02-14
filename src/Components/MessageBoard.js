import React, { Component } from 'react'
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from '../ItemTypes';
import update from 'react/lib/update';


import MessageWindow from './MessageWindow';


const styles = {
    display: 'flex',
    flex: 1,
    backgroundColor: '#2C3E50',
};

const boxTarget = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);

        component.moveBox(item.id, left, top);
    },
};

function collect(connect) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

class MessageBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            boxes: this.setStateFromProps(props)
        };

        this.setStateFromProps = this.setStateFromProps.bind(this)
    }

    moveBox(id, left, top) {
        this.setState(update(this.state, {
            boxes: {
                [id]: {
                    $merge: { left, top },
                },
            },
        }));
    }

    setStateFromProps(nextProps) {
        let boxes = {}
        Object.keys(nextProps.messages).forEach((key,i) => {
            boxes[key] = {
                top: this.state.boxes[key] ? this.state.boxes[key].top : 100 + 10 * i,
                left: this.state.boxes[key] ? this.state.boxes[key].left : 300 + 60 * i,
                messages: nextProps.messages[key].conversation,
                title: nextProps.messages[key].title,
                friendId: nextProps.messages[key].friendId,
                chatKey: key
            }
        })

        return boxes
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ boxes: this.setStateFromProps(nextProps) })
    }

    render() {
        const { connectDropTarget, deleteChat, userN, userId } = this.props;
        const { boxes } = this.state;
        return connectDropTarget(
            <div style={styles}>
                {boxes ? Object.keys(boxes).map((key) => {
                    const { left, top, title, messages, friendId, chatKey } = boxes[key];
                    return (
                        <MessageWindow
                            key={key}
                            chatKey={chatKey}
                            id={key}
                            left={left}
                            top={top}
                            title={title}
                            userN={userN}
                            userId={userId}
                            friendId={friendId}
                            messages={messages}
                            hideSourceOnDrag={true}
                            deleteChat={deleteChat}
                        />
                    );
                }) :
                    null
                }
            </div>,
        );
    }
}

export default DragDropContext(HTML5Backend)(DropTarget(ItemTypes.BOX, boxTarget, collect)(MessageBoard))