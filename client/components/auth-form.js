import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import store, { auth, guestUser } from '../store'
import { Link } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react'
const Chance = require(`chance`)
const chance = new Chance();

/**
 * COMPONENT
 */
class AuthForm extends React.Component {

  render() {
    const { name, displayName, handleLogin, handleGuest, error } = this.props
    let guestName = chance.state({ full: true }).concat(` `, chance.animal({ type: `zoo` }), ` `, chance.coin());

    return (
      <React.Fragment>
        <Form name={name} onSubmit={handleLogin}>
          <Form.Field>
            <label style={{ color: `white` }}><h3>Guest Access</h3></label>
            <Button type='button' name='guest' onClick={(e) => handleGuest(e, guestName)}>{guestName}</Button>
          </Form.Field>
          <Form.Field>
            <label style={{ color: `white` }}><h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3></label>
          </Form.Field>
          <Form.Field style={{ textAlign: `center` }}>
            <a>or ... {name === `login` ? (<Link to="/signup" style={{ background: `black`, borderBottom: `1px dashed white`, padding: `5px` }}>Sign Up</Link>) : (<Link style={{ background: `black`, borderBottom: `1px dashed white`, padding: `5px` }} to="/login">Login</Link>)}</a>
          </Form.Field>
          <Form.Field>
            <label style={{ color: `white` }}>Email</label>
            <input name="email" placeholder='First Name' />
          </Form.Field>
          <Form.Field>
            <label style={{ color: `white` }}>Password</label>
            <input name="password" type="password" placeholder='Last Name' />
          </Form.Field>
          <Form.Field>
            <Button type='submit'>{displayName}</Button>
            {error && error.response && <div> {error.response.data} </div>}
            {/* <a href="/auth/GitHub" style={{ color: `white` }}>{displayName} with GitHub</a> */}
          </Form.Field>
        </Form >

      </React.Fragment >
    )
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: `login`,
    displayName: `Login`,
    error: state.user.error,
    session: state.user
  }
}

const mapSignup = state => {
  return {
    name: `signup`,
    displayName: `Sign Up`,
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleGuest(evt, guestName) {
      evt.preventDefault()
      const session = store.getState().user
      dispatch(guestUser({ guestName, session }))
    },
    handleLogin(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
* PROP TYPES
*/
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleGuest: PropTypes.func.isRequired,
  error: PropTypes.object
}
