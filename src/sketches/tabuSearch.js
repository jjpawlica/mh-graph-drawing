/* eslint-disable prefer-destructuring */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */

// Title: Tabu Search
// Author: Jakub Pawlica
// Based on:

import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const width = 600;
  const height = 600;

  let counter = 0;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.calculateFitness = g => {};

  p.drawEdges = g => {
    for (const edge of g.edges) {
      // Find start and end node of given edge so we can their X and Y position
      const start = g.nodes.find(node => node.id === edge.source);
      const end = g.nodes.find(node => node.id === edge.target);
      p.line(start.x, start.y, end.x, end.y);
    }
  };

  p.generateAlternativeSolution = g => {};

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(51);
    p.frameRate(60);

    // Fill nodes array and set random position for each node
    for (const index in data) {
      nodes[index] = {
        ...data[index],
        x: p.random(200, 400),
        y: p.random(200, 400)
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
    p.noStroke();
    p.fill(255);
    for (const node of graph.nodes) {
      p.ellipse(node.x, node.y, 16, 16);
      p.text(node.id, node.x, node.y - 20);
    }

    // Draw graph's edges
    p.stroke(255);
    p.drawEdges(graph);

    // Updated iteration counter
    counter += 1;

    // Updated state in react app
    p.updateStateHandler({ nodes: graph.nodes.length });

    // Stop loop when maximum iterations reached
    if (counter === m) {
      p.noLoop();
    }
  };
};

export default sketch;
