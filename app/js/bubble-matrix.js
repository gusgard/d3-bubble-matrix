/**
 * Bubble Matrix.
 *
 * Displays the an bubble matrix
 *
 * This constructor expects an options object with the following structure:
 *
 * @param {object}      options:       An object with the matrix options.
 * @param {HTMLElement} options.root:  The container's DOM element.
 * @param {string}      options.selector:    The selector of the container to be use.
 * @param {number}      options.width: The width of the canvas, not the matrix.
 * @param {number}      options.height:    The height of the canvas, not the matrix.
 * @param {number}      options.maxRadius: The radius of the circles.
 * @param {function}    options.onClick:  The function to trigger when click a bubble.
 * @param {number}      options.maxColors: The numbers of colors to used.
 * @param {boolean}     options.reverseColor:  Reverse the color scale.
 * @param {object}      options.padding: Padding for the matrix.
 * @param {function}    options.tooltip: Function to show tooltip, need to have show and hide method.
 * @param {boolean}     options.hideTooltip: Hide the tooltip for the bubbles.
 * @param {object}      options.classNames: The names of the classes used for each element.
 * @param {boolean}     options.hideLeftTitle: Hide the left title.
 * @param {boolean}     options.hideRightTitle: Hide the right title.
 * @param {boolean}     options.hideTopTitle: Hide the top title.
 * @param {boolean}     options.hideBottomTitle: Hide the bottom title.
 * @param {boolean}     options.duration: The duration of the animation.
 */
class BubbleMatrix {
  constructor (options) {
    if (!options.root && !options.selector) {
      throw 'Missing root or id';
    }
    this.selection = options.root || d3.select(options.selector);
    this.onClick = options.onClick || false;
    this.hideLeftTitle = options.hideLeftTitle || false;
    this.hideRightTitle = options.hideRightTitle || false;
    this.hideTopTitle = options.hideTopTitle || false;
    this.hideBottomTitle = options.hideBottomTitle || false;
    this.duration = options.duration || 2000;
    // Constants
    this.HORIZONTAL_PADDING = 0.5;
    this.VERTICAL_PADDING = 0.5;
    this.MAX_RADIUS = options.maxRadius || 26;
    this.MAX_COLORS = options.maxColors || 9;
    this.PADDING = options.padding || { top: 20, right: 0, bottom: 20, left: 10 };
    this.RECT_SIZE = this.MAX_RADIUS * 2;
    this.COLOR_DOMAIN = options.reverseColor ? [1, 0] : [0, 1];
    this.CLASS = options.classNames || {
      bubbleMatrix: 'bubble-matrix',
      leftRows: 'left-rows',
      rightRows: 'right-rows',
      horizontalLines: 'horizontal-lines',
      verticalLines: 'vertical-lines',
      row: 'row',
      column: 'column',
      topColumns: 'top-columns',
      bottomColumns: 'bottom-columns',
      rects: 'rects',
      bubbles: 'bubbles',
      color: 'bubble-color-'
    };

    let clientWidth = this.selection.node().parentNode.clientWidth;
    let clientHeight = this.selection.node().parentNode.clientHeight;

    let width = parseInt(options.width, 10) || clientWidth;
    let height = parseInt(options.height, 10) || clientHeight;

    // Create the matrix canvas.
    this.container = this.selection
      .append('svg')
      .attr('class', this.CLASS.bubbleMatrix)
      .attr('width', width)
      .attr('height', height);

    this.width = width - this.PADDING.right - this.PADDING.left;
    this.height = height - this.PADDING.bottom - this.PADDING.top;

    this.events = {};
    this.hideTooltip = options.hideTooltip || false;

    if (!this.hideTooltip) {
      this.tooltip = options.tooltip || d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(value => 'Value: ' + value);
      // Invoke the tip in the context of your visualization
      this.container.call(this.tooltip);

      this.events.mouseover = this.tooltip.show;
      this.events.mouseout = this.tooltip.hide;
    }
    if (this.onClick) {
      this.events.click = this.onClick.bind(this);
    }
  }

  init () {
    this.columns = this.data.columns;
    this.rows = this.data.rows;
    this.scale = {};

    this.scale.y = d3.scale.ordinal()
      .domain(d3.range(0, this.rows.length))
      .rangePoints([0, this.height], this.VERTICAL_PADDING);

    this.scale.color = d3.scale.quantize()
      .domain(this.COLOR_DOMAIN)
      .range(d3.range(1, this.MAX_COLORS + 1));

    this.scale.radius = d3.scale.sqrt().range([0, this.MAX_RADIUS]);
    return this;
  }

  initScaleX () {
    let start = 0;
    if (!this.hideLeftTitle) {
      let leftWidth = d3.select(`.${this.CLASS.leftRows}`).node().getBBox().width;
      start = leftWidth + this.PADDING.left;
    }
    let rightWidth = this.hideRightTitle ? 0 : d3.select(`.${this.CLASS.rightRows}`).node().getBBox().width;
    let end = this.width - rightWidth + this.PADDING.left;
    this.scale.x = d3.scale.ordinal()
      .domain(d3.range(0, this.columns.length))
      .rangePoints([start, end], this.HORIZONTAL_PADDING);

    return this;
  }

  /**
   * Draw the bubble matrix.
   */
  draw (data) {
    if (!data) {
      throw 'Missing data';
    }
    this.data = data;
    this
      .init()
      .drawLeftRows()
      .drawRightRows()
      .initScaleX()
      .drawBackground()
      .drawTopColumns()
      .drawBottomColumns()
      .drawRects()
      .drawBubbles();
  }

  /**
   * Draw horizontal and vertical lines.
   */
  drawBackground () {
    // horizontal lines
    this.container
      .append('g')
      .attr('class', this.CLASS.horizontalLines)
      .selectAll('line')
      .data(this.rows)
      .enter()
      .append('line')
      .attr('x1', this.scale.x(0))
      .attr('y1', (_, i) => this.scale.y(i) + this.PADDING.top)
      .attr('x2', this.scale.x(0))
      .attr('y2', (_, i) => this.scale.y(i) + this.PADDING.top)
      .transition()
      .duration(this.duration / 2)
      .attr('x2', this.scale.x(this.columns.length - 1));

    // vertical lines
    this.container
      .append('g')
      .attr('class', this.CLASS.verticalLines)
      .selectAll('line')
      .data(this.columns)
      .enter()
      .append('line')
      .attr('x1', (_, i) => this.scale.x(i))
      .attr('y1', (_, i) => this.scale.y(0))
      .attr('x2', (_, i) => this.scale.x(i))
      .attr('y2', (_, i) => this.scale.y(0))
      .transition()
      .duration(this.duration / 2)
      .attr('y2', (_, i) => this.scale.y(this.rows.length - 1));

    return this;
  }

  /**
   * Draw the left rows of the matrix.
   */
  drawLeftRows () {
    if (this.hideLeftTitle) return this;
    this.container
      .append('g')
      .attr('class', this.CLASS.leftRows)
      .selectAll('text')
      .data(this.rows)
      .enter()
      .append('text')
      .attr('class', this.CLASS.row)
      .attr('x', this.PADDING.left)
      .attr('y', (_, i) => this.scale.y(i) + this.PADDING.top)
      .attr('dy', 5)
      .text(row => row.name);
    return this;
  }

  /**
   * Draw the right rows of the matrix.
   */
  drawRightRows () {
    if (this.hideRightTitle) return this;
    let leftWidth = this.hideLeftTitle ? 0 : d3.select(`.${this.CLASS.leftRows}`).node().getBBox().width;

    this.container
      .append('g')
      .attr('class', this.CLASS.rightRows)
      .selectAll('text')
      .data(this.rows)
      .enter()
      .append('text')
      .attr('class', this.CLASS.row)
      .attr('x', (_, i) => this.width + this.PADDING.right + this.PADDING.left)
      .attr('y', (_, i) => this.scale.y(i) + this.PADDING.top)
      .attr('dy', 5)
      .text(row => row.name);

    return this;
  }

  /**
   * Draw the top columns of the matrix.
   */
  drawTopColumns () {
    if (this.hideTopTitle) return this;

    this.container
      .append('g')
      .attr('class', this.CLASS.topColumns)
      .selectAll('text')
      .data(this.columns)
      .enter()
      .append('text')
      .attr('class', this.CLASS.column)
      .attr('x', (_, i) => this.scale.x(i))
      .attr('y', this.PADDING.top)
      .text(date => date);

    return this;
  }

  /**
   * Draw the bottom columns of the matrix.
   */
  drawBottomColumns () {
    if (this.hideBottomTitle) return this;

    this.container
      .append('g')
      .attr('class', this.CLASS.bottomColumns)
      .selectAll('text')
      .data(this.columns)
      .enter()
      .append('text')
      .attr('class', this.CLASS.column)
      .attr('x', (_, i) => this.scale.x(i))
      .attr('y', this.height + this.PADDING.bottom + this.PADDING.top)
      .text(date => date);

    return this;
  }

  /**
   * Draw the rects of the matrix.
   */
  drawRects () {
    let _this = this;
    let bubbles = this.container.append('g').attr('class', this.CLASS.rects);

    for (let index = 0; index < this.rows.length; index++) {
      let row = this.rows[index];
      let bubble = bubbles
        .append('g')
        .attr('class', this.CLASS.row)
        .selectAll('rect')
        .data(row.values)
        .enter();

      bubble
        .append('rect')
        .attr('y', (d) => this.scale.y(index) + this.PADDING.top - this.RECT_SIZE / 2)
        .attr('x', (d, i) => this.scale.x(i) - this.RECT_SIZE / 2)
        .attr('width', this.RECT_SIZE)
        .attr('height', this.RECT_SIZE)
        .on(this.events);
    }
    return this;
  }

  /**
   * Draw the bubble of the matrix.
   */
  drawBubbles () {
    let _this = this;
    let bubbles = this.container.append('g').attr('class', this.CLASS.bubbles);

    for (let index = 0; index < this.rows.length; index++) {
      let row = this.rows[index];
      let bubble = bubbles
        .append('g')
        .attr('class', this.CLASS.row)
        .selectAll('circle')
        .data(row.values)
        .enter();

      bubble
        .append('circle')
        .attr('class', d => this.CLASS.color + this.scale.color(d))
        .attr('cy', () => this.scale.y(index) + this.PADDING.top)
        .attr('cx', (_, i) => this.scale.x(i))
        .attr('r', 0)
        .on(this.events)
        .on('mouseenter', function () {
          d3.select(this).transition().attr('r', d => _this.scale.radius(d) * 1.2);
        })
        .on('mouseleave', function () {
          d3.select(this).transition().attr('r', d => _this.scale.radius(d));
        })
        .transition()
        .duration(this.duration)
        .attr('r', d => this.scale.radius(d))
    }
    return this;
  }
}
