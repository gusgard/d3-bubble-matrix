var data = {
  columns: ['the', 'cake', 'isss', 'aaaa'],
  rows: [
        {name: 'foos aaasssa', values: [0.1  ,0.2, 0.3, 0.4]},
        {name: 'bara', values: [0.5 ,0.6, 0.7, 0.8]},
        {name: 'baza', values: [0.94 ,0.07, 0.27, 0.9]},
        {name: 'gloa', values: [0.3, 0.54, 0.99, 0.3]}
    ]
  };


var matrix = new BubbleMatrix({
  // root: element[0],
  // root: element[0],
  // reverseColor: true,
  horizontalPadding: 0.1,
  id: 'bubble',
  data: data,
  height: 600,
  width: 800,
  onClick: val => alert(`Value ${val}`)
})

// Render it.
matrix.render();
