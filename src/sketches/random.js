/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
import data from './graphs/data';
import Graph from './graphs/graph';

const sketch = p => {
  const nodes = [];
  let graph;

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

  p.setup = () => {
    p.createCanvas(600, 600);
    p.background(51);
    p.frameRate(60);

    for (const index in data) {
      nodes[index] = {
        ...data[index],
        x: p.random(0, 600),
        y: p.random(0, 600)
      };
    }

    graph = new Graph(nodes);
    graph.generateEdges();
  };

  p.draw = () => {
    p.background(51);
    p.fill(255);
    p.noStroke();
    for (const node of nodes) {
      p.ellipse(node.x, node.y, 16, 16);
      p.text(node.id, node.x, node.y - 20);
    }
    p.stroke(255);
    p.drawEdges();

    p.updateStateHandler({ nodes: nodes.length });
    p.noLoop();
  };
};

export default sketch;
