import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store'
import history from '../history';

class Navbar extends React.Component {
  componentWillUnmount() {
    this.handleClick()
  }
  render() {
    const { handleClick, isLoggedIn } = this.props
    return (
      <div>
        <h1 onClick={() => history.push(`/`)} style={{ color: `white` }}>Clique-On   </h1>
        {isLoggedIn && <button type='submit' style={{ alignSelf: `center`, color: `white`, background: `black`, borderRadius: `15px`, border: `1px solid white`, marginBottom: `15px`, marginLeft: `20px` }} onClick={handleClick}>Logout</button>}

      </div >)
  }

}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id

  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
* PROP TYPES
*/
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
