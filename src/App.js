import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import RandomGraph from './components/RandomGraph';
import SpringEmbedder from './components/SpringEmbedder';
import ForceDirected from './components/ForceDirected';
import SimulatedAnnealing from './components/SimulatedAnnealing';
import TabuSearch from './components/TabuSearch';
import GeneticAlgorithm from './components/GeneticAlgorithm';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Router>
        <div>
          <h1>Navigation</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Random</Link>
              </li>
              <li>
                <Link to="/spring-embedder/">Spring Embedder</Link>
              </li>
              <li>
                <Link to="/force-directed/">Force Directed</Link>
              </li>
              <li>
                <Link to="/simulated-annealing/">Simulated Annealing</Link>
              </li>
              <li>
                <Link to="/tabu-search/">Tabu Search</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={RandomGraph} />
          <Route path="/spring-embedder/" component={SpringEmbedder} />
          <Route path="/force-directed/" component={ForceDirected} />
          <Route path="/simulated-annealing/" component={SimulatedAnnealing} />
          <Route path="/tabu-search/" component={TabuSearch} />
          <Route path="/genetic-algorithm/" component={GeneticAlgorithm} />
        </div>
      </Router>
    );
  }
}

export default App;
