import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { Login, Signup, UserHome } from './components'
import { me } from './store'
import PubNub from 'pubnub'
const pubnubDemo = new PubNub({
  publishKey: `pub-c-ec5be6a2-71b1-44d5-829f-a8695b472e37`,
  subscribeKey: `sub-c-ba1d6808-8ea8-11e8-bdf5-3621de398238`
})
pubnubDemo.addListener({
  message: function ({ message }) {
    console.log(message)
  }
})

pubnubDemo.subscribe({
  channels: [`demo_tutorial`]
});
/**
 * COMPONENT
 */
class Routes extends Component {

  handleClick = (evt) => {
    pubnubDemo.publish({
      message: {
        "color": `blue`,
        [evt.target.name]: evt.target.value
      },
      channel: `demo_tutorial`
    });
  }
  render() {
    // const { isLoggedIn } = this.props
    return (
      <React.Fragment>
        <input name='input' onClick={this.handleClick} />
      </React.Fragment>
    )
  }
}
{/* <Switch> */ }
// {/* Routes placed here are available to all visitors */}
// <Route path="/login" component={Login} />
// <Route path="/signup" component={Signup} />
// {isLoggedIn && (
//   <Switch>
//     {/* Routes placed here are only available after logging in */}
//     <Route path="/home" component={UserHome} />
//   </Switch>
// )}
// {/* Displays our Login component as a fallback */}
// <Route component={Login} />
// </Switch>
/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
