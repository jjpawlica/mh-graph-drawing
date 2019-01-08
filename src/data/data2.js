const data = [
  {
    id: 'a',
    value: '10',
    neighbors: ['b', 'g']
  },
  {
    id: 'b',
    value: '11',
    neighbors: ['c', 'g']
  },
  {
    id: 'c',
    value: '12',
    neighbors: ['d', 'g']
  },
  {
    id: 'd',
    value: '13',
    neighbors: ['e', 'g']
  },
  {
    id: 'e',
    value: '14',
    neighbors: ['f', 'g']
  },
  {
    id: 'f',
    value: '15',
    neighbors: ['a', 'g']
  },
  {
    id: 'g',
    value: '16',
    neighbors: ['a', 'b', 'c', 'd', 'e', 'f']
  }
];

export default data;
