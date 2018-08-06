import React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import history from '../history';
import { connect } from 'react-redux';
import { getChannels } from '../store';
import store from '../store/index';
const Chance = require(`chance`)
const chance = new Chance();
class Room extends React.Component {
  constructor() {
    super()
    // console.log(`channels user user2`, store.getState())
    this.state = {
      room: chance.animal({ type: `pet` }) + `_Room` + chance.hour({ twentyfour: true }) + chance.millisecond(),
      channels: store.getState().user.channels,
      channelBool: false
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    this.props.getChannels({ email: this.props.user.email || `guest`, userId: this.props.user.id, channel: this.state.room.split(` `).join(`_`) })
    history.push(`/room/${this.state.room}`)
  }

  handleChange = (evt) => {
    this.setState({ room: evt.target.value })
  }
  render() {

    if (!this.state.channelBool && this.state.channels !== null) {
      this.setState({
        channelBool: true
      })
    }
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>

            <input type="text" name="roomName" value={this.state.room} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <button type='submit' className="ui inverted basic button">Create Room</button>
          </Form.Field>
          <Form.Field>
            {
              this.state.channelBool ? (
                <React.Fragment>
                  <label style={{ color: `white` }}><h3>Previous Rooms:</h3></label>
                  <Dropdown style={{ background: `white` }} text='Rooms'>
                    <Dropdown.Menu >
                      <Dropdown.Item text={this.state.channels[0]} onClick={() => {
                        history.push(`/room/${this.state.channels[0]}`)
                      }
                      } />
                      {
                        this.state.channels.length > 1 ? this.state.channels.slice(1).map(channel => {
                          return (
                            <Dropdown.Item key={channel} text={channel} onClick={(e) => {
                              console.log(e)
                              history.push(`/room/${channel}`)
                            }
                            } />
                          )
                        }) : null
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </React.Fragment>
              ) : null

            }
          </Form.Field>
        </Form >
      </React.Fragment >
    )
  }
}
export default connect(
  state => ({ ...state }),
  dispatch => ({
    getChannels: (payLoad) => dispatch(getChannels(payLoad))
  })
)(Room) 