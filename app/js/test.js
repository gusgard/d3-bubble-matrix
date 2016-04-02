var data = {
  columns: ['the', 'cake', 'isss', 'aaaa'],
  rows: [
        {name: 'foos aaaa', values: [0.13  ,0.31, 0.97, 0.7]},
        {name: 'bara', values: [0.98 ,0.27, 0.64, 0.4]},
        {name: 'baza', values: [0.94 ,0.07, 0.27, 0.9]},
        {name: 'gloa', values: [0.3, 0.54, 0.23, 0.3]}
    ]
  };


var matrix = new BubbleMatrix({
  // root: element[0],
  data: data,
  height: 600,
  width: 800
  // tooltip: $slTooltipManager,
  // onClick: onClick
});
// Render it.
matrix.render();
