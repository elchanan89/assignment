import React, { Component } from 'react';

class Map extends Component {
    
    render() {
        return (
            <iframe src={"https://www.google.com/maps/embed/v1/place?q=" + this.props.companyLocation +
                "+&key=" + this.props.mapApiKey} width="400" height="300" frameBorder="0" allowFullScreen></iframe>
        );
    }
}
export default Map;