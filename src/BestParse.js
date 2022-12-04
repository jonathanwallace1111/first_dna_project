import React, { Component } from 'react'

export default class BestParse extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return (
        <div>"{this.props.best}"</div>
        )
    }
}
