/* eslint-disable prefer-destructuring */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */

// Title: Tabu Search
// Author: Jakub Pawlica
// Based on: Dib, F. K. & Rodgers, P. (2014), A Tabu Search Based Approach for Graph Layout., in Erland Jungert, ed., 'DMS' , Knowledge Systems Institute Graduate School, , pp. 283-291.

import data from './graphs/data3';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];

  let tabu = [];

  let graph;

  const width = 600;
  const height = 600;

  // Original values do not produce pleasing results in this case
  const w1 = 1; // Node distribution weight
  const w2 = 0.0000001; // Edge length weight
  const w3 = 10; // Edge crossing weigh
  const w4 = 0; // Angular resolution weight

  const m = 1000; // Iterations

  const maxSide = 100;
  const minSide = 2;

  let side = maxSide;

  const sideDelta = p.pow(minSide / maxSide, 1 / m); // Radius delta

  const tabuCutoff = 0.9;
  const tabuDuration = 7;

  let counter = 0;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.normalize = x => 2 * (1 / (1 + p.exp(-x))) - 1;

  p.calculateFitness = g => {
    let totalFitness = 0;
    let crossings = 0;

    // Criteria values contributions to total energy function
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
          m1 += w1 / (distance * distance);
        }
      }
    }

    // Calculate edge length factor
    for (const edge of g.edges) {
      const start = g.nodes.find(node => node.id === edge.source);
      const end = g.nodes.find(node => node.id === edge.target);
      const distance = p.dist(start.x, start.y, end.x, end.y);
      m2 += w2 * distance * distance;
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
          m3 = w3 * crossings;
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
            const firstEdgeLength = p.dist(node.x, node.y, firstTarget.x, firstTarget.y);
            const secondEdgeLength = p.dist(node.x, node.y, secondTarget.x, secondTarget.y);

            // Vectors representing edges
            const firstVector = { x: firstTarget.x - node.x, y: firstTarget.y - node.y };
            const secondVector = { x: secondTarget.x - node.x, y: secondTarget.y - node.y };

            // Dot product between vectors
            const dotProduct = firstVector.x * secondVector.x + firstVector.y * secondVector.y;

            const angle = 100 * (p.acos(dotProduct / (firstEdgeLength * secondEdgeLength)) / p.PI);
            const difference = p.abs(360 / node.neighbors.length - angle);

            // For pair and it's reverse increase angular resolution factor
            m4 += 2 * difference;
          }
        }
      }
    }
    // Sum total energy
    // totalFitness = p.normalize(m1) + p.normalize(m2) + p.normalize(m3) + p.normalize(w4 * m4);
    totalFitness = m1 + m2 + m3 + w4 * m4;

    // console.log(
    //   p.normalize(m1),
    //   p.normalize(m2),
    //   p.normalize(m3),
    //   p.normalize(w4 * m4),
    //   totalFitness
    // );
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

  p.generateAlternativeSolution = (g, n, nodeIndex, neighborIndex) => {
    // Create copy of the current nodes (deep clone)
    const nodesClone = JSON.parse(JSON.stringify(g.nodes));
    nodesClone[nodeIndex].x = n[nodeIndex][neighborIndex][0];
    nodesClone[nodeIndex].y = n[nodeIndex][neighborIndex][1];

    // Create new graph
    const alternativeGraph = new Graph(nodesClone);
    alternativeGraph.generateEdges();
    alternativeGraph.createAdjacencyMatrix();

    return alternativeGraph;
  };

  p.isTabu = (pointX, pointY) => tabu.some(point => point[0] === pointX && point[1] === pointY);

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(51);
    p.frameRate(60);

    // Fill nodes array and set random position for each node
    for (const index in data) {
      nodes[index] = {
        ...data[index],
        x: p.random(0, 600),
        y: p.random(0, 600)
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

    // Generate neighborhood
    const neighborhood = [];

    for (const node of graph.nodes) {
      const neighbors = [];
      if (node.x - side / 2 > 0 && node.y - side / 2 > 0) {
        neighbors.push([node.x - side / 2, node.y - side / 2]);
      }
      if (node.x - side / 2 > 0) {
        neighbors.push([node.x - side / 2, node.y]);
      }
      if (node.x - side / 2 > 0 && node.y + side / 2 < height) {
        neighbors.push([node.x - side / 2, node.y + side / 2]);
      }
      if (node.x + side / 2 < width && node.y - side / 2 > 0) {
        neighbors.push([node.x + side / 2, node.y - side / 2]);
      }
      if (node.x + side / 2 < width) {
        neighbors.push([node.x + side / 2, node.y]);
      }
      if (node.x + side / 2 < width && node.y + side / 2 < height) {
        neighbors.push([node.x + side / 2, node.y + side / 2]);
      }
      if (node.y - side / 2 > 0) {
        neighbors.push([node.x, node.y - side / 2]);
      }
      if (node.y + side / 2 < height) {
        neighbors.push([node.x, node.y + side / 2]);
      }
      neighborhood.push(neighbors);
    }

    for (const set of neighborhood) {
      for (const point of set) {
        p.fill(0, 255, 0);
        p.ellipse(point[0], point[1], 4, 4);
      }
    }

    // Decrease tabu duration for each element in tabu list
    if (tabu.length > 0) {
      const tabuClone = JSON.parse(JSON.stringify(tabu));
      for (let i = 0; i < tabuClone.length; i += 1) {
        tabuClone[i][2] -= 1;
      }
      tabu = tabuClone;
    }

    // // Remove points from tabu if their duration = 0
    tabu = tabu.filter(point => point[2] > 0);

    const currentFitness = p.calculateFitness(graph);
    let bestFitness = currentFitness;

    let chosenNode = 0;
    let chosenPoint = 0;

    // Check fitness function in every possible alterative solution
    for (let i = 0; i < neighborhood.length; i += 1) {
      for (let j = 0; j < neighborhood[i].length; j += 1) {
        // Check if neighbor is not in tabu list
        const isTabu = p.isTabu(neighborhood[i][j][0], neighborhood[i][j][1]);
        if (!isTabu) {
          // Calculated fitness function for current best graph and alternative solution
          const alternative = p.generateAlternativeSolution(graph, neighborhood, i, j);
          const alternativeFitness = p.calculateFitness(alternative);
          if (alternativeFitness < bestFitness) {
            bestFitness = alternativeFitness;
            chosenNode = i;
            chosenPoint = j;
          }
          // Add bad solutions to tabu list
          if (currentFitness / alternativeFitness > tabuCutoff) {
            tabu.push([neighborhood[i][j][0], neighborhood[i][j][1], tabuDuration]);
          }
        }
      }
    }

    const bestAlternative = p.generateAlternativeSolution(
      graph,
      neighborhood,
      chosenNode,
      chosenPoint
    );

    tabu.push([
      neighborhood[chosenNode][chosenPoint][0],
      neighborhood[chosenNode][chosenPoint][1],
      tabuDuration
    ]);

    // for (const node of bestAlternative.nodes) {
    //   p.fill(0, 255, 0, 100);
    //   p.noStroke();
    //   p.ellipse(node.x, node.y, 16, 16);
    //   p.text(node.id, node.x, node.y - 20);
    // }

    // // Draw graph's edges
    // p.stroke(0, 255, 0);
    // p.drawEdges(bestAlternative);

    graph = bestAlternative;

    side *= sideDelta;
    counter += 1;

    // Updated state in react app
    p.updateStateHandler({ nodes: currentFitness });
    // Stop loop when maximum iterations reached
    if (counter === m) {
      p.noLoop();
    }
  };
};

export default sketch;
