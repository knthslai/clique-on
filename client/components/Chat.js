import React from 'react';
import ChatEngineCore from 'chat-engine'
const now = new Date().getTime();
const username = [`Kenneth`, now].join(`-`);
import ReactLoading from 'react-loading';

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
  }
  componentDidMount = async () => {
    try {
      const ChatEngineSet = await ChatEngineCore.create({
        publishKey: `pub-c-83a7b3c8-f0d5-4ba0-896f-33ddf0a20466`,
        subscribeKey: `sub-c-228d0636-98e6-11e8-b377-126307b646dc`
      }, {
          globalChannel: this.props.channel
        });
      await ChatEngineSet.connect(username, {
        signedOnTime: now
      })
      await ChatEngineSet.on(`message`, (payload) => {
        this.setState(prevState => ({
          messages: [...prevState.messages, { ...payload.sender, ...payload.data }]
        }))
      })
      ChatEngineSet.on(`$.ready`, () => {
        this.setState({
          ChatEngine: ChatEngineSet,
          chatReady: true
        })
      });
    } catch (e) { console.error(e) }
  }

  // update the input field when the user types something
  setChatInput = (event) => {
    this.setState({ chatInput: event.target.value })
  }

  // send the message to the other users
  sendChat = () => {
    if (this.state.chatInput && this.state.ChatEngine) {
      this.state.ChatEngine.global.emit(`message`, {
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
        <div>
          <div id="chat-output" >
            {
              this.state.messages.length &&
              this.state.messages.map((message, index) => {
                let key = message.uuid + index
                return (
                  <div key={key}> {message.uuid}: {message.text} </div>)
              })
            }

          </div> <input id="chat-input"
            type="text"
            name=""
            value={this.state.chatInput} onChange={this.setChatInput} onKeyPress={this._handleKeyPress} />
          <button type="button"
            onClick={this.sendChat} value="Send Chat" />
        </div>
      );
    } else {
      return (
        <ReactLoading type="bars" color='white' height={667} width={375} />
      )
    }
  }
}