/* eslint-disable prefer-destructuring */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */

// Title: Genetic Algorithm
// Author: Jakub Pawlica
// Based on: Zhang, Q.; Liu, H.; Zhang, W. & Guo, Y. (2005), Drawing Undirected Graphs with Genetic Algorithms., in Lipo Wang; Ke Chen & Yew-Soon Ong, ed., 'ICNC (3)' , Springer, , pp. 28-36 .

import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const width = 600;
  const height = 600;

  // Original values do not produce pleasing results in this case
  const w1 = 1; // Node distribution weight
  const w2 = 1; // Edge length weight
  const w3 = 1; // Desired edge length weight
  const w4 = 1; // Angle between edges incident ot each point weight
  const w5 = 1; // Angle resolution weight
  const w6 = 1; // Number of crossings weight
  const w7 = 1; // Symmetric weight 1
  const w8 = 1; // Symmetric weight 2

  const m = 5000; // Iterations

  let counter = 0;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.drawEdges = g => {
    for (const edge of g.edges) {
      // Find start and end node of given edge so we can their X and Y position
      const start = g.nodes.find(node => node.id === edge.source);
      const end = g.nodes.find(node => node.id === edge.target);
      p.line(start.x, start.y, end.x, end.y);
    }
  };

  p.calculateFitness = g => {
    // Criteria values contributions to total fitness function
    let m1 = 0;
    let m2 = 0;
    let m3 = 0;
    let m4 = 0;
    let m5 = 0;
    let m6 = 0;
    let m7 = 0;
    let m8 = 0;
  };

  p.generateAlternativeSolution = () => {};

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
    p.updateStateHandler({ nodes: 1 });

    // Stop loop when maximum iterations reached
    if (counter === m) {
      p.noLoop();
    }
  };
};

export default sketch;
