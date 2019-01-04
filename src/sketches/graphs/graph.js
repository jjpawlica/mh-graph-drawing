class Graph {
  constructor(nodes) {
    this.nodes = [...nodes];
    this.edges = [];
  }

  generateEdges = () => {
    this.nodes.forEach(node =>
      node.neighbors.forEach(neighbor => this.edges.push({ source: node.id, target: neighbor }))
    );
  };
}

export default Graph;
