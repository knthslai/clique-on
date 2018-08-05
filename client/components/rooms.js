import React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import history from '../history';
import { connect } from 'react-redux';
const Chance = require(`chance`)
const chance = new Chance();

class Room extends React.Component {
  constructor() {
    super()
    this.state = {
      room: chance.animal({ type: `pet` }) + `_Room`
    }
  }
  handleSubmit = (evt) => {
    evt.preventDefault()
    history.push(`/channel/${this.state.room}___` + this.props.user.UUID)
  }

  handleChange = (evt) => {
    this.setState({ room: evt.target.value })
  }
  render() {
    let channels = this.props.user.channels
    const hasChannelBool = (Array.isArray(channels) || channels !== null)
    if (hasChannelBool) {
      channels = this.props.user.channels.reverse
    }
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label style={{ color: `white` }}><h3>Room Name</h3></label>

            <input type="text" name="roomName" value={this.state.room} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <Button type='submit'>Create Room</Button>
          </Form.Field>
          <Form.Field>
            {

              hasChannelBool && (
                <Dropdown style={{ background: `white` }} text='Rooms'>
                  <Dropdown.Menu >
                    <Dropdown.Item text={channels[0].substring(0, channels[0].search(`___`))} onClick={() => {
                      history.push(`/channel/${channels[0]}`)
                    }
                    } />
                    <Dropdown.Divider />
                    {
                      channels.slice(1).map(channel => {
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
                </Dropdown>)

            }
          </Form.Field>
        </Form >
      </React.Fragment >
    )
  }
}
export default connect(state => ({ ...state }))(Room)