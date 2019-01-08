/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */

// Title: Spring Embeder
// Author: Jakub Pawlica

import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const width = 600;
  const height = 600;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

  p.updateStateHandler = () => {};

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.drawEdges = () => {
    for (const edge of graph.edges) {
      // Find start and end node of given edge so we can their X and Y position
      const start = nodes.find(node => node.id === edge.source);
      const end = nodes.find(node => node.id === edge.target);
      p.line(start.x, start.y, end.x, end.y);
    }
  };

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(51);
    p.frameRate(60);

    // Fill nodes array and set random position for each node
    for (const index in data) {
      nodes[index] = {
        ...data[index],
        x: p.random(width / 3, (2 * width) / 3),
        y: p.random(height / 3, (2 * height) / 3)
      };
    }

    // Generate new graph, it's edges and corresponding adjacency matrix
    graph = new Graph(nodes);
    graph.generateEdges();
    graph.createAdjacencyMatrix();
  };

  p.draw = () => {
    // Draw graph's nodes
    p.background(51);
    p.fill(255);
    p.noStroke();
    for (const node of nodes) {
      p.ellipse(node.x, node.y, 16, 16);
      p.text(node.id, node.x, node.y - 20);
    }

    // Draw graph's edges
    p.stroke(255);
    p.drawEdges();

    // Updated state in react app
    p.updateStateHandler({ nodes: nodes.length });

    // Stop draw loop
    p.noLoop();
  };
};

export default sketch;
