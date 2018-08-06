import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import { logout } from '../store'
import history from '../history';
class Navbar extends React.Component {
  render() {
    const { handleClick, isLoggedIn } = this.props
    return (
      <div>
        <h1 onClick={() => history.push(`/`)} style={{ color: `white`, fontSize: `42px` }}>Clique-On   </h1>
        {isLoggedIn ? (<div style={{ paddingLeft: `18px` }}>
          <button type='submit' name='rooms' className="ui inverted basic button" onClick={handleClick}>Rooms</button>
          <button type='submit' name='logout' className="ui inverted basic button" onClick={handleClick}>Logout</button> </div>) : null}

      </div >)
  }

}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    ...state,
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick(evt) {
      switch (evt.target.name) {
        case `rooms`:
          history.push(`/createRoom`)
          break
        case `logout`:
          dispatch(logout())
          break
        default:
          break
      }

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
