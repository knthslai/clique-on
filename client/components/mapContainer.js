import { GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Map from './map';
import { connect } from 'react-redux';
import { getChannels } from '../store/user';

const LoadingContainer = () => (
  <ReactLoading type="bars" color='white' height={667} width={375} />
)

class Container extends Component {
  componentDidMount() {
    if (this.propsisLoggedIn) {
      getChannels({ userId: this.props.user.id, channel: this.props.channel, email: this.props.user.email || `guest` })
    }
  }
  render() {
    ;
    return (
      <React.Fragment>
        <div className="addthis_inline_share_toolbox" />
        <div style={{
          width: `100vw`,
          height: `84vh`
        }} >
          <Map
            channel={this.props.match.params.channel}
            google={this.props.google}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default connect((state => ({ ...state })))(GoogleApiWrapper({
  apiKey: `AIzaSyD7ySe59IiWc8F1hX6eL9vrGQz45Nqcuko`, version: `3.32`,
  LoadingContainer: LoadingContainer
})(Container))