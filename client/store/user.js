import axios from 'axios'
import history from '../history'

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
const removeUser = () => ({ type: REMOVE_USER })
const guestUserAct = guest => ({ type: GUEST_USER, guest })

/**
 * THUNK CREATORS
 */
export const guestUser = userObj => async dispatch => {
  try {
    const { data } = await axios.put(`/auth/guest`, userObj)
    dispatch(guestUserAct(data))
    history.push(`/`)
  } catch (err) {
    console.error(err)
  }
}

export const me = () => async dispatch => {
  try {
    const res = await axios.get(`/auth/me`)
    dispatch(getUser(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, { email, password })
  } catch (authError) {
    return dispatch(getUser({ error: authError }))
  }

  try {
    dispatch(getUser(res.data))
    history.push(`/`)
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post(`/auth/logout`)
    dispatch(removeUser())
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
      return defaultUser
    default:
      return state
  }
}
