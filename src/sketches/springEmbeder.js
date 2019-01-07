/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */

// Title: Spring Embeder
// Author: Jakub Pawlica
// Based on: Eades, P. (1984), 'A heuristic for graph drawing', Congressus Numerantium 42 , 149-160.

import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const width = 600;
  const height = 600;

  // Original values do not produce pleasing results in this case
  const c1 = 1; // Attraction force constant - original value = 2
  const c2 = 100; // Optimal edge length - original value = 1
  const c3 = 1; // Repelent force constant - original value = 1
  const c4 = 10; // Rate of change - original value =0.01
  const m = 1000; // Number of iterations - original value = 500

  let counter = 0;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

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

  p.arrangeGraph = g => {
    for (const node of g.nodes) {
      const totalForce = { x: 0, y: 0 };
      for (const target of g.nodes) {
        const connected = g.edges.some(
          edge =>
            (edge.source === node.id && edge.target === target.id) ||
            (edge.source === target.id && edge.target === node.id)
        );
        // Compute distance between given node and target note
        const distance = p.dist(node.x, node.y, target.x, target.y);
        // Distance must be greater then 0 else calculations have no result
        if (distance > 0) {
          // Calculated unit vector coordinates for given node and target node
          const x = (target.x - node.x) / distance;
          const y = (target.y - node.y) / distance;

          // Apply  Eades' formula for attraction force to unit vector if edges are connected
          if (connected) {
            totalForce.x += c1 * p.log(distance / c2) * x;
            totalForce.y += c1 * p.log(distance / c2) * y;
          }

          // Apply Eades' formula for repulsive force for inverse unit vector
          else {
            totalForce.x += (c3 / p.sqrt(distance)) * -x;
            totalForce.y += (c3 / p.sqrt(distance)) * -y;
          }
        }
      }
      // Move given node by total force working on it multiplied by constant C4
      node.x += c4 * totalForce.x;
      node.y += c4 * totalForce.y;
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
    p.noStroke();
    p.fill(255);
    for (const node of nodes) {
      p.ellipse(node.x, node.y, 16, 16);
      p.text(node.id, node.x, node.y - 20);
    }

    // Draw graph's edges
    p.stroke(255);
    p.drawEdges();

    // On each draw loop update graph
    p.arrangeGraph(graph);

    // Updated iteration counter
    counter += 1;

    // Updated state in react app
    p.updateStateHandler({ nodes: nodes.length });

    // Stop loop when maximum iterations reached
    if (counter === m) {
      p.noLoop();
    }
  };
};

export default sketch;
