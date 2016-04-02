/**
 * Bubble Matrix.
 *
 * Displays the arc matrix for the overall
 *
 * This chart constructor expects an options object with the following
 * structure:
 *
 * @param {object}      options:       An object with the chart options.
 * @param {number}      options.width: The width of the canvas, not the chart.
 * @param {number}      ops.height: The height of the canvas, not the chart.
 * @param {HTMLElement} options.root:  The container's DOM element.
 * @param {object}      options.data:   The data for the rows, cols and values.
 */
class BubbleMatrix {
  constructor (options) {
    this.selection = d3.select('#bubble');
    this.columns = options.data.columns;
    this.rows = options.data.rows;
    this.name = options.data.name;
    // this.tooltip = options.tooltip;
    // this.onClick = options.onClick;
    this.MAX_RADIUS = options.maxRadius || 26;

    console.log(options.data);
    // Constants
    this.MAX_COLORS = 3;
    this.HORIZONTAL_PADDING = 0.5;
    this.VERTICAL_PADDING = 1.0;
    this.ROW_PADDING = 0;
    this.PADDING = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    };
    this.RECT_SIZE = this.MAX_RADIUS * 2;

    let clientWidth = this.selection.node().parentNode.clientWidth;
    let clientHeight = this.selection.node().parentNode.clientHeight;

    let width = parseInt(options.width, 10) || clientWidth;
    let height = parseInt(options.height, 10) || clientHeight;

    // Create the chart canvas.
    this.container = this.selection
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    this.width = width - this.PADDING.right - this.PADDING.left - this.ROW_PADDING;
    this.height = height - this.PADDING.bottom - this.PADDING.top;

    this.init();
  }

  init () {
    this.scale = {};

    this.scale.x = d3.scale.ordinal()
      .domain(d3.range(0, this.columns.length))
      .rangePoints([0, this.width], this.HORIZONTAL_PADDING);

    this.scale.y = d3.scale.ordinal()
      .domain(d3.range(0, this.rows.length))
      .rangePoints([0, this.height], this.VERTICAL_PADDING);

    this.scale.color = d3.scale.quantize()
      .domain([0, 1])
      .range(d3.range(1, this.MAX_COLORS + 1));

    this.scale.radius = d3.scale.sqrt()
      .range([0, this.MAX_RADIUS]);

    // Information about the center of the chart.
    this.center = {
      x: this.width / 2,
      y: this.height / 2
      // radius: options.centerWidth  // Width of the center circle.
    };
  }

  /**
   * Render the overall matrix inside of the root element.
   */
  render () {
    this
      .renderBackground()
      .renderRows()
      .renderColumns()
      .renderBubbles();
  }

  renderBackground () {
    // horizontal lines
    this.container
      .append('g')
      .attr('class', 'horizontal-lines')
      .selectAll('line')
      .data(this.rows)
      .enter()
      .append('line')
      .attr('y1', (_, i) => this.scale.y(i) + this.PADDING.top)
      .attr('y2', (_, i) => this.scale.y(i) + this.PADDING.top)
      .attr('x1', this.scale.x(0) + this.ROW_PADDING)
      .attr('x2', this.scale.x(this.columns.length - 1) + this.ROW_PADDING);

    // vertical lines
    this.container
      .append('g')
      .attr('class', 'vertical-lines')
      .selectAll('line')
      .data(this.rows)
      .enter()
      .append('line')
      .attr('y1', (_, i) => this.scale.y(0) + this.PADDING.top)
      .attr('y2', (_, i) => this.scale.y(this.rows.length - 1 ))
      .attr('x1', (_, i) => this.scale.x(i) + this.ROW_PADDING)
      .attr('x2', (_, i) => this.scale.x(i) + this.ROW_PADDING)
    return this;
  }

  /**
   * Render the rows of the matrix.
   */
  renderRows () {
    this.container
      .append('g')
      .attr('class', 'left-rows')
      // .attr('transform', 'translate(' + this.ROW_PADDING + ', 0)')
      .selectAll('text')
      .data(this.rows)
      .enter()
      .append('text')
      .attr('class', 'row')
      .attr('x', 0)
      .attr('y', (_, i) => this.scale.y(i) + this.PADDING.top)
      .attr('dy', 5)
      .text(row => row.name);

    this.container
      .append('g')
      .attr('class', 'right-rows')
      // .attr('transform', 'translate(' + this.ROW_PADDING + ', 0)')
      .selectAll('text')
      .data(this.rows)
      .enter()
      .append('text')
      .attr('class', 'row')
      // .attr('x', 0)
      .attr('x', (_, i) => this.scale.x(this.columns.length - 1) + this.ROW_PADDING)
      .attr('y', (_, i) => this.scale.y(i) + this.PADDING.top)
      .attr('dy', 5)
      .text(row => row.name);
    // .on('click', (_, i) => {
    //   console.log(i);
    //   console.log(this.columns[i]);
    //   this.onClick(this.columns[i]);
    // })
    return this;
  }

  /**
   * Render the columns of the matrix.
   */
  renderColumns () {
    this.container
      .append('g')
      .attr('class', 'top-columns')
      .selectAll('text')
      .data(this.columns)
      .enter()
      .append('text')
      .attr('class', 'column')
      .attr('x', (_, i) => this.scale.x(i) + this.ROW_PADDING)
      .attr('y', this.PADDING.top / 2)
      .text(date => date);

    this.container
      .append('g')
      .attr('class', 'bottom-columns')
      .selectAll('text')
      .data(this.columns)
      .enter()
      .append('text')
      .attr('class', 'column')
      .attr('x', (_, i) => this.scale.x(i) + this.ROW_PADDING)
      .attr('y', this.height + this.PADDING.bottom + this.PADDING.top)
      .text(date => date);
    return this;
  }

  /**
   * Render the bubble of the matrix.
   */
  renderBubbles () {
    // d3.select('.left-rows').node().getBBox()
    let bubbles = this.container
      .append('g')
      .attr('class', 'bubbles');

    for (let index = 0; index < this.rows.length; index++) {
      let row = this.rows[index];
      let bubble = bubbles
        .append('g')
        .attr('class', 'row')
        .selectAll('circle')
        .data(row.values)
        .enter();
      bubble
        .append('rect')
        .attr('y', (d) => this.scale.y(index) + this.PADDING.top - this.RECT_SIZE / 2)
        .attr('x', (d, i) => this.scale.x(i) + this.ROW_PADDING - this.RECT_SIZE / 2)
        .attr('width', this.RECT_SIZE)
        .attr('height', this.RECT_SIZE)
        // .on('click', (_, i) => {
        //   this.tooltip.hide();
        //   this.onClick(this.columns[i]);
        // })
        // .on('mousemove', value => {
        //   this.tooltip.moveTo(d3.event.x + 10, d3.event.y - 10);
        //   this.tooltip.setMultiLine(false);
        //   value = (value * 10).toFixed(1);
        //   this.tooltip.setContent(value);
        // })
        // .on('mouseout', () => {
        //   this.tooltip.hide();
        // });
      bubble
        .append('circle')
        .attr('class', d => {
          let color = this.scale.color(d);
          return `bubble-color-${color}`;
        })
        .attr('cy', () => this.scale.y(index) + this.PADDING.top)
        .attr('cx', (_, i) => this.scale.x(i) + this.ROW_PADDING)
        .attr('r', d => this.scale.radius(d))
        // .on('click', (_, i) => {
        //   this.tooltip.hide();
        //   this.onClick(this.columns[i]);
        // })
        // .on('mousemove', value => {
        //   this.tooltip.moveTo(d3.event.x + 10, d3.event.y - 10);
        //   this.tooltip.setMultiLine(false);
        //   value = (value * 10).toFixed(1);
        //   this.tooltip.setContent(value);
        // })
        // .on('mouseout', () => {
        //   this.tooltip.hide();
        // });
    }
    return this;
  }
}
