import React, { Component } from 'react';
import BestParse from './BestParse';
import StatsWrapper from './StatsWrapper';
import CurrentGeneration from './CurrentGeneration';
import PopulationMember from './PopulationMember';

export default class App extends Component {
	constructor() {
		super();

		this.state = {
			searchPhrase: 'example phrase',
			populationSize: 200,
			mutationRatePercentage: 1,
			totalGenerationCount: 0,
			averageFitness: 0,
			currentPopulation: [],
			bestMatch: '',
			matchFound: false
		}

		this.setParentState = this.setParentState.bind(this);
		this.runEvolution = this.runEvolution.bind(this);

		this.createDNAForInitialPopulationMember = this.createDNAForInitialPopulationMember.bind(this);
		this.createInitialPopulation = this.createInitialPopulation.bind(this);
		// this.displayNewGeneration = this.displayNewGeneration.bind(this); 
		this.createNewGeneration = this.createNewGeneration.bind(this);
		this.crossOver = this.crossOver.bind(this); 
	}

	//I am triggering the runEvolution function through a callback on the setState function insite of setStateValue; 
	setParentState(newPhrase, newPopSize, newMutRate) {
		this.setState(prevState => {
			let newState = prevState;

			newState.searchPhrase = newPhrase;
			newState.populationSize = newPopSize;
			newState.mutationRatePercentage = newMutRate;

			//  searchPhrase: newPhrase,
			//   populationSize: newPopSize,
			//   mutationRatePercentage: newMutRate, 
			//   totalGenerationCount: prevState.totalGenerationCount,
			//   averageFitness: prevState.averageFitness,
			//   currentPopulation: prevState.currentPopulation

			return newState;

		}, this.runEvolution())
	}

	createDNAForInitialPopulationMember() {
		let possibleCharsString = ' abcdefghijklmnopqrstuvwxyz';

		let newPopMemberDNA = []

		let dnaLength = this.state.searchPhrase.length;
		for (let i = 0; i < dnaLength; i++) {
			let randCharIndex = Math.floor(Math.random() * 26);
			let randChar = possibleCharsString[randCharIndex];
			newPopMemberDNA.push(randChar);
		}

		return newPopMemberDNA
	}

	determinePopMemberFitness(popMem) {
		let popMemFitness;
		let dnaLength = this.state.searchPhrase.length;
		let searchPhraseArr = this.state.searchPhrase.split('');
		let numOfCorrect = 0;

		for (let i = 0; i < dnaLength; i++) {
			if (popMem.dna[i] === searchPhraseArr[i]) {
				numOfCorrect += 1
			}
		}

		popMemFitness = (numOfCorrect / dnaLength) * 100

		return popMemFitness;
	}

	runEvolution() {
		this.createInitialPopulation()

		let runInterval = setInterval(() => {
			if (this.state.matchFound) {
			 clearInterval(runInterval);
			 return;
			}
		
	 		this.createNewGeneration();
		}, 100);
	}

	createInitialPopulation() {
		let popSize = this.state.populationSize;
		let initialPopArr = [];

		for (let i = 0; i < popSize; i++) {
			let newPopMem = {};
			newPopMem.dna = this.createDNAForInitialPopulationMember();
			newPopMem.displayPhrase = newPopMem.dna.join('');
			newPopMem.fitness = this.determinePopMemberFitness(newPopMem);

			initialPopArr.push(newPopMem);
		}

		this.setState({ currentPopulation: initialPopArr } /*, console.log(this.state.currentPopulation)*//*this.createNewGeneration()*/);
	}

	crossOver(popMem1, popMem2) {
		let newChildDNA = []
		let randNum = Math.floor(Math.random() * 4); 
		let dnaSize = this.state.searchPhrase.length; 
		let evenDNASequence = [];
		let oddDNASequence = []; 
		let midpoint, firstHalfOfDNA, secondHalfOfDNA; 

		switch(randNum) {
			case 0: 
				for (let i = 0; i < dnaSize; i++) {
					if (i % 2 === 0) {
						newChildDNA.push(popMem1.dna[i])
					} else if (i % 2 !== 0) {
						newChildDNA.push(popMem2.dna[i])
					}
				}

				return newChildDNA; 

				break;
			case 1:
				for (let i = 0; i < dnaSize; i++) {
					if (i % 2 === 0) {
						newChildDNA.push(popMem2.dna[i])
					} else if (i % 2 !== 0) {
						newChildDNA.push(popMem1.dna[i])
					}
				}
				return newChildDNA; 

				break;
			case 2: 
				midpoint = Math.floor(popMem1.dna.length / 2); 
				firstHalfOfDNA = popMem1.dna.slice(0, midpoint); 
				secondHalfOfDNA = popMem2.dna.slice(midpoint, dnaSize +1)
				
				newChildDNA.push(...firstHalfOfDNA)
				newChildDNA.push(...secondHalfOfDNA)

				return newChildDNA;
				break;
			case 3:
				midpoint = Math.ceil(popMem1.dna.length / 2); 
				firstHalfOfDNA = popMem2.dna.slice(0, midpoint); 
				secondHalfOfDNA = popMem1.dna.slice(midpoint, dnaSize +1)
				
				newChildDNA.push(...firstHalfOfDNA)
				newChildDNA.push(...secondHalfOfDNA)

				return newChildDNA;
				break;
			default: 
				break; 
		}
		
		return newChildDNA; 
	}

	createNewGeneration() {
		let searchPhrase = this.state.searchPhrase;
		let dnaLength = this.state.searchPhrase.length;
		let popSize = this.state.populationSize;
		let mutRate = this.state.mutationRatePercentage;
		let totGenCount = this.state.totalGenerationCount;
		let averageFitness = this.state.averageFitness;
		let currentGen = this.state.currentPopulation;
		let bestMatch = this.state.bestMatch;
		let matePool = [];
		let nextGen = [];
		let avgFitnessAccumulator = 0;
		let bestMatchTemp = '';
		let bestMatchPercentage = 0;
		let tempMatchFound = false;

		for (let i = 0; i < currentGen.length; i++) {
			let popMem = currentGen[i];
			let fitness = popMem.fitness;

			if (fitness === 100) {
				tempMatchFound = true;
			}

			avgFitnessAccumulator += fitness;

			if (fitness > bestMatchPercentage) {
				bestMatchTemp = popMem.displayPhrase;
				bestMatchPercentage = fitness;
			}

			for (let i = 0; i <= fitness; i++) {
				matePool.push(popMem);
			}
		}
 
		let randNum = () => {
			return Math.floor(Math.random() * matePool.length);
		}

		for (let i = 0; i < popSize; i++) {
			//Test this and confirm that randNum is spitting out a different number on each call. 
			let parent1 = matePool[randNum()]; 
			let parent2 = matePool[randNum()]; 
			let newChild = {};
			
			let childDNABeforeMutation = this.crossOver(parent1, parent2);
			//Mutation function
			newChild.dna = childDNABeforeMutation.map(letter => {
				let possibleCharsString = ' abcdefghijklmnopqrstuvwxyz';

				if (Math.random() < mutRate / 100) {
					letter = possibleCharsString[Math.floor(Math.random() * 27)]; 
				}
				
				return letter;
			})

			
			newChild.displayPhrase = newChild.dna.join(''); 
			newChild.fitness = this.determinePopMemberFitness(newChild); 

			console.log(newChild); 

			nextGen.push(newChild); 

		}


		let tempAvgFitness = avgFitnessAccumulator / currentGen.length;

		let tempGenCount = this.state.totalGenerationCount;
		tempGenCount += 1;



		this.setState((prevState) => {
			let newState = prevState;
			newState.bestMatch = bestMatchTemp;
			newState.averageFitness = tempAvgFitness;
			newState.currentPopulation = nextGen;
			// newState.totalGenerationCount = prevState.totalGenerationCount + 1; 
			newState.totalGenerationCount = tempGenCount;
			newState.matchFound = tempMatchFound;

			return newState
		}, console.log(this.state.currentPopulation));
	}

	render() {
		return (
			<div>
				<BestParse best={this.state.bestMatch} />
				<StatsWrapper setParentState={this.setParentState} searchData={this.state} />
				<CurrentGeneration searchCriteria={this.state} />
			</div>
		)
	}
}

// export default App;
