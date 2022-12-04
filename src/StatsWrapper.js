import React, { Component } from 'react'

export default class StatsWrapper extends Component {
    constructor(props) {
        super(props); 

        this.displayStats = this.displayStats.bind(this); 
        this.setEvolutionParameters = this.setEvolutionParameters.bind(this); 
        this.setSearchPhrase = this.setSearchPhrase.bind(this); 
        this.handleClick = this.handleClick.bind(this); 
    }


    displayStats() {

    }

    setEvolutionParameters() {

        this.displayStats(); 
    }
    
    setSearchPhrase(searchPhrase) {

        // use this.props.setStateValue()
    }

    handleClick(e) {
        e.preventDefault(); 
        let searchPhrase = e.target[0].value; 
        let popSize = e.target[1].value; 
        let mutRate = e.target[2].value; 

        //I am triggering the runEvolution function through a callback on the setState function inside of setStateValue;
        this.props.setParentState(searchPhrase, popSize, mutRate); 
    }

    render() {
        let propsVar = this.props.searchData;

        return (
            <div>
                <form name="searchCriteriaForm" onSubmit={this.handleClick}>
                    <label htmlFor="searchPhrase">Search Phrase: </label>
                    <input type="text" id="searchPhrase" name="searchCriteria" defaultValue={propsVar.searchPhrase} maxLength="25"></input>
                    <br></br>
                    <label htmlFor="popSize">Population Size: </label>
                    <input type="number" id="popSize" name="searchCriteria" max="1000" defaultValue={propsVar.populationSize}></input> 
                    <br></br>
                    <label htmlFor="mutationRatePercentage">Mutation Rate: </label>
                    <input type="number" id="mutationRatePercentage" name="searchCriteria" min="0" max="100" defaultValue={propsVar.mutationRatePercentage}></input><span>%</span>
                    <br></br>
                    <input type="submit" name="searchCriteria" value="Start Evolution Cycle"></input>
                </form>
                <div>Total Generation Count: {this.props.searchData.totalGenerationCount}</div>
                <div>Average Fitness: {this.props.searchData.averageFitness}</div>
            </div>
        )
    }
}
