/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

  const width = 600;
  const height = 600;

  const d1 = 1;
  const d2 = 1;

  let counter = 0;

  p.redrawHandler = sketchValues => {
    // ({ } = sketchValues);
  };

  p.resetSketch = () => {
    p.clear();
    p.setup();
  };

  p.calculatedEnergy = g => {
    let totalEnergy = 0;
    let a = 0;
    let b = 0;
    // Node distribution factor
    for (const node of graph.nodes) {
      for (const targetNode of graph.nodes) {
        // Compute distance between given node and target note
        const distance = p.dist(node.x, node.y, targetNode.x, targetNode.y);
        if (distance > 0) {
          a += d1 / distance;
        }
      }
    }
    // Borderlines  factor
    for (const node of graph.nodes) {
      const right = node.x;
      const left = width - node.x;
      const top = node.y;
      const bottom = height - node.y;
      if (right > 0 && left > 0 && top > 0 && bottom > 0) {
        b +=
          d2 * (1 / (right * right) + 1 / (left * left) + 1 / (top * top) + 1 / (bottom * bottom));
      }
    }

    // Edge length factor

    totalEnergy = a + b;
    return totalEnergy;
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

  p.arrangeGraph = () => {};

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

    const a = p.calculatedEnergy(graph);
    counter += 1;

    p.stroke(255);
    p.drawEdges();
    p.updateStateHandler({ nodes: a });
    p.noLoop();
  };
};

export default sketch;
