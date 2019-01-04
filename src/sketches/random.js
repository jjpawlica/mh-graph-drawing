/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.drawEdges = () => {
    for (const edge of graph.edges) {
      const start = nodes.find(node => node.id === edge.source);
      const end = nodes.find(node => node.id === edge.target);
      p.line(start.x, start.y, end.x, end.y);
    }
  };

  p.setup = () => {
    p.createCanvas(600, 600);
    p.background(51);
    p.frameRate(60);

    for (const index in data) {
      nodes[index] = {
        ...data[index],
        x: p.random(0, 600),
        y: p.random(0, 600)
      };
    }

    graph = new Graph(nodes);
    graph.generateEdges();
  };

  p.draw = () => {
    p.background(51);
    p.fill(255);
    p.noStroke();
    for (const node of nodes) {
      p.ellipse(node.x, node.y, 16, 16);
    }
    p.stroke(255);
    p.drawEdges();

    for (const node of nodes) {
      if (node.x <= 600 && node.x >= 0 && node.y <= 600 && node.y >= 0) {
        node.x += p.random(-5, 5);
        node.y += p.random(-5, 5);
      }
      if (node.x <= 0) node.x += p.random(0, 5);
      if (node.x >= 600) node.x += p.random(-5, 0);
      if (node.y <= 0) node.y += p.random(0, 5);
      if (node.y >= 600) node.y += p.random(-5, 0);
    }

    p.updateStateHandler({ nodes: nodes.length });
  };
};

export default sketch;
