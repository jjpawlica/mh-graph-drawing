const data = [
  {
    id: 'a',
    value: '10',
    neighbors: ['c', 'g']
  },
  {
    id: 'b',
    value: '11',
    neighbors: ['c', 'e', 'f']
  },
  {
    id: 'c',
    value: '12',
    neighbors: ['a', 'b', 'd', 'e']
  },
  {
    id: 'd',
    value: '13',
    neighbors: ['c']
  },
  {
    id: 'e',
    value: '14',
    neighbors: ['b', 'c']
  },
  {
    id: 'f',
    value: '15',
    neighbors: ['b']
  },
  {
    id: 'g',
    value: '16',
    neighbors: ['a']
  }
];

export default data;
