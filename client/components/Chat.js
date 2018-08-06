import React from 'react';
import ChatEngineCore from 'chat-engine'
import store from '../store/index';
const now = new Date().getTime();

// class Message extends React.Component {
//   render() {
//     return (<div> {this.props.uuid}: {this.props.text} </div>
//     );
//   }
// };
export default class Chat extends React.Component {
  // return the initial state of our Chat class
  constructor() {
    super()
    this.state = {
      messages: [],
      chatInput: ``,
      chatReady: false,
      ChatEngine: null
    }
    const ChatEngineSet = ChatEngineCore.create({
      publishKey: `pub-c-83a7b3c8-f0d5-4ba0-896f-33ddf0a20466`,
      subscribeKey: `sub-c-228d0636-98e6-11e8-b377-126307b646dc`
    });
    let me = ChatEngineSet.connect(store.getState().user.name.split(` `).join(`_`), {
      signedOnTime: now
    })
    let currChannelChat
    ChatEngineSet.on(`$.ready`, async (data) => {
      currChannelChat = ChatEngineSet.Chat(this.props.channel)
      await currChannelChat.on(`message`, (payload) => {
        this.setState(prevState => ({
          messages: [...prevState.messages, { ...payload.sender, ...payload.data }]
        }))
      })
      this.setState({
        ChatEngine: currChannelChat,
        chatReady: true
      })
    });
  }
  // componentDidMount = async () => {
  //   try {

  //   } catch (e) { console.error(e) }
  // }

  // update the input field when the user types something
  setChatInput = (event) => {
    this.setState({ chatInput: event.target.value })
  }

  // send the message to the other users
  sendChat = () => {
    if (this.state.chatInput && this.state.ChatEngine) {
      this.currChannelChat.emit(`message`, {
        text: this.state.chatInput
      });
      this.setState({ chatInput: `` })
    }
  }

  // bind the 'Enter' key for sending messages
  _handleKeyPress = (e) => {
    if (e.key === `Enter`) {
      this.sendChat();
    }
  }

  // render the input field and send button
  render() {
    console.log(this.state.messages)
    if (this.state.chatReady) {
      return (
        <div style={{
          color: `white`,
          backgroundColor: `rgba(0, 0, 0, 0.74)`,
          padding: `10px`,
          borderRadius: `15px`
        }
        }>
          <h1>Chat: </h1>
          <div id="chat-output" >
            {
              this.state.messages.length ?
                this.state.messages.map((message, index) => {
                  let key = message.uuid + index
                  return (
                    <div style={{ color: `white`, outline: `1px solid black`, backgrounColor: `rgba(101, 101, 101, 0.74)`, padding: `3px` }} key={key} id="hideMe"> {message.uuid}: {message.text === `0` ? null : message.text} </div>)
                }) : null
            }

          </div> <input id="chat-input"
            type="text"
            name=""
            value={this.state.chatInput} onChange={this.setChatInput} onKeyPress={() => this._handleKeyPress(this.state.ChatEngine)} />
          <button type="button"
            onClick={this.sendChat} value="Send Chat">-></button>
        </div >
      );
    } else {
      return (
        <div />
      )
    }
  }
}