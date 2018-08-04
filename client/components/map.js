import React, { Component } from 'react';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import { PropTypes } from 'prop-types';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)
import pubnub from './pubnub'
// import smoothPan from './smoothPan'

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
  watchCurrLocation = () => {
    navigator.geolocation.watchPosition((pos) => {
      // console.log(`pos`, pos.coords.accuracy);
      var crd = pos.coords;
      const latBool = Math.abs(crd.latitude - this.state.currentLocation.lat) > 0.0001
      console.log(`lat - coord difference:`, crd.latitude - this.state.currentLocation.lat);
      const lngBool = Math.abs(crd.longitude - this.state.currentLocation.lng) > 0.0001
      console.log(`lng - coord difference:`, crd.latitude - this.state.currentLocation.lat);
      if (latBool || lngBool) {
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
        console.log(`message`, message);
        // console.log({ message: { message }, when: timeAgo.format(Number(message.timetoken.substring(0, 13))) })

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