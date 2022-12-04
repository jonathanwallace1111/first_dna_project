import React, { Component } from 'react'; 
import PopulationMember from './PopulationMember';

export default class CurrentGeneration extends Component {
    constructor(props) {
        super(props); 
        this.state = {

        }

        this.displayPop = this.displayPop.bind(this); 
    }

    displayPop() {

    }

    render() {
        let pop = this.props.searchCriteria.currentPopulation; 
        // console.log(pop); 

        return (
            <div>
                <div>CURRENT GENERATION</div> 
                {pop.map(function(popMem, index) {
                    return <PopulationMember key={index} dna={popMem.displayPhrase} /> 
                })}

            </div>
        )
    }
}
