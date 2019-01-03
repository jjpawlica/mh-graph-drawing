import React, { Component } from 'react';
import P5Wrapper from './components/P5Wrapper';
import example from './sketches/example';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isPainting: true,
      isRandom: true,
      dots: 0,
      maxDots: 2000,
      red: 255,
      green: 255,
      blue: 255,
      shouldSketchReset: false
    };
  }

  updateStateHandler = (newState, callback) => this.setState(newState, callback);

  changeMaxDots = event => {
    this.setState({ maxDots: event.target.value });
  };

  changeRedValue = event => {
    this.setState({ red: event.target.value });
  };

  changeGreenValue = event => {
    this.setState({ green: event.target.value });
  };

  changeBlueValue = event => {
    this.setState({ blue: event.target.value });
  };

  toggleRandomColor = () => {
    const { isRandom } = this.state;
    this.setState({ isRandom: !isRandom, red: 255, green: 255, blue: 255 });
  };

  togglePaining = () => {
    const { isPainting } = this.state;
    this.setState({ isPainting: !isPainting });
  };

  resetSketch = () => {
    const { shouldSketchReset } = this.state;
    this.setState({ dots: 0, isPainting: true, shouldSketchReset: !shouldSketchReset });
  };

  render() {
    const { red, green, blue, maxDots, isPainting, isRandom, shouldSketchReset, dots } = this.state;
    return (
      <div className="container">
        <h1 className="header">p5 React Wrapper</h1>
        <div className="canvas">
          <P5Wrapper
            sketch={example}
            sketchValues={{ red, green, blue, maxDots, isPainting, isRandom, shouldSketchReset }}
            updateStateHandler={this.updateStateHandler}
          />
        </div>
        <div className="control">
          <h2>{`Dots painted: ${dots}`}</h2>
          <label htmlFor="randomColor">
            Random color:
            <input
              type="checkbox"
              id="randomColor"
              checked={isRandom}
              onChange={this.toggleRandomColor}
            />
          </label>
          <br />
          <label htmlFor="redValue">
            Red:
            <input
              type="range"
              id="redValue"
              value={red}
              min="0"
              max="255"
              step="1"
              onChange={this.changeRedValue}
            />
          </label>
          <br />
          <label htmlFor="greenValue">
            Green:
            <input
              type="range"
              id="greenValue"
              value={green}
              min="0"
              max="255"
              step="1"
              onChange={this.changeGreenValue}
            />
          </label>
          <br />
          <label htmlFor="blueValue">
            Blue:
            <input
              type="range"
              id="blueValue"
              value={blue}
              min="0"
              max="255"
              step="1"
              onChange={this.changeBlueValue}
            />
          </label>
          <br />
          <button type="button" onClick={this.togglePaining} disabled={dots >= maxDots}>
            {!isPainting ? 'START' : 'STOP'}
          </button>
          <button type="button" onClick={this.resetSketch} disabled={isPainting}>
            RESET
          </button>
        </div>
      </div>
    );
  }
}

export default App;
