import React, { Component } from 'react';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import { PropTypes } from 'prop-types';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)
import pubnub from './pubnub'
const axios = require(`axios`)
// import smoothPan from './smoothPan'
import { connect } from 'react-redux';
import store from '../store/index';

const timeAgo = new TimeAgo(`en-US`)

class classMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pubnub: pubnub(store.getState().user.UUID),
      currentLocation: {
        lat: 40.758896,
        lng: -73.985130
      },
      showingInfoWindow: false,
      activeMarker: {},
      people: [],
      selectedPerson: {},
    }
    this.state.pubnub.addListener({
      message: (message) => {
        this.setState({
          people: this.state.people.push(message.message)
        })
      }
    })

    this.state.pubnub.subscribe({
      channels: [this.props.channel]
    });
  }

  componentDidMount = () => {
    axios.put(`/api/users/${this.props.user.id}`, { lastChannel: this.props.channel })
    this.getCurrentLocation()

  }

  getCurrentLocation = () => {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.watchPosition((pos) => {
          const latBool = Math.abs(pos.coords.latitude - this.state.currentLocation.lat) > 0.0001
          // console.log(`lat - coord difference:`, pos.coords.latitude - this.state.currentLocation.lat);
          const lngBool = Math.abs(pos.coords.longitude - this.state.currentLocation.lng) > 0.0001
          // console.log(`lng - coord difference:`, pos.coords.latitude - this.state.currentLocation.lat);
          if (latBool || lngBool) {
            this.setState({
              currentLocation: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              }
            })
            this.state.pubnub.publish({ channel: this.props.channel, message: { name: this.props.user.name, lat: pos.coords.latitude, lng: pos.coords.longitude, timetoken: timeAgo.format(Number(pos.timestamp.toString().substring(0, 13))), uuid: this.props.user.UUID } })
          }
        }, (e) => console.log(e), {
            enableHighAccuracy: true,
            maximumAge: 1000 * 60 * 2
          })
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
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

  onMarkerClick = (props, marker, ) => {
    this.setState({
      selectedPerson: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  render() {
    console.log(`people->`, this.state.people)

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
            <h3>{this.state.selectedPerson.name}</h3>
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

export default connect((state) => ({ user: state.user }))(classMap);
