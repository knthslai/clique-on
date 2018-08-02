import React, { Component } from 'react';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import PubNub from 'pubnub'
import key from '../../secrets'
import { PropTypes } from 'prop-types';

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

class classMap extends Component {
  constructor(props) {
    super(props);
    this.refMap = React.createRef()
    const { lat, lng } = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    }
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const coords = pos.coords;
          console.log(`coords`, coords);
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          })
        })
      }
    }
    this.loadMap();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  recenterMap() {
    const map = this.map;
    const curr = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(curr.lat, curr.lng)
      map.panTo(center)
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const { google } = this.props;
      const maps = google.maps;

      let { zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(this.refMap, mapConfig);
    }
    return null;
  };

  render() {

    return (
      <Map
        google={this.props.google}
        initialCenter={this.props.initialCenter}
        zoom={14}
      // center={}
      >

        <Marker onClick={this.onMarkerClick}
          name="Current location" />

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            <h1>Test</h1>
          </div>
        </InfoWindow>
      </Map>
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
    lat: 40.7049282,
    lng: -74.0090609
  },
  centerAroundCurrentLocation: false
}
export default classMap;