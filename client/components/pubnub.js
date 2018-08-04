import PubNub from 'pubnub'
import key from '../../secrets'

let pubnubProps;
if (key.subscribeKey) {
  pubnubProps = key
} else {
  pubnubProps = {
    publishKey: process.env.PUBNUB_PUB,
    subscribeKey: process.env.PUBNUB_SUB,
    secretKey: process.env.PUBNUB_SEC,
    ssl: true,
    uuid: PubNub.generateUUID()
  }
}

export default new PubNub(pubnubProps)