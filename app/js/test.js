var data = {
  columns: ['2013', '2014', '2015', '2016', '2017'],
  rows: [
        {name: 'What ever!!', values: [0.99  ,0.2, 0.3, 0.4, 0.7]},
        {name: 'What?????', values: [0.5 ,0.6, 0.7, 0.8, 0.5]},
        {name: 'Really?', values: [0.94 ,0.07, 0.27, 0.9, 0.5]},
        {name: 'Hey men', values: [0.3, 0.54, 0.99, 0.3, 0.2]}
    ]
  };


var matrix = new BubbleMatrix({
  // root: element[0],
  // root: element[0],
  // reverseColor: true,
  // hideTooltip: true,
  // tooltip: d3.tip()
  //   .offset([-10, 0])
  //   .html(value => 'Value: ' + value),
  // hideLeftTitle: true,
  // hideRightTitle: true,
  // hideTopTitle: true,
  // hideBottomTitle: true,
  id: 'bubble',
  data: data,
  height: 600,
  // width: 800,
  onClick: val => alert(`Value ${val}`)
})

// Render it.
matrix.render();
