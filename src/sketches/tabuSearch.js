/* eslint-disable prefer-destructuring */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */

// Title: Tabu Search
// Author: Jakub Pawlica
// Based on: Dib, F. K. & Rodgers, P. (2014), A Tabu Search Based Approach for Graph Layout., in Erland Jungert, ed., 'DMS' , Knowledge Systems Institute Graduate School, , pp. 283-291.
// Based on: Stott, J.M., & Rodgers, P. (2006). Automatic Metro Map Design Techniques.

import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  const tabu = [];
  let graph;

  const width = 600;
  const height = 600;

  const w1 = 10;
  const w2 = 0.00001;
  const w3 = 0.1;
  const w4 = 0.001;

  const m = 5000; // Iterations

  const maxSide = 100;
  const minSide = 2;

  let side = maxSide;

  const sideDelta = p.pow(minSide / maxSide, 1 / m); // Radius delta

  let counter = 0;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.calculateFitness = g => {
    let totalFitness = 0;
    let crossings = 0;

    // Criteria values contributions to total fitness function
    let m1 = 0; // Node distribution factor
    let m2 = 0; // Edge length factor
    let m3 = 0; // Edge crossing factor
    let m4 = 0; // Angular resolution factor

    // Calculate node distribution factor
    for (const node of g.nodes) {
      for (const targetNode of g.nodes) {
        // Compute distance between given node and target note
        const distance = p.dist(node.x, node.y, targetNode.x, targetNode.y);
        if (distance > 0) {
          m1 += 1 / (distance * distance);
        }
      }
    }

    // Calculate edge length factor
    for (const edge of g.edges) {
      const start = g.nodes.find(node => node.id === edge.source);
      const end = g.nodes.find(node => node.id === edge.target);
      const distance = p.dist(start.x, start.y, end.x, end.y);
      m2 += distance * distance;
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
          m3 = crossings;
        }
      }
    }

    // Calculate angular resolution factor
    for (const node of g.nodes) {
      // Check if node has more then one connection
      if (node.neighbors.length > 1) {
        // Get angle between each unique pair of edges
        for (let i = 0; i < node.neighbors.length - 1; i += 1) {
          for (let j = i; j < node.neighbors.length - 1; j += 1) {
            const firstTarget = g.nodes.find(n => n.id === node.neighbors[i]);
            const secondTarget = g.nodes.find(n => n.id === node.neighbors[j + 1]);

            // Edges length
            const firstEdgeLenght = p.dist(node.x, node.y, firstTarget.x, firstTarget.y);
            const secondEdgeLenght = p.dist(node.x, node.y, secondTarget.x, secondTarget.y);

            // Vectors representing edges
            const firstVector = { x: firstTarget.x - node.x, y: firstTarget.y - node.y };
            const secondVector = { x: secondTarget.x - node.x, y: secondTarget.y - node.y };

            // Dot product between vectors
            const dotProduct = firstVector.x * secondVector.x + firstVector.y * secondVector.y;

            const angle = 100 * (p.acos(dotProduct / (firstEdgeLenght * secondEdgeLenght)) / p.PI);
            const difference = p.abs(360 / node.neighbors.length - angle);

            // For pair and it's reverse increase angular resolution factor
            m4 += 2 * difference;
          }
        }
      }
    }

    totalFitness = w1 * m1 + w2 * m2 + w3 * m3 + w4 * m4;
    return totalFitness;
  };

  p.drawEdges = g => {
    for (const edge of g.edges) {
      // Find start and end node of given edge so we can their X and Y position
      const start = g.nodes.find(node => node.id === edge.source);
      const end = g.nodes.find(node => node.id === edge.target);
      p.line(start.x, start.y, end.x, end.y);
    }
  };

  p.generateNeigborhood = (g, s) => {
    const neighborhood = [];
    for (const node of g.nodes) {
      const neighbors = [
        [node.x - s / 2, node.y - s / 2],
        [node.x, node.y - s / 2],
        [node.x + s / 2, node.y - s / 2],
        [node.x + s / 2, node.y],
        [node.x + s / 2, node.y + s / 2],
        [node.x, node.y + s / 2],
        [node.x - s / 2, node.y + s / 2],
        [node.x - s / 2, node.y]
      ];
      neighborhood.push(neighbors);
    }
    return neighborhood;
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

    // Updated iteration counter
    const a = p.calculateFitness(graph);

    // Generate neighborhood
    const neighborhood = p.generateNeigborhood(graph, side);
    counter += 1;

    for (const set of neighborhood) {
      for (const point of set) {
        p.fill(0, 255, 0);
        p.ellipse(point[0], point[1], 4, 4);
      }
    }
    // Updated state in react app
    p.updateStateHandler({ nodes: a });

    // Stop loop when maximum iterations reached
    //if (counter === m) {
    p.noLoop();
    //}
  };
};

export default sketch;
