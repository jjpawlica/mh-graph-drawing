import React, { Component } from 'react';
import P5Wrapper from './components/P5Wrapper';
import random from './sketches/random';

class App extends Component {
  constructor() {
    super();
    this.state = {
      appName: 'Random Graph',
      nodes: 0,
      shouldSketchReset: false
    };
  }

  updateStateHandler = (newState, callback) => this.setState(newState, callback);

  resetSketch = () => {
    const { shouldSketchReset } = this.state;
    this.setState({ shouldSketchReset: !shouldSketchReset });
  };

  render() {
    const { appName, nodes } = this.state;
    return (
      <div className="container">
        <h1>{appName}</h1>
        <h2>{`Nodes: ${nodes}`}</h2>
        <div>
          <P5Wrapper
            sketch={random}
            sketchValues={{}}
            updateStateHandler={this.updateStateHandler}
          />
        </div>
      </div>
    );
  }
}

export default App;
