import React, { Component } from 'react'

export default class PopulationMember extends Component {
    constructor(props) {
        super(props)
    
    }

    render() {
        return (
            <div>{this.props.dna}</div>
        )
    }
}
