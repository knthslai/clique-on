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
    publishKey: `pub-c-fe262c95-4798-4641-a6a0-cc38f79eb292`,
    subscribeKey: `sub-c-89fbd816-9999-11e8-8f0f-6ef91e362860`,
    secretKey: `sec-c-ZjkxY2U0YmItMjMwYS00YTFkLTg2ZGMtYWFiYmZiNTJhMThl`,
    ssl: true,
    uuid
    // }
  }
  return new PubNub(pubnubProps)
}