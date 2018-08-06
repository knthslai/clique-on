import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Login, Signup } from './components'
import { me } from './store'
import MapContainer from './components/mapContainer';
import Room from './components/rooms';

/**
 * COMPONENT
 */
class Routes extends Component {

  componentDidMount() {
    // runs /auth/me -> returns user if session
    this.props.loadInitialData()

  }
  render() {
    const { isLoggedIn } = this.props
    return (
      <React.Fragment>

        <Switch>
          {/* Routes placed here are available to all visitors */}
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          {isLoggedIn && (
            <Switch>

              <Route path="/channel/:channel" component={MapContainer} />
              <Route path="/" component={Room} />
            </Switch>
          )}

          {/* Displays our Login component as a fallback */}
          <Route component={Login} />

        </Switch>
      </React.Fragment>
    )
  }
}

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


// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, dispatch => ({
  loadInitialData: async () => {
    await dispatch(me())
  }
}))(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
