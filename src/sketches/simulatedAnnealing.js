/* eslint-disable prefer-destructuring */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */

// Title: Simulated Annealing
// Author: Jakub Pawlica
// Based on: Davidson, R. & Harel, D. (1996), 'Drawing Graphs Nicely Using Simulated Annealing.', ACM Trans. Graph. 15 (4), 301-331.
// TODO: Review calculations, better neighborhood function

import data from '../data/data3';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const width = 600;
  const height = 600;

  // Original values do not produce pleasing results in this case
  const d1 = 100; // Node distribution weight
  const d2 = 100; // // Borderlines  weight
  const d3 = 0.00001; // Edge length weight
  const minDistance = 100; //
  const d5 = 1; // Node-edge distance weight
  const d4 = d5 / (minDistance * minDistance); // Edge crossing weight

  const m = 2000; // Iterations

  const maxRadius = 25;
  const minRadius = 1;

  let radius = maxRadius;

  const radiusDelta = p.pow(minRadius / maxRadius, 1 / m); // Radius delta

  const startTemperature = 0.1;
  const endTemperature = 0.0001;

  let temperature = startTemperature;

  const coolingFactor = p.pow(endTemperature / startTemperature, 1 / m); // Cooling factor def. 0.75

  let counter = 0;

  p.redrawHandler = sketchValues => {
    // ({ data } = sketchValues);
  };

  p.updateStateHandler = () => {};

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.calculateEnergy = g => {
    let totalEnergy = 0;
    let crossings = 0;

    // Criteria values contributions to total energy function
    let a = 0; // Node distribution factor
    let b = 0; // Borderlines factor
    let c = 0; // Edge length factor
    let d = 0; // Edge crossing factor
    let e = 0;

    // Calculate node distribution factor
    for (const node of g.nodes) {
      for (const targetNode of g.nodes) {
        // Compute distance between given node and target note
        const distance = p.dist(node.x, node.y, targetNode.x, targetNode.y);
        if (distance > 0) {
          a += d1 / (distance * distance);
        }
      }
    }
    // Calculate borderlines factor (distance from frame's edges)
    for (const node of g.nodes) {
      const right = node.x;
      const left = width - node.x;
      const top = node.y;
      const bottom = height - node.y;
      if (right > 0 && left > 0 && top > 0 && bottom > 0) {
        b +=
          d2 * (1 / (right * right) + 1 / (left * left) + 1 / (top * top) + 1 / (bottom * bottom));
      }
    }

    // Calculate edge length factor
    for (const edge of g.edges) {
      const start = g.nodes.find(node => node.id === edge.source);
      const end = g.nodes.find(node => node.id === edge.target);
      const distance = p.dist(start.x, start.y, end.x, end.y);
      c += d3 * distance * distance;
    }

    // Calculate edge crossing factor
    for (const firstEdge of g.edges) {
      for (const secondEdge of g.edges) {
        const p1 = g.nodes.find(n => n.id === firstEdge.source);
        const p2 = g.nodes.find(n => n.id === firstEdge.target);
        const q1 = g.nodes.find(n => n.id === secondEdge.source);
        const q2 = g.nodes.find(n => n.id === secondEdge.target);
        if (p1.id !== q1.id && p1.id !== q2.id && p2.id !== q1.id && p2.id !== q2.id) {
          const t =
            ((p2.y - p1.y) * (q1.x - p1.x) - (p2.x - p1.x) * (q1.y - p1.y)) *
            ((p2.y - p1.y) * (q2.x - p1.x) - (p2.x - p1.x) * (q2.y - p1.y));
          const u =
            ((q2.y - q1.y) * (p1.x - q1.x) - (q2.x - q1.x) * (p1.y - q1.y)) *
            ((q2.y - q1.y) * (p2.x - q1.x) - (q2.x - q1.x) * (p2.y - q1.y));
          if (u <= 0 && t <= 0) crossings += 1;
          d = d4 * crossings;
        }
      }
    }

    // Calculate node-edge distance
    for (const node of g.nodes) {
      for (const edge of g.edges) {
        let x = 0;
        let y = 0;
        const start = g.nodes.find(n => n.id === edge.source);
        const end = g.nodes.find(n => n.id === edge.target);
        if (node.id !== start.id && node.id !== end.id) {
          const xDistance = end.x - start.x;
          const yDistance = end.y - start.y;
          const u =
            (a * (node.x - start.x) + b * (node.y - start.y)) /
            (xDistance * xDistance + yDistance * yDistance);
          if (u <= 0) {
            x = start.x;
            y = start.y;
          } else if (u >= 1) {
            x = end.x;
            y = end.y;
          } else {
            x = start.x + u * xDistance;
            y = start.y + u * yDistance;
          }
          const distance = p.dist(node.x, node.y, x, y);
          e += d5 / (distance * distance);
        }
      }
    }

    // Sum total energy
    totalEnergy = a + b + c + d + e;
    return totalEnergy;
  };

  p.drawEdges = g => {
    for (const edge of g.edges) {
      // Find start and end node of given edge so we can their X and Y position
      const start = g.nodes.find(node => node.id === edge.source);
      const end = g.nodes.find(node => node.id === edge.target);
      p.line(start.x, start.y, end.x, end.y);
    }
  };

  p.generateAlternativeSolution = (g, r) => {
    // Create copy of the current nodes (deep clone)
    const nodesClone = JSON.parse(JSON.stringify(g.nodes));
    // Pick random node of the graph
    const n = p.int(p.random(0, nodesClone.length));
    // Choose random point on the edge of node's neighborhood with radius r
    const angle = p.random() * p.TWO_PI;
    nodesClone[n].x += p.cos(angle) * r;
    nodesClone[n].y += p.sin(angle) * r;

    // Clamp node position to canvas area
    nodesClone[n].x = p.max(0, p.min(width, nodesClone[n].x));
    nodesClone[n].y = p.max(0, p.min(height, nodesClone[n].y));

    // Create new graph
    const alternativeGraph = new Graph(nodesClone);
    alternativeGraph.generateEdges();
    alternativeGraph.createAdjacencyMatrix();

    return alternativeGraph;
  };

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

    for (const node of graph.nodes) {
      p.noFill();
      p.stroke(255, 0, 0);
      p.ellipse(node.x, node.y, radius, radius);
    }

    // Generate alternative graph layout
    const alternative = p.generateAlternativeSolution(graph, radius);

    // Calculated fitness function for currnet best graph and alternative solution
    const currentEnergy = p.calculateEnergy(graph);
    const alternativeEnergy = p.calculateEnergy(alternative);

    // Check if alternative layout should become current layout (Boltzmann distribution)
    if (p.random() < p.exp((currentEnergy - alternativeEnergy) / temperature)) {
      // Switch current layout to alternative layout
      graph = alternative;
      // Updated temperature and radius of the neighborhood
      temperature *= coolingFactor;
      radius *= radiusDelta;
    }

    // Updated iteration counter
    counter += 1;

    // Updated state in react app
    p.updateStateHandler({ nodes: currentEnergy - alternativeEnergy });

    // Stop loop when maximum iterations reached
    if (counter === m) {
      p.noLoop();
    }
  };
};

export default sketch;
