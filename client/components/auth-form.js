import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import store, { auth, guestUser } from '../store'
import { Link } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react'
import history from '../history';
const Chance = require(`chance`)
const chance = new Chance();

/**
 * COMPONENT
 */
class AuthForm extends React.Component {
  // componentDidMount() {
  //   if ()
  // }

  render() {
    const { name, displayName, handleLogin, handleGuest, error } = this.props
    let guestName = chance.animal({ type: `pet` }) + `_` + chance.coin() + chance.hour({ twentyfour: true }) + chance.millisecond();

    return (
      <React.Fragment>
        <Form name={name} onSubmit={(e) => handleLogin(e, this.props.location.pathname)}>
          <Form.Field style={{ marginBottom: `0px` }}>
            <button className="ui inverted basic button" type='button' name='guest' onClick={(e) => handleGuest(e, guestName, this.props.location.pathname)}>Guest Access</button>
          </Form.Field>
          <Form.Field>
            {
              name === `signup` && <Form.Field><label style={{ color: `white` }}>Username</label><input name="userName" placeholder='Username' /></Form.Field>
            }

          </Form.Field>
          {/* <Form.Field style={{ textAlign: `center` }}>
          
          </Form.Field> */}

          <Form.Field>
            <h1 style={{ margin: `0px`, border: `0px` }} />
            <label style={{ color: `white` }}>Email</label>
            <input name="email" placeholder='you@mail.com' />
          </Form.Field>
          <Form.Field>
            <label style={{ color: `white` }}>Password</label>
            <input name="password" type="password" placeholder='Password' />
          </Form.Field>
          <Form.Field>
            <button className="ui inverted basic button" type='submit'>{displayName}</button>
            {name === `login` ? (<button type="button" className="ui inverted basic button" onClick={() => history.push(`/signup`)}>or ... Sign Up</button>) : (<button type="button" className="ui inverted basic button" onClick={() => history.push(`/login`)}>or ... Login</button>)}
            {error && error.response && <div> {error.response.data} </div>}
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
    handleGuest(evt, name, urlFromForm) {
      evt.preventDefault()
      const user = store.getState().user
      let session
      if (user.session === undefined) {
        session = user
      } else {
        session = user.session
      }
      const guest = { name, session }
      const payLoad = { guest }
      if (urlFromForm.search(`channel/`) > 0) {
        payLoad.url = urlFromForm
      }
      dispatch(guestUser(payLoad))
    },
    handleLogin(evt, url) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      const payLoad = { formName, email, password }
      if (evt.target.userName) {
        payLoad.name = evt.target.userName.value
      }
      if (url.search(`channel/`)) {
        payLoad.currUrl = url
      }
      dispatch(auth(payLoad))
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
