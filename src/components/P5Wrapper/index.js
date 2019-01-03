/* eslint-disable react/prop-types */
/* eslint-disable new-cap */

import React, { Component } from 'react';
import p5 from 'p5';

class P5Wrapper extends Component {
  constructor() {
    super();
    this.wrapper = React.createRef();
  }

  componentDidMount() {
    const { sketch, sketchValues, updateStateHandler } = this.props;
    this.canvas = new p5(sketch, this.wrapper.current);
    this.canvas.updateStateHandler = updateStateHandler;
    if (this.canvas.redrawHandler) {
      this.canvas.redrawHandler(sketchValues);
    }
  }

  componentDidUpdate(prevProps) {
    const { sketch, sketchValues, updateStateHandler } = this.props;
    if (sketch !== prevProps.sketch) {
      this.canvas.remove();
      this.canvas = new p5(sketch, this.wrapper.current);
      this.canvas.updateStateHandler = updateStateHandler;
    }
    if (this.canvas.redrawHandler) {
      this.canvas.redrawHandler(sketchValues);
    }
  }

  componentWillUnmount() {
    this.canvas.remove();
  }

  render() {
    return <div ref={this.wrapper} />;
  }
}

export default P5Wrapper;
