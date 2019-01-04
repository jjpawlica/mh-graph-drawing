class Graph {
  constructor(nodes) {
    this.nodes = [...nodes];
    this.edges = [];
    this.adjacencyMatrix = [];
  }

  generateEdges = () => {
    for (const node of this.nodes) {
      for (const neighbor of node.neighbors) {
        this.edges.push({ source: node.id, target: neighbor });
      }
    }
  };

  createAdjacencyMatrix = () => {
    for (const node of this.nodes) {
      // Connections of the current node
      const connections = [];
      // Check all nodes
      for (const target of this.nodes) {
        // Check given connection is actually an edge in the graph
        this.edges.some(edge => edge.source === node.id && edge.target === target.id)
          ? connections.push(1)
          : connections.push(0);
      }
      this.adjacencyMatrix.push(connections);
    }
  };
}

export default Graph;
