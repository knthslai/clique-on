import React, { Component } from 'react';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import { PropTypes } from 'prop-types';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react'
import Chat from './Chat';
import { setLocation } from '../store';
import store from '../store/index';
const timeAgo = new TimeAgo(`en-US`)
const Chance = require(`chance`)
const chance = new Chance();

class classMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: navigator.geolocation,
      showingInfoWindow: false,
      activeMarker: {},
      people: [],
      selectedPerson: {},
      hasPeople: false
    }
    this.props.user.pubnub.addListener({
      message: ({ message, timetoken }) => {
        if (message.UUID !== this.props.user.UUID) {
          const newPeople = Object.assign({}, this.state.people)
          // console.log(`newPeople`, newPeople);
          newPeople[message.UUID] = { entry: message, timetoken }
          // console.log(`newPeople`, newPeople);
          this.setState({
            people: newPeople
          }
          )
        }
      }
    })

    this.props.user.pubnub.subscribe({
      channels: [this.props.channel]
    });
  }

  componentDidMount = () => {
    this.getStateHistory()
    this.getCurrentLocation()
    this.recenterMap(this.props.user.location)
  }
  getStateHistory = async () => {
    const result = {}
    const { messages } = await this.props.user.pubnub.history(
      {
        channel: this.props.channel,
        count: 100 // how many items to fetch
        // start: (Date.now() - 2 * 60 * 60 * 1000).toString() + `0000`, // start time token to fetch
      })
    messages.filter(message => {
      const { UUID } = message.entry
      if (UUID !== this.props.user.UUID) {
        return true
      } else {
        return false
      }
    })
    messages.forEach(message => {
      const { UUID } = message.entry
      if (!result[UUID]) {
        result[UUID] = { timetoken: message.timetoken, entry: message.entry }
      } else if (result[UUID].timetoken < message.timetoken) {
        result[UUID].timetoken = message.timetoken
      }
    })
    this.setState({
      hasPeople: true,
      people: result
    })
    // dispatch(getHistory(result))
  }
  componentWillUnmount() {
    this.state.nav.clearWatch(this.state.nav)
  }
  getCurrentLocation = () => {
    if (navigator && this.state.nav) {
      this.state.nav.watchPosition((pos) => {
        const latBool = Math.abs(pos.coords.latitude - this.props.user.location.lat) > 0.0001
        // console.log(`lat - coord difference:`, pos.coords.latitude - this.props.user.location.lat);
        const lngBool = Math.abs(pos.coords.longitude - this.props.user.location.lng) > 0.0001
        // console.log(`lng - coord difference:`, pos.coords.latitude - this.props.user.location.lat);
        if (latBool || lngBool) {

          this.props.setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          const user = { id: this.props.user.id, channel: this.props.channel, message: { name: this.props.user.name, lat: pos.coords.latitude, lng: pos.coords.longitude, timetoken: pos.timestamp, UUID: this.props.user.UUID } }
          this.props.user.pubnub.publish(user)
        }
      }, (e) => console.log(e), {
          enableHighAccuracy: false,
          maximumAge: 1000 * 60 * 2
        })

    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentLocation !== this.props.user.location) {
      this.recenterMap(this.props.user.location)
    }
  }

  assignMap = (mapProps, map) => {
    this.map = map
  }

  recenterMap(coords) {
    const map = this.map
    const google = this.props.google;
    // smoothPan(map, google, curr)
    const maps = google.maps;
    if (map) {
      let center = new maps.LatLng(coords.lat, coords.lng)
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
  returnColor = () => {
    const colors = [`red`, `blue`, `green`, `yellow`, `orange`, `purple`]
    const index = chance.integer({ min: 0, max: colors.length - 1 })
    return colors[index]
  }
  render() {
    return (
      <React.Fragment>
        <Map
          google={this.props.google}
          initialCenter={this.props.initialCenter}
          zoom={16}
          onReady={this.assignMap}
          onClick={this.onMapClicked}
        >
          <Marker
            animation="google.maps.Animation.DROP"
            position={this.props.user.location}
            onClick={this.onMarkerClick}
            label='You'
          />

          {

            this.state.hasPeople ? (
              Object.keys(this.state.people).map(key => {
                const person = this.state.people[key]
                console.log(`person`, person);
                const { name, lat, lng } = this.state.people[key].entry
                return (
                  <Marker
                    icon={`http://maps.google.com/mapfiles/ms/icons/${this.returnColor()}-dot.png`}
                    key={person.timetoken}
                    animation="google.maps.Animation.DROP"
                    label={name[0].toUpperCase()}
                    name={name}
                    title={timeAgo.format(Number(person.timetoken.toString().substring(0, 13)))}
                    position={{ lat: lat, lng: lng }}
                    onClick={this.onMarkerClick} />
                )
              })) : <div />
          }
          < InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
            <div>
              <h3>{this.state.selectedPerson.name}</h3>
            </div>
          </InfoWindow>
        </Map >
        <Menu vertical >
          <Menu.Item style={{
            color: `white`,
            backgroundColor: `rgba(0, 0, 0, 0.74)`,
            padding: `10px`,
            borderTopLeftRadius: `15px`,
            borderTopRightRadius: `15px`,
            borderBottomRightRadius: `0px`,
            borderBottomLeftRadius: `0px`,
            width: `234px`
          }}>
            <Menu.Header>Recently Updated Locations</Menu.Header>
            <Menu.Menu >
              {
                this.state.people && (
                  Object.keys(this.state.people).map(key => {
                    const person = this.state.people[key]
                    const { name, lat, lng } = this.state.people[key].entry
                    return (
                      <Menu.Item
                        style={{
                          color: `white`,
                          borderTop: `1px dashed white`,
                          borderBottom: `1px dashed white`
                        }}
                        key={person.timetoken}
                        name={name + `   ~ Updated: ` + timeAgo.format(Number(person.timetoken.toString().substring(0, 13)))}
                        onClick={() => this.recenterMap({ lat, lng })}
                      />)
                  }))
              }
              <div className="Chat" style={{ backgroundColor: `transparent` }} >
                <Chat channel={this.props.channel} />
              </div>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </React.Fragment >
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

export default connect(state => ({ ...state }), dispatch => ({ setLocation: (location) => dispatch(setLocation(location)) }))(classMap);
