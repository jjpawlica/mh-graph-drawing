/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
import data from './graphs/data2';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const edgeLength = 100;
  const c1 = 2; // Attraction force constant
  const c2 = 1 * edgeLength; // Optimal edge length
  const c3 = 1; // Repelent force constant
  const c4 = 0.01 * edgeLength; // Rate of change
  const m = 100 * edgeLength; // Number of iterations

  let counter = 0;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.drawEdges = () => {
    const drawnEdges = [];
    for (const edge of graph.edges) {
      // Find start and end node of given edge so we can their X and Y position
      const start = nodes.find(node => node.id === edge.source);
      const end = nodes.find(node => node.id === edge.target);
      // Check if given edge is already drawn
      const isDrawn = drawnEdges.some(
        drawnEdge =>
          (drawnEdge[0] === start.id && drawnEdge[1] === end.id) ||
          (drawnEdge[0] === end.id && drawnEdge[1] === start.id)
      );
      if (!isDrawn) {
        drawnEdges.push([start.id, end.id]);
        drawnEdges.push([end.id, start.id]);
        p.line(start.x, start.y, end.x, end.y);
      }
    }
  };

  p.arrangeGraph = () => {
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

          // Apply  Eades' formula for attraction force to unit vector
          if (graph.adjacencyMatrix[index][targetIndex]) {
            totalForce.x += c1 * p.log(distance / c2) * x;
            totalForce.y += c1 * p.log(distance / c2) * y;
            // Apply Eades' formula for repulsive force for inverse unit vector
          } else {
            totalForce.x += (c3 / p.sqrt(distance)) * -x;
            totalForce.y += (c3 / p.sqrt(distance)) * -y;
          }
        }
      }
      // Update position of given node by total force times constant
      graph.nodes[index].x += c4 * totalForce.x;
      graph.nodes[index].y += c4 * totalForce.y;
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

    p.arrangeGraph();
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
