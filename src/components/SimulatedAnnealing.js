import React, { Component } from 'react';
import P5Wrapper from './P5Wrapper';
import sketch from '../sketches/simulatedAnnealing';

class SimulatedAnnealing extends Component {
  constructor() {
    super();
    this.state = {
      appName: 'Simulated Annealing',
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

export default SimulatedAnnealing;
