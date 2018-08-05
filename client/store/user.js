import axios from 'axios'
import history from '../history'
import PubNub from 'pubnub'

/**
 * ACTION TYPES
 */
const GET_USER = `GET_USER`
const REMOVE_USER = `REMOVE_USER`
const GUEST_USER = `GUEST_USER`

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user })
const removeUser = session => ({ type: REMOVE_USER, session })
const guestUserAct = guest => ({ type: GUEST_USER, guest })

/**
 * THUNK CREATORS
 */

export const me = () => async dispatch => {
  try {
    const res = await axios.get(`/auth/me`)
    dispatch(getUser(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const auth = ({ email, password, userName, formName, url }) => async dispatch => {
  const session = await axios.get(`/auth/session`)
  let res
  try {
    res = await axios.post(`/auth/${formName}`, { email, password, userName, UUID: PubNub.generateUUID() })
  } catch (authError) {
    return dispatch(getUser({ error: authError }))
  }

  try {
    dispatch(getUser(res.data))
    if (url) {
      history.push(url)
    } else if (formName === `signup`) {
      history.push(`/channel/${session.data}`)
    } else {
      history.push(`/channel/${res.data.lastChannel}`)
    }

  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const guestUser = ({ guest, url }) => async dispatch => {
  try {
    const { data } = await axios.put(`/auth/guest`, { ...guest, UUID: PubNub.generateUUID() })
    dispatch(guestUserAct(data))
    if (url) {
      history.push(url)
    } else {
      history.push(`/channel/${data.session}`)
    }
  } catch (err) {
    console.error(err)
  }

}

export const logout = () => async dispatch => {
  try {
    await axios.post(`/auth/logout`)
    const session = await axios.get(`/auth/session`)
    dispatch(removeUser(session.data))
    history.push(`/login`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GUEST_USER:
      return action.guest
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return action.session
    default:
      return state
  }
}
