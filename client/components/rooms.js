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
    this.state = {
      room: chance.animal({ type: `pet` }) + `_Room`,
      channels: null,
      chatReady: false
    }
  }
  componentDidMount() {

    this.setState({
      channels: store.getState().user.channels.reverse()
    })

  }
  handleSubmit = (evt) => {
    evt.preventDefault()
    this.props.getChannels({ email: this.props.user.email || `guest`, userId: this.props.user.id, channel: `${this.state.room}___` + this.props.user.UUID })
    history.push(`/channel/${this.state.room}___` + this.props.user.UUID)
  }

  handleChange = (evt) => {
    this.setState({ room: evt.target.value })
  }
  render() {
    let hasChannelBool = false
    hasChannelBool = Array.isArray(this.state.channels)
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>

            <input type="text" name="roomName" value={this.state.room} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <Button type='submit'>Create Room</Button>
          </Form.Field>
          <Form.Field>
            {

              hasChannelBool ? (
                <React.Fragment>
                  <label style={{ color: `white` }}><h3>Previous Rooms:</h3></label>
                  <Dropdown style={{ background: `white` }} text='Rooms'>
                    <Dropdown.Menu >
                      <Dropdown.Item text={this.state.channels[0].substring(0, this.state.channels[0].search(`___`))} onClick={() => {
                        history.push(`/channel/${this.state.channels[0].split(` `).join(`_`)}`)
                      }
                      } />
                      <Dropdown.Divider />
                      {
                        this.state.channels.slice(1).map(channel => {
                          return (
                            <Dropdown.Item key={channel} text={channel.substring(0, channel.search(`___`))} onClick={(e) => {
                              console.log(e)
                              history.push(`/channel/${channel}`)
                            }
                            } />
                          )
                        })
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
export default connect(state => ({ ...state }), dispatch => ({ getChannels: (payLoad) => dispatch(getChannels(payLoad)) }))(Room) 