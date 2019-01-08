import React, { Component } from 'react';
import P5Wrapper from './P5Wrapper';
import sketch from '../sketches/geneticAlgorithm';

class GeneticAlgorithm extends Component {
  constructor() {
    super();
    this.state = {
      appName: 'Genetic Algorithm',
      shouldSketchReset: false
    };
  }

  updateStateHandler = (newState, callback) => this.setState(newState, callback);

  resetSketch = () => {
    const { shouldSketchReset } = this.state;
    this.setState({ shouldSketchReset: !shouldSketchReset });
  };

  render() {
    const { appName } = this.state;
    return (
      <div className="container">
        <h1>{appName}</h1>
        <div>
          <P5Wrapper
            sketch={sketch}
            sketchValues={{}}
            updateStateHandler={this.updateStateHandler}
          />
        </div>
      </div>
    );
  }
}

export default GeneticAlgorithm;
