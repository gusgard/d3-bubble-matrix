let data = {
  columns: ['2013', '2014', '2015', '2016', '2017'],
  rows: [{ name: 'Hey men', values: [0.3, 0.54, 0.99, 0.3, 0.2]},
        { name: 'What?????', values: [0.5 ,0.6, 0.7, 0.8, 0.5]},
        { name: 'Whatever!!', values: [0.99  ,0.2, 0.3, 0.4, 0.7]},
        { name: 'Really?', values: [0.94 ,0.07, 0.27, 0.9, 0.5]}]
};

let config = {
  // root: d3.select('#bubble'),
  selector: '#bubble',
  onClick: val => alert(`Value ${val}`),
  hideRightTitle: true,
  hideBottomTitle: true
};

let matrix = new BubbleMatrix(config);

// Draw the bubble matrix.
matrix.draw(data);
