import React, { Component } from 'react';
import P5Wrapper from './components/P5Wrapper';
// import sketch from './sketches/random';
// import sketch from './sketches/springEmbedder';
// import sketch from './sketches/forceDirected';
// import sketch from './sketches/simulatedAnnealing';

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
            sketch={sketch}
            sketchValues={{}}
            updateStateHandler={this.updateStateHandler}
          />
        </div>
      </div>
    );
  }
}

export default App;
