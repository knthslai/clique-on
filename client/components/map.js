import React, { Component } from 'react';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import PubNub from 'pubnub'
import key from '../../secrets'
import { PropTypes } from 'prop-types';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)
// import smoothPan from './smoothPan'
let pubnubProps;
if (key.subscribeKey) {
  pubnubProps = key
} else {
  pubnubProps = {
    publishKey: process.env.PUBNUB_PUB,
    subscribeKey: process.env.PUBNUB_SUB,
    secretKey: process.env.PUBNUB_SEC,
    uuid: PubNub.generateUUID()
  }
}

const pubnub = new PubNub(pubnubProps)
const timeAgo = new TimeAgo(`en-US`)
const pnChannel = `FSADemo-knthslai`

class classMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: {
        lat: 40.758896,
        lng: -73.985130

      },
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    }
  }

  componentDidMount() {
    this.getCurrentLocation()
  }

  getCurrentLocation = async () => {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition((pos) => {
          const coords = pos.coords;
          console.log(`coords`, coords);

          pubnub.publish({ channel: pnChannel, message: coords })
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          })
        })
      }
    }
    this.watchCurrLocation()
  }
  watchCurrLocation = async () => {
    await navigator.geolocation.watchPosition((pos) => {
      var crd = pos.coords;

      if (this.state.currentLocation.lat !== crd.latitude || this.state.currentLocation.lng !== crd.longitude) {
        this.setState({
          currentLocation: {
            lat: crd.latitude,
            lng: crd.longitude
          }
        })
        pubnub.publish({ channel: pnChannel, message: this.state.currentLocation })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // const latBool = Math.abs(prevState.currentLocation.lat - this.state.currentLocation.lat) > 0.000001
    // const lngBool = Math.abs(prevState.currentLocation.lng - this.state.currentLocation.lng) > 0.000001
    // if (latBool && lngBool) {

    //   this.recenterMap();
    // }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap()
    }
  }

  assignMap = (mapProps, map) => {
    this.map = map
  }

  recenterMap() {
    const map = this.map
    const curr = this.state.currentLocation;

    const google = this.props.google;

    // smoothPan(map, google, curr)
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(curr.lat, curr.lng)
      map.panTo(center)
    }
  }
  onMarkerClick = (props, marker, ) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    this.UUID = pubnub.getUUID()

    pubnub.addListener({
      message: function (message) {
        console.log({ message: { message }, when: timeAgo.format(Number(message.timetoken.substring(0, 13))) })

      }
    })
    pubnub.subscribe({
      channels: [pnChannel, `eon-maps-geolocation-input`]
    });

    return (
      <Map
        google={this.props.google}
        initialCenter={this.props.initialCenter}
        zoom={16}
        onReady={this.assignMap}
        onClick={this.onMapClicked}
      >

        <Marker
          name="Your position"
          position={this.state.currentLocation}
          onClick={this.onMarkerClick} />

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
          <div>
            <h3>{this.state.selectedPlace.name}</h3>
          </div>
        </InfoWindow>
      </Map >
    );
  }
}
classMap.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  centerAroundCurrentLocation: PropTypes.bool
}
classMap.defaultProps = {
  zoom: 13,

  initialCenter: {
    lat: 40.758896,
    lng: -73.985130

  },
  centerAroundCurrentLocation: true
}
export default classMap;