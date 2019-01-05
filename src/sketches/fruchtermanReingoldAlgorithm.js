/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const length = 100;
  const height = 100;
  const area = length * height;

  const constant = 1; // Force constant
  const startTemperature = 0.1;
  const endTemperature = 0.0001;

  let temperature = startTemperature;
  const b = p.pow(endTemperature / startTemperature, 1 / m); // Cooling factor

  const m = 500; // Maximum iterations
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
      const start = nodes.find(node => node.id === edge.source);
      const end = nodes.find(node => node.id === edge.target);
      p.line(start.x, start.y, end.x, end.y);
    }
  };

  p.arrangeGraph = temperature => {
    const numberOfVertices = nodes.length;
    const k = constant * p.sqrt(area / numberOfVertices);
    for (const index in graph.nodes) {
      const totalForce = { x: 0, y: 0 };
      for (const targetIndex in graph.nodes) {
        // Compute distance between given node and target note
        const distance = p.dist(
          graph.nodes[index].x,
          graph.nodes[index].y,
          graph.nodes[targetIndex].x,
          graph.nodes[targetIndex].y
        );
        // Distance must be greater then 0 else calculations have no result
        if (distance > 0) {
          // Calculated unit vector coordinates for given node and target node
          const x = (graph.nodes[targetIndex].x - graph.nodes[index].x) / distance;
          const y = (graph.nodes[targetIndex].y - graph.nodes[index].y) / distance;
          // Apply  Fruchterman Reingold formula for attraction and repulsive force to unit vector (adjacent nodes)
          if (graph.adjacencyMatrix[index][targetIndex]) {
            totalForce.x += ((distance * distance) / k) * x;
            totalForce.y += ((distance * distance) / k) * y;
            totalForce.x += ((k * k) / distance) * -x;
            totalForce.y += ((k * k) / distance) * -y;
            // Apply Fruchterman-Reingold formula for repulsive force for inverse unit vector
          } else {
            totalForce.x += ((k * k) / distance) * -x;
            totalForce.y += ((k * k) / distance) * -y;
          }
        }
      }
      // Update position of given node by total force times constant
      graph.nodes[index].x += temperature * totalForce.x;
      graph.nodes[index].y += temperature * totalForce.y;
      // Clamp graph position to canvas area
      graph.nodes[index].x = p.min(400, p.max(0, graph.nodes[index].x));
      graph.nodes[index].y = p.min(400, p.max(0, graph.nodes[index].y));
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

    p.arrangeGraph(temperature);

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
