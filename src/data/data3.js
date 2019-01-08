const data = [
  {
    id: 'a',
    value: '10',
    neighbors: ['d', 'b', 'e']
  },
  {
    id: 'b',
    value: '11',
    neighbors: ['a', 'c', 'f']
  },
  {
    id: 'c',
    value: '12',
    neighbors: ['b', 'd', 'g']
  },
  {
    id: 'd',
    value: '13',
    neighbors: ['a', 'c', 'h']
  },
  {
    id: 'e',
    value: '14',
    neighbors: ['a', 'f', 'h']
  },
  {
    id: 'f',
    value: '15',
    neighbors: ['b', 'e', 'g']
  },
  {
    id: 'g',
    value: '16',
    neighbors: ['c', 'f', 'h']
  },
  {
    id: 'h',
    value: '16',
    neighbors: ['d', 'e', 'g']
  }
];

export default data;
