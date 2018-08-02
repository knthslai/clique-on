import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
const key = require(`../secrets`)
// import { Login, Signup, UserHome } from './components'
import { me } from './store'
import PubNub from 'pubnub'
import MapContainer from './components/mapContainer';

// import Maps from './map';
// const pubnub = new PubNub(key || {
//   publishKey: process.env.PUBNUB_PUB,
//   subscribeKey: process.env.PUBNUB_SUB,
//   secretKey: process.env.PUBNUB_SEC,

// })
// pubnub.addListener({
//   message: function (message) {
//     console.dir(message)
//     // const ipApi = await axios.get(`/http://ip-api.com/json/${ip}`)
//     // console.log('ipApi', ipApi);

//   }
// })
// pubnub.subscribe({
//   channels: [`demo_tutorial`, `eon-maps-geolocation-input`]
// });

/**
 * COMPONENT
 */
class Routes extends Component {

  handleClick = (evt) => {

    pubnub.publish({
      message: {
        "color": `blue`,
        [evt.target.name]: evt.target.value
      },
      channel: [`demo_tutorial`, `eon-maps-geolocation-input`]
    });
  }
  render() {
    return (
      <React.Fragment>
        <MapContainer />
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
