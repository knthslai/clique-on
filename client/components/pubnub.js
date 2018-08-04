import PubNub from 'pubnub'
import key from '../../secrets'

// console.log(`curr - pubnubProps`, Object.keys(process.env));
export default function (uuid) {
  let pubnubProps;
  // if (key.subscribeKey) {
  //   pubnubProps = key
  // } else {
  pubnubProps = {
    // publishKey: process.env.PUBNUB_PUB,
    // subscribeKey: process.env.PUBNUB_SUB,
    // secretKey: process.env.PUBNUB_SEC,
    publishKey: `pub-c-ec5be6a2-71b1-44d5-829f-a8695b472e37`,
    subscribeKey: `sub-c-ba1d6808-8ea8-11e8-bdf5-3621de398238`,
    secretKey: `sec-c-YjhlMDJlYWMtM2FiNC00MDI5LTg4NDYtY2I0YmQ4YTllZjEz`,
    ssl: true,
    uuid
    // }
  }
  return new PubNub(pubnubProps)
}