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

  const population = []; // [graph, fitnessScore] x 30
  const nextPopulation = [];
  const populationFitness = [];

  const populationSize = 30;
  const generationsNumber = 1000;

  const crossoverProbability = 0.75;
  const mutationProbability = 0.25;
  const inversionProbability = 0.2;

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
    const numberOfNode = g.nodes.length;
    const numberOfEdges = g.edges.length;
    const idealEdgeLength = p.sqrt((width * height) / numberOfNode);
    const centerX = width / 2;
    const centerY = height / 2;

    let crossings = 0;

    // Criteria values contributions to total fitness function
    let m1 = 0;
    let m2 = 0;
    let m3 = 0;
    let m4 = 0;
    let m5 = 0;
    let m6 = 0;
    let m7 = 0;
    let m8 = 0;

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

    // Calculate ideal edge length factor
    for (const edge of g.edges) {
      const start = g.nodes.find(node => node.id === edge.source);
      const end = g.nodes.find(node => node.id === edge.target);
      const distance = p.dist(start.x, start.y, end.x, end.y);
      m3 += ((distance - idealEdgeLength) * (distance - idealEdgeLength)) / numberOfEdges;
    }

    // Calculate angle between edges incident ot each point weight and angle resolution factor
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

            const angle = p.acos(dotProduct / (firstEdgeLength * secondEdgeLength));
            const difference = angle - p.TWO_PI / node.neighbors.length;

            // For pair and it's reverse increase angular resolution factor
            m4 += 2 * angle;
            m5 += (2 * (difference * difference)) / node.neighbors.length;
          }
        }
      }
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
        }
      }
    }

    m6 = crossings + 1;

    // Calculate distance from node to center factor
    for (const node of g.nodes) {
      const distance = p.dist(node.x, node.y, centerX, centerY);
      if (distance > 0) {
        m7 += 1 / (distance * distance);
      }
    }

    let distanceOfAllNodesToCenter = 0;
    for (const node of g.nodes) {
      const distance = p.dist(node.x, node.y, centerX, centerY);
      distanceOfAllNodesToCenter += distance;
    }

    // Calculate symmetry factor
    for (const node of g.nodes) {
      const distance = p.dist(node.x, node.y, centerX, centerY);
      m8 +=
        ((distance - distanceOfAllNodesToCenter / numberOfNode) *
          (distance - distanceOfAllNodesToCenter / numberOfNode)) /
        numberOfNode;
    }

    const totalFitness =
      w1 / m1 + w2 / m2 + w3 / m3 + w4 / m4 + w5 / m5 + w6 / m6 + w7 / m7 + w8 / m8;
    return totalFitness;
  };

  p.generateAlternativeSolution = () => {};

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(51);
    p.frameRate(60);

    // Fill nodes array
    for (const index in data) {
      nodes[index] = {
        ...data[index]
      };
    }

    for (let i = 0; i < populationSize; i += 1) {
      const nodesClone = JSON.parse(JSON.stringify(nodes));

      const graph = new Graph(nodesClone);
      graph.generateEdges();
      graph.createAdjacencyMatrix();

      for (const index in graph.nodes) {
        graph.nodes[index] = {
          ...graph.nodes[index],
          x: p.random(0, 600),
          y: p.random(0, 600)
        };
      }

      population.push(graph);
    }
  };

  p.draw = () => {
    // Draw best graph's nodes
    p.background(51);
    p.noStroke();

    // Calculate fitness function for each member in population
    for (const member of population) {
      const fitness = p.calculateFitness(member);
      populationFitness.push(fitness);
    }

    // Calculate fitness inverse
    const populationFitnessInverse = populationFitness.map(n => 1 / n);

    // Calculate average and standard deviation of population
    const populationAvg =
      populationFitnessInverse.reduce((a, b) => a + b, 0) / populationFitness.length;
    const populationStd = p.sqrt(
      populationFitnessInverse.reduce((sq, n) => sq + p.pow(n - populationAvg, 2), 0) /
        populationFitnessInverse.length
    );

    // Perform sigma proportional transformation on each member fitness value
    const populationNormalizedFitness = populationFitnessInverse.map(n =>
      populationStd > 0 ? 1 + (n - populationAvg) / (2 * populationStd) : 1
    );

    // Find best member
    const bestMemberScore = populationFitness.reduce((a, b) => Math.min(a, b));
    const bestMemberIndex = populationFitness.findIndex(score => score === bestMemberScore);
    const bestMember = population[bestMemberIndex];

    // Draw best member graph
    p.fill(255);
    for (const node of bestMember.nodes) {
      p.ellipse(node.x, node.y, 16, 16);
      p.text(node.id, node.x, node.y - 20);
    }

    // Draw best member graph's edges
    p.stroke(255);
    p.drawEdges(bestMember);

    // Perform elitist fitness proportionate selection (should add n-1 member because best member will be added at the end)
    const populationFitnessSum = populationNormalizedFitness.reduce((a, b) => a + b, 0);
    const weights = populationNormalizedFitness.map(n => n / populationFitnessSum);
    for (let i = 0; i < population.length - 2; i += 1) {
      const randomValue = p.random();
      let totalProbability = 0;
      for (let j = 0; j < weights.length; j += 1) {
        totalProbability += weights[j];
        if (totalProbability > randomValue) {
          nextPopulation.push(population[j]);
          break;
        }
      }
    }

    // Apply crossover operator
    for (let i = 0; i < nextPopulation.length; i += 1) {
      if (i % 2 === 0) {
        const randomValue = p.random();
        if (randomValue > crossoverProbability) {
          console.log(i, i + 1, randomValue > crossoverProbability);
        }
      }
    }
    // Apply non-uniform mutation

    // Apply single-vertex-neighborhood mutation

    // Apply inversion operator

    // Add best graph to next population

    // Updated iteration counter
    counter += 1;
    //console.log(nextPopulationPairs);

    // Updated state in react app
    // p.updateStateHandler({ nodes: bestMemberIndex });

    // Stop loop when maximum iterations reached
    // if (counter === generationNumber) {
    p.noLoop();
    // }
  };
};

export default sketch;
