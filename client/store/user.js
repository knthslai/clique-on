import axios from 'axios'
import history from '../history'
import PubNub from 'pubnub'
import pubnub from '../components/pubnub'

/**
 * ACTION TYPES
 */
const GET_USER = `GET_USER`
const REMOVE_USER = `REMOVE_USER`
const GUEST_USER = `GUEST_USER`
const GET_HISTORY = `GET_HISTORY`
const GET_CHANNELS = `GET_CHANNELS`
/**
 * INITIAL STATE
 */
const defaultUser = {
  channels: []
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user })
const removeUser = session => ({ type: REMOVE_USER, session })
const guestUserAct = guest => ({ type: GUEST_USER, guest })
export const getHistory = historyInp => ({ type: GET_HISTORY, history: historyInp })
const getChannelsAct = channels => ({ type: GET_CHANNELS, channels })

/**
 * THUNK CREATORS
 */
export const getChannels = ({ userId, channel, email }) => async dispatch => {
  try {
    if (email === `guest`) {
      const { data } = await axios.put(`/api/users/guests/${userId}`, { channel: channel })
      dispatch(getChannelsAct(data))
    } else {
      const { data } = await axios.put(`/api/users/${userId}`, { channel: channel })
      dispatch(getChannelsAct(data))
    }

  } catch (err) {
    console.error(err)
  }
}
export const me = () => async dispatch => {
  try {
    const res = await axios.get(`/auth/me`)
    let payLoad = res.data
    if (res.data.UUID) {
      const pubnubItem = pubnub(res.data.UUID)
      payLoad = { ...res.data, pubnub: pubnubItem }
    }
    dispatch(getUser(payLoad))
  } catch (err) {
    console.error(err)
  }
}

export const auth = ({ email, password, name, formName, url }) => async dispatch => {
  let res
  let payLoad
  try {
    res = await axios.post(`/auth/${formName}`, { email, password, name, UUID: PubNub.generateUUID() })
    const pubnubItem = pubnub(res.data.UUID)
    payLoad = { ...res.data, pubnub: pubnubItem }
  } catch (authError) {
    return dispatch(getUser({ error: authError }))
  }
  try {
    dispatch(getUser(payLoad))
    if (url) {
      history.push(url)
    } else {
      history.push(`/createRoom`)
    }
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const guestUser = ({ guest, url }) => async dispatch => {

  try {
    const { data } = await axios.put(`/auth/guest`, { name: guest.name, session: guest.session, UUID: PubNub.generateUUID() })
    const pubnubItem = pubnub(data.UUID)
    const payLoad = { ...data, pubnub: pubnubItem }
    dispatch(guestUserAct(payLoad))
    if (url) {
      history.push(url)
      // } else {
      //   history.push(`/createRoom`)
    }
    else {
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
    case GET_CHANNELS:
      return { ...state, channels: action.channels }
    case GUEST_USER:
      return action.guest
    case GET_HISTORY:
      return { ...state, history: action.history }
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return action.session
    default:

      return { ...state, }
  }
}
