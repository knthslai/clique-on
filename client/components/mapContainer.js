import { GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Map from './map';

const LoadingContainer = () => (

  <ReactLoading type="bars" color='black' height={667} width={375} />
)

export class Container extends Component {
  render() {
    const style = {
      width: `100vw`,
      height: `100vh`
    }
    return (
      <div style={style}>
        <Map google={this.props.google}
        />
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: `AIzaSyD7ySe59IiWc8F1hX6eL9vrGQz45Nqcuko`, version: `3.32`,
  LoadingContainer: LoadingContainer
})(Container)