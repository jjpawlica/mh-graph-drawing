/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
import data from './graphs/data2';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const length = 200;
  const height = 200;
  const area = length * height;

  const constant = 1; // Force constant
  const startTemperature = 0.1;
  const endTemperature = 0.0001;

  let temperature = startTemperature;
  const m = 500; // Maximum iterations
  const b = p.pow(endTemperature / startTemperature, 1 / m); // Cooling factor

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

  p.arrangeGraph = (g, temp) => {
    const numberOfVertices = g.nodes.length;
    const k = constant * p.sqrt(area / numberOfVertices);
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
        // Distance must be greater then 0 else calculations have no result
        if (distance > 0) {
          // Calculated unit vector coordinates for given node and target node
          const x = (target.x - node.x) / distance;
          const y = (target.y - node.y) / distance;

          // Apply Fruchterman Reingold formula for repulsive force for inverse unit vector
          if (connected) {
            totalForce.x += ((distance * distance) / k) * x;
            totalForce.y += ((distance * distance) / k) * y;
            totalForce.x += ((k * k) / distance) * -x;
            totalForce.y += ((k * k) / distance) * -y;
            // Apply Fruchterman Reingold formula for repulsive force for inverse unit vector
          } else {
            totalForce.x += ((k * k) / distance) * -x;
            totalForce.y += ((k * k) / distance) * -y;
          }
        }
      }
      // Update position of given node by total force times constant
      node.x += temperature * totalForce.x;
      node.y += temperature * totalForce.y;
      // Clamp graph position to canvas area
      node.x = p.min(400, p.max(0, node.x));
      node.y = p.min(400, p.max(0, node.y));
    }
  };

  p.setup = () => {
    p.createCanvas(600, 600);
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

    graph = new Graph(nodes);
    graph.generateEdges();
    graph.createAdjacencyMatrix();
  };

  p.draw = () => {
    p.background(51);
    p.noStroke();
    p.fill(255);
    for (const node of nodes) {
      p.ellipse(node.x, node.y, 16, 16);
      p.text(node.id, node.x, node.y - 20);
    }

    p.arrangeGraph(graph, temperature);

    // Update temperature by constant and update counter
    temperature *= b;
    counter += 1;

    p.stroke(255);
    p.drawEdges();
    p.updateStateHandler({ nodes: nodes.length });
    if (counter === m) {
      p.noLoop();
    }
  };
};

export default sketch;
