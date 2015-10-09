"use strict";
/*
*  Copyright (C) 1998-2015 by Northwoods Software Corporation. All Rights Reserved.
*/

// This layout is patterned after the "Table" Panel layout.
// This implementation and design is still experimental.

/**
* @constructor
* @extends Layout
* @class
* This Layout positions non-Link Parts into a table according to the values of
* GraphObject.row, GraphObject.column, GraphObject.rowSpan, GraphObject.columnSpan,
* GraphObject.alignment, GraphObject.stretch.
* If the value of GraphObject.stretch is not go.GraphObject.None, the Part will be sized
* according to the available space in the cell(s).
* <p>
* You can specify constraints for whole rows or columns by calling
* getRowDefinition(row) or getColumnDefinition(col) and setting one of the following properties:
* RowColumnDefinition.alignment, RowColumnDefinition.height, RowColumnDefinition.width,
* RowColumnDefinition.maximum, RowColumnDefinition.minimum, RowColumnDefinition.stretch.
* <p>
* The defaultAlignment and defaultStretch properties apply to all parts if not specified
* on the individual Part or in the corresponding row or column definition.
* <p>
* At the current time, there is no support for separator lines
* (RowColumnDefinition.separatorStroke, separatorStrokeWidth, and separatorDashArray properties)
* nor background (RowColumnDefinition.background and coversSeparators properties).
* There is no support for RowColumnDefinition.sizing, either.
*/
function TableLayout() {
  go.Layout.call(this);
  /** @type {Spot} */
  this._defaultAlignment = go.Spot.Default;
  /** @type {EnumValue} */
  this._defaultStretch = go.GraphObject.Default;
  /** @type {Array} */
  this._rowDefs = [];
  /** @type {Array} */
  this._colDefs = [];
}
go.Diagram.inherit(TableLayout, go.Layout);

/** @ignore */
TableLayout.prototype.cloneProtected = function(copy) {
  go.Layout.prototype.cloneProtected.call(this, copy);
  copy._defaultAlignment = this._defaultAlignment;
  copy._defaultStretch = this._defaultStretch;
  for (var i = 0; i < this._rowDefs.length; i++) {
    var def = this._rowDefs[i];
    copy._rowDefs.push(def !== undefined ? def.copy() : def);
  }
  for (var i = 0; i < this._colDefs.length; i++) {
    var def = this._colDefs[i];
    copy._colDefs.push(def !== undefined ? def.copy() : def);
  }
};

/**
* Gets or sets the alignment to use by default for Parts in rows (vertically) and in columns (horizontally).
* The default value is {@link Spot#Default}.
* Setting this property does not raise any events.
* @name TableLayout#defaultAlignment
* @function.
* @return {Spot}
*/
Object.defineProperty(TableLayout.prototype, "defaultAlignment", {
  get: function() { return this._defaultAlignment; },
  set: function(val) { this._defaultAlignment = val; }
});

/**
* Gets or sets whether Parts should be stretched in rows (vertically) and in columns (horizontally).
* The default value is {@link GraphObject#Default}.
* Setting this property does not raise any events.
* @name TableLayout#defaultStretch
* @function.
* @return {EnumValue}
*/
Object.defineProperty(TableLayout.prototype, "defaultStretch", {
  get: function() { return this._defaultStretch; },
  set: function(val) { this._defaultStretch = val; }
});

/**
* Gets the {@link RowColumnDefinition} for a particular row in this TableLayout.
* If you ask for the definition of a row at or beyond the {@link #rowCount},
* it will automatically create one and return it.
* @this {TableLayout}
* @param {number} idx the non-negative zero-based integer row index.
* @return {RowColumnDefinition}
*/
TableLayout.prototype.getRowDefinition = function(idx) {
  if (idx < 0) throw new Error("Row index must be non-negative, not: " + idx);
  idx = Math.round(idx);
  var defs = this._rowDefs;

  var d = defs[idx];
  if (d === undefined) {
    d = new go.RowColumnDefinition();
    // .panel remains null
    d.isRow = true;
    d.index = idx;
    defs[idx] = d;
  }
  return d;
};

/**
* This read-only property returns the number of rows in this TableLayout.
* This value is only valid after the layout has been performed.
* @name TableLayout#rowCount
* @function.
* @return {number}
*/
Object.defineProperty(TableLayout.prototype, "rowCount", {
  get: function() { return this._rowDefs.length; }
});

/**
* Gets the {@link RowColumnDefinition} for a particular column in this TableLayout.
* If you ask for the definition of a column at or beyond the {@link #columnCount},
* it will automatically create one and return it.
* @this {TableLayout}
* @param {number} idx the non-negative zero-based integer column index.
* @return {RowColumnDefinition}
*/
TableLayout.prototype.getColumnDefinition = function(idx) {
  if (idx < 0) throw new Error("Column index must be non-negative, not: " + idx);
  idx = Math.round(idx);
  var defs = this._colDefs;

  var d = defs[idx];
  if (d === undefined) {
    d = new go.RowColumnDefinition();
    // .panel remains null
    d.isRow = false;
    d.index = idx;
    defs[idx] = d;
  }
  return d;
};

/**
* This read-only property returns the number of columns in this TableLayout.
* This value is only valid after the layout has been performed.
* @name TableLayout#rowCount
* @function.
* @return {number}
*/
Object.defineProperty(TableLayout.prototype, "columnCount", {
  get: function() { return this._colDefs.length; }
});

/**
* @ignore
* @this {TableLayout}
* @param {Part} child
* @param {number} row
* @param {number} col
* @return {EnumValue}
*/
TableLayout.prototype.getEffectiveTableStretch = function(child, row, col) {
  var effectivestretch = child.stretch;
  if (effectivestretch !== go.GraphObject.Default) return effectivestretch;
  // which directions are we stretching?
  // undefined = default
  var horizontal = undefined;
  var vertical = undefined;
  switch (row.stretch) {
    case go.GraphObject.Default:
    case go.GraphObject.Horizontal: break;
    case go.GraphObject.Vertical: vertical = true; break;
    case go.GraphObject.Fill: vertical = true; break;
  }
  switch (col.stretch) {
    case go.GraphObject.Default:
    case go.GraphObject.Vertical: break;
    case go.GraphObject.Horizontal: horizontal = true; break;
    case go.GraphObject.Fill: horizontal = true; break;
  }

  var str = this.defaultStretch;
  if (horizontal === undefined && (str === go.GraphObject.Horizontal || str === go.GraphObject.Fill)) {
    horizontal = true;
  } else {
    horizontal = false;
  }
  if (vertical === undefined && (str === go.GraphObject.Vertical || str === go.GraphObject.Fill)) {
    vertical = true;
  } else {
    vertical = false;
  }
  if (horizontal === true && vertical === true) return go.GraphObject.Fill;
  if (horizontal === true) return go.GraphObject.Horizontal;
  if (vertical === true) return go.GraphObject.Vertical;
  return go.GraphObject.None; // Everything else is none by default
};

/**
* @ignore
* @override
* @this {TableLayout}
*/
TableLayout.prototype.doLayout = function(coll) {
  // put all eligible Parts that are not Links into an Array
  var parts = new go.List(go.Part);
  this.collectParts(coll).each(function(p) {
    if (!(p instanceof go.Link)) {
      p.ensureBounds();
      parts.add(p);
    }
  });

  this.diagram.startTransaction("TableLayout");
  var union = new go.Size();
  var rowcol = this.measureTable(Infinity, Infinity, parts, union, 0, 0);
  this.arrangeTable(parts, union, rowcol);
  this.diagram.commitTransaction("TableLayout");
};

/**
* @ignore
* @override
* @this {TableLayout}
*/
TableLayout.prototype.measureTable = function(width, height, children, union, minw, minh) {
  var l = children.length;
  // Make the array that holds [rows][cols] of the table
  var rowcol = []; // saved (so no temp array) starts as an array of rows, will end up [row][col][cell]
  for (var i = 0; i < l; i++) {
    var child = children.elt(i);
    if (!rowcol[child.row]) {
      rowcol[child.row] = []; // make new column for this row
    }
    if (!rowcol[child.row][child.column]) {
      rowcol[child.row][child.column] = []; // new list for this cell
    }
    rowcol[child.row][child.column].push(child); // push child into right cell
  }

  // Reset the row/col definitions because the ones from last measure are irrelevant
  var resetCols = [];  // keep track of which columns we've already reset

  // Objects that span multiple columns and
  var spanners = [];
  var nosize = [];
  // These hashes are used to tally the number of rows and columns that do not have a size
  var nosizeCols = { 'count': 0 };
  var nosizeRows = { 'count': 0 };

  var colleft = width;
  var rowleft = height;

  var defs = this._rowDefs;
  l = defs.length;
  for (var i = 0; i < l; i++) {
    var def = defs[i];
    if (def !== undefined) def.actual = 0;
  }

  defs = this._colDefs;
  l = defs.length;
  for (var i = 0; i < l; i++) {
    var def = defs[i];
    if (def !== undefined) def.actual = 0;
  }

  var lrow = rowcol.length; //number of rows
  var lcol = 0;
  for (var i = 0; i < lrow; i++) {
    if (!rowcol[i]) continue;
    lcol = Math.max(lcol, rowcol[i].length); // column length in this row
  }

  // Go through each cell (first pass)
  var amt = 0.0;
  lrow = rowcol.length; //number of rows
  for (var i = 0; i < lrow; i++) {
    if (!rowcol[i]) continue;
    lcol = rowcol[i].length; // column length in this row
    var rowHerald = this.getRowDefinition(i);
    rowHerald.actual = 0; // Reset rows (only on first pass)
    for (var j = 0; j < lcol; j++) {
      //foreach column j in row i...
      if (!rowcol[i][j]) continue;
      var colHerald = this.getColumnDefinition(j);
      if (resetCols[j] === undefined) { // make sure we only reset these once
        colHerald.actual = 0;
        resetCols[j] = true;
      }

      var cell = rowcol[i][j];
      var len = cell.length;
      for (var k = 0; k < len; k++) {
        //foreach element in cell, measure
        var child = cell[k];

        // Skip children that span more than one row or column or do not have a set size
        var spanner = (child.rowSpan > 1 || child.columnSpan > 1);
        if (spanner) {
          spanners.push(child);
          // We used to not measure spanners twice, but now we do
          // The reason is that there may be a row whose size
          // is dictated by an object with columnSpan 2+ and vice versa

          // continue;
        }

        var marg = child.margin;
        var margw = marg.right + marg.left;
        var margh = marg.top + marg.bottom;

        var stretch = this.getEffectiveTableStretch(child, rowHerald, colHerald);
        var dsize = child.resizeObject.desiredSize;
        var realwidth = !(isNaN(dsize.width));
        var realheight = !(isNaN(dsize.height));
        var realsize = realwidth && realheight;
        if (!spanner && stretch !== go.GraphObject.None && !realsize) {
          if (nosizeCols[j] === undefined) {
            nosizeCols[j] = -1; nosizeCols.count++;
          }
          if (nosizeRows[i] === undefined) {
            nosizeRows[i] = -1; nosizeRows.count++;
          }
          nosize.push(child);
        }

        if (stretch !== go.GraphObject.None) {
          var unrestrictedSize = new go.Size(NaN, NaN);
          if (stretch !== go.GraphObject.Horizontal) unrestrictedSize.height = rowHerald.minimum;
          if (stretch !== go.GraphObject.Vertical) unrestrictedSize.width = colHerald.minimum;
          //??? allow resizing during measure phase
          child.resizeObject.desiredSize = unrestrictedSize;
          child.ensureBounds();
        }

        var m = child.actualBounds;
        var mwidth = Math.max(m.width + margw, 0);
        var mheight = Math.max(m.height + margh, 0);

        //  Make sure the heralds have the right layout size
        //    the row/column should use the largest meausured size of any
        //    GraphObject contained, constrained by mins and maxes
        if (child.rowSpan === 1 && (realheight || stretch === go.GraphObject.None || stretch === go.GraphObject.Horizontal)) {
          var def = this.getRowDefinition(i);
          amt = Math.max(mheight - def.actual, 0);
          if (amt > rowleft) amt = rowleft;
          def.actual = def.actual + amt;
          rowleft = Math.max(rowleft - amt, 0);
        }

        if (child.columnSpan === 1 && (realwidth || stretch === go.GraphObject.None || stretch === go.GraphObject.Vertical)) {
          var def = this.getColumnDefinition(j);
          amt = Math.max(mwidth - def.actual, 0);
          if (amt > colleft) amt = colleft;
          def.actual = def.actual + amt;
          colleft = Math.max(colleft - amt, 0);
        }

      } // end cell
    } // end col
  } //end row

  // For objects of no desired size we allocate what is left as we go,
  // or else what is already in the column
  var totalColWidth = 0.0;
  var totalRowHeight = 0.0;
  l = this.columnCount;
  for (var i = 0; i < l; i++) {
    if (this._colDefs[i] === undefined) continue;
    totalColWidth += this.getColumnDefinition(i).actual;
  }
  l = this.rowCount;
  for (var i = 0; i < l; i++) {
    if (this._rowDefs[i] === undefined) continue;
    totalRowHeight += this.getRowDefinition(i).actual;
  }
  colleft = Math.max(width - totalColWidth, 0);
  rowleft = Math.max(height - totalRowHeight, 0);
  var originalrowleft = rowleft;
  var originalcolleft = colleft;

  // Determine column sizes for the yet-to-be-sized columns
  l = nosize.length;
  for (var i = 0; i < l; i++) {
    var child = nosize[i];
    var rowHerald = this.getRowDefinition(child.row);
    var colHerald = this.getColumnDefinition(child.column);
    // We want to gather the largest difference between desired and expected col/row sizes
    var mb = child.actualBounds;
    var marg = child.margin;
    var margw = marg.right + marg.left;
    var margh = marg.top + marg.bottom;

    if (colHerald.actual === 0) {
      nosizeCols[child.column] = Math.max(mb.width + margw, nosizeCols[child.column]);
    } else {
      nosizeCols[child.column] = null; // obey the column herald
    }
    if (rowHerald.actual === 0) {
      nosizeRows[child.row] = Math.max(mb.height + margh, nosizeRows[child.row]);
    } else {
      nosizeRows[child.row] = null; // obey the row herald
    }
  }
  // we now have the size that all these columns prefer to be
  // we also have the amount left over
  var desiredRowTotal = 0.0;
  var desiredColTotal = 0.0;
  for (i in nosizeRows) { if (i !== 'count') desiredRowTotal += nosizeRows[i] }
  for (i in nosizeCols) { if (i !== 'count') desiredColTotal += nosizeCols[i] }

  var allowedSize = new go.Size(); // used in stretch and span loops

  // Deal with objects that have a stretch
  for (var i = 0; i < l; i++) {
    var child = nosize[i];
    var rowHerald = this.getRowDefinition(child.row);
    var colHerald = this.getColumnDefinition(child.column);

    var w = 0.0;
    if (isFinite(colHerald.width)) {
      w = colHerald.width;
    } else {
      if (isFinite(colleft) && nosizeCols[child.column] !== null) {
        if (desiredColTotal === 0) w = colHerald.actual + colleft;
        else w = /*colHerald.actual +*/ ((nosizeCols[child.column] / desiredColTotal) * originalcolleft);
      } else {
        // Only use colHerald.actual if it was nonzero before this loop
        if (nosizeCols[child.column] !== null) w = colleft;
        else w = colHerald.actual || colleft;
        //w = nosizeCols[child.column] || colleft; // Older, less correct way
      }
      w = Math.max(0, w - colHerald.computeEffectiveSpacing());
    }
    var h = 0.0;
    if (isFinite(rowHerald.height)) {
      h = rowHerald.height;
    } else {
      if (isFinite(rowleft) && nosizeRows[child.row] !== null) {
        if (desiredRowTotal === 0) h = rowHerald.actual + rowleft;
        else h = /*rowHerald.actual +*/ ((nosizeRows[child.row] / desiredRowTotal) * originalrowleft);
      } else {
        // Only use rowHerald.actual if it was nonzero before this loop
        if (nosizeRows[child.row] !== null) h = rowleft;
        else h = rowHerald.actual || rowleft;
        //h = nosizeRows[child.row] || rowleft; // Older, less correct way
      }
      h = Math.max(0, h - rowHerald.computeEffectiveSpacing());
    }

    allowedSize.setTo(
      Math.max(colHerald.minimum, Math.min(w, colHerald.maximum)),
      Math.max(rowHerald.minimum, Math.min(h, rowHerald.maximum)));

    // Which way do we care about fill:
    var stretch = this.getEffectiveTableStretch(child, rowHerald, colHerald);
    switch (stretch) {
      case go.GraphObject.Horizontal: // H stretch means it can be as large as its wants vertically
        allowedSize.height = Infinity;
        break;
      case go.GraphObject.Vertical: // vice versa
        allowedSize.width = Infinity;
        break;
    }

    var marg = child.margin;
    var margw = marg.right + marg.left;
    var margh = marg.top + marg.bottom;

    var m = child.actualBounds;
    var mwidth = Math.max(m.width + margw, 0);
    var mheight = Math.max(m.height + margh, 0);
    if (isFinite(colleft)) mwidth = Math.min(mwidth, allowedSize.width);
    if (isFinite(rowleft)) mheight = Math.min(mheight, allowedSize.height);

    var oldAmount = 0.0;

    oldAmount = rowHerald.actual;
    rowHerald.actual = Math.max(rowHerald.actual, mheight);
    amt = rowHerald.actual - oldAmount;
    rowleft = Math.max(rowleft - amt, 0);

    oldAmount = colHerald.actual;
    colHerald.actual = Math.max(colHerald.actual, mwidth);
    amt = colHerald.actual - oldAmount;
    colleft = Math.max(colleft - amt, 0);
  } // end no fixed size objects

  // Go through each object that spans multiple rows or columns
  var additionalSpan = new go.Size();
  l = spanners.length;
  for (var i = 0; i < l; i++) {
    var child = spanners[i];
    var rowHerald = this.getRowDefinition(child.row);
    var colHerald = this.getColumnDefinition(child.column);

    // If there's a set column width/height we don't care about the given width/height
    allowedSize.setTo(
      Math.max(colHerald.minimum, Math.min(width, colHerald.maximum)),
      Math.max(rowHerald.minimum, Math.min(height, rowHerald.maximum)));

    // If it is a spanner and has a fill:
    var stretch = this.getEffectiveTableStretch(child, rowHerald, colHerald);
    switch (stretch) {
      case go.GraphObject.Fill:
        if (colHerald.actual !== 0) allowedSize.width = Math.min(allowedSize.width, colHerald.actual);
        if (rowHerald.actual !== 0) allowedSize.height = Math.min(allowedSize.height, rowHerald.actual);
        break;
      case go.GraphObject.Horizontal:
        if (colHerald.actual !== 0) allowedSize.width = Math.min(allowedSize.width, colHerald.actual);
        break;
      case go.GraphObject.Vertical:
        if (rowHerald.actual !== 0) allowedSize.height = Math.min(allowedSize.height, rowHerald.actual);
        break;
    }
    // If there's a set column width/height we don't care about any of the above:
    if (isFinite(colHerald.width)) allowedSize.width = colHerald.width;
    if (isFinite(rowHerald.height)) allowedSize.height = rowHerald.height;

    // take into account rowSpan and columnSpan
    additionalSpan.setTo(0, 0);
    for (var n = 1; n < child.rowSpan; n++) {
      if (child.row + n >= this.rowCount) break; // if the row exists at all
      def = this.getRowDefinition(child.row + n);
      additionalSpan.height += Math.max(def.minimum, isNaN(def.size) ? def.maximum : Math.min(def.size, def.maximum));
    }
    for (var n = 1; n < child.columnSpan; n++) {
      if (child.column + n >= this.columnCount) break; // if the col exists at all
      def = this.getColumnDefinition(child.column + n);
      additionalSpan.width += Math.max(def.minimum, isNaN(def.size) ? def.maximum : Math.min(def.size, def.maximum));
    }
    allowedSize.width += additionalSpan.width;
    allowedSize.height += additionalSpan.height;

    var marg = child.margin;
    var margw = marg.right + marg.left;
    var margh = marg.top + marg.bottom;
    var m = child.actualBounds;
    var mwidth = Math.max(m.width + margw, 0);
    var mheight = Math.max(m.height + margh, 0);

    var totalRow = 0.0;
    for (var n = 0; n < child.rowSpan; n++) {
      if (child.row + n >= this.rowCount) break; // if the row exists at all
      def = this.getRowDefinition(child.row + n);
      totalRow += def.total || 0;
    }
    // def is the last row definition
    if (totalRow < mheight) {
      var roomLeft = mheight - totalRow;
      while (roomLeft > 0) { // Add the extra to the first row that allows us to
        var act = def.actual || 0;
        if (isNaN(def.height) && def.maximum > act) {
          def.actual = Math.min(def.maximum, act + roomLeft);
          if (def.actual !== act) roomLeft -= def.actual - act;
        }
        if (def.index - 1 === -1) break;
        def = this.getRowDefinition(def.index - 1);
      }
    }

    var totalCol = 0.0;
    for (var n = 0; n < child.columnSpan; n++) {
      if (child.column + n >= this.columnCount) break; // if the col exists at all
      def = this.getColumnDefinition(child.column + n);
      totalCol += def.total || 0;
    }
    // def is the last col definition
    if (totalCol < mwidth) {
      var roomLeft = mwidth - totalCol;
      while (roomLeft > 0) { // Add the extra to the first row that allows us to
        var act = def.actual || 0;
        if (isNaN(def.width) && def.maximum > act) {
          def.actual = Math.min(def.maximum, act + roomLeft);
          if (def.actual !== act) roomLeft -= def.actual - act;
        }
        if (def.index - 1 === -1) break;
        def = this.getColumnDefinition(def.index - 1);
      }
    }
  } // end spanning objects

  l = this.columnCount;
  for (var i = 0; i < l; i++) {
    if (this._colDefs[i] === undefined) continue;
    def = this.getColumnDefinition(i);
    def.position = union.width;
    if (def.actual !== 0) {
      union.width += def.actual;
      union.width += def.computeEffectiveSpacing();
    }
  }

  l = this.rowCount;
  for (var i = 0; i < l; i++) {
    if (this._rowDefs[i] === undefined) continue;
    def = this.getRowDefinition(i);
    def.position = union.height;
    if (def.actual !== 0) {
      union.height += def.actual;
      union.height += def.computeEffectiveSpacing();
    }
  }

  // save these for arrange (destroy them or not? Possibly needed for drawing spacers)
  return rowcol;
}; // end measureTable


/**
* @ignore
* @override
* @this {TableLayout}
*/
TableLayout.prototype.arrangeTable = function(children, union, rowcol) {
  var l = children.length;
  var x = 0.0;
  var y = 0.0;

  var lrow = rowcol.length; //number of rows
  var lcol = 0;
  for (var i = 0; i < lrow; i++) {
    if (!rowcol[i]) continue;
    lcol = Math.max(lcol, rowcol[i].length); // column length in this row
  }

  var additionalSpan = new go.Size();
  // Find cell space and arrange objects:
  for (var i = 0; i < lrow; i++) {
    if (!rowcol[i]) continue;
    lcol = rowcol[i].length; // column length in this row
    var rowHerald = this.getRowDefinition(i);
    y = rowHerald.position + rowHerald.computeEffectiveSpacingTop();
    for (var j = 0; j < lcol; j++) {
      //foreach column j in row i...
      if (!rowcol[i][j]) continue;
      var colHerald = this.getColumnDefinition(j);
      x = colHerald.position + colHerald.computeEffectiveSpacingTop();
      var cell = rowcol[i][j];
      var len = cell.length;

      for (var k = 0; k < len; k++) {
        //foreach element in cell
        var child = cell[k];

        // add to layoutWidth/Height any additional span
        additionalSpan.setTo(0, 0);

        for (var n = 1; n < child.rowSpan; n++) {
          // if the row exists at all
          if (i + n >= this.rowCount) break;
          var rh = this.getRowDefinition(i + n);
          additionalSpan.height += rh.total;
        }

        for (var n = 1; n < child.columnSpan; n++) {
          // if the col exists at all
          if (j + n >= this.columnCount) break;
          var ch = this.getColumnDefinition(j + n);
          additionalSpan.width += ch.total;
        }

        // Construct containing rect (cell):

        // total width and height of the cell that an object could possibly be created in
        var colwidth = colHerald.actual + additionalSpan.width;
        var rowheight = rowHerald.actual + additionalSpan.height;

        // construct a rect that represents the total cell size allowed for this object
        var ar = new go.Rect();
        ar.x = x;
        ar.y = y;
        ar.width = colwidth;
        ar.height = rowheight;

        // Also keep them for clip values
        var cellx = x;
        var celly = y;
        var cellw = colwidth;
        var cellh = rowheight;
        // Ending rows/col might have actual spaces that are larger than the remaining space
        // Modify them for clipping regions
        if (x + colwidth > union.width) cellw = Math.max(union.width - x, 0);
        if (y + rowheight > union.height) cellh = Math.max(union.height - y, 0);


        // Construct alignment:
        var align = child.alignment;
        var alignx = 0.0;
        var aligny = 0.0;
        var alignoffsetX = 0.0;
        var alignoffsetY = 0.0;
        if (align.isDefault()) {
          align = this.defaultAlignment;
          if (!align.isSpot()) align = go.Spot.Center;
          alignx = align.x;
          aligny = align.y;
          alignoffsetX = align.offsetX;
          alignoffsetY = align.offsetY;
          var ca = colHerald.alignment;
          var ra = rowHerald.alignment;
          if (ca.isSpot()) {
            alignx = ca.x;
            alignoffsetX = ca.offsetX;
          }
          if (ra.isSpot()) {
            aligny = ra.y;
            alignoffsetY = ra.offsetY;
          }
        } else {
          alignx = align.x;
          aligny = align.y;
          alignoffsetX = align.offsetX;
          alignoffsetY = align.offsetY;
        }

        // same as if (!align.isSpot()) align = go.Spot.Center;
        if (isNaN(alignx) || isNaN(aligny)) {
          alignx = 0.5;
          aligny = 0.5;
          alignoffsetX = 0;
          alignoffsetY = 0;
        }

        var width = 0.0;
        var height = 0.0;

        var marg = child.margin;
        var margw = marg.left + marg.right;
        var margh = marg.top + marg.bottom;
        var stretch = this.getEffectiveTableStretch(child, rowHerald, colHerald);
        if (/* isNaN(child.resizeObject.desiredSize.width) && */ (stretch === go.GraphObject.Fill || stretch === go.GraphObject.Horizontal))
          width = Math.max(colwidth - margw, 0);
        else
          width = child.actualBounds.width;
        if (/* isNaN(child.resizeObject.desiredSize.height) && */ (stretch === go.GraphObject.Fill || stretch === go.GraphObject.Vertical))
          height = Math.max(rowheight - margh, 0);
        else
          height = child.actualBounds.height;

        // min and max override any stretch values
        var max = child.maxSize;
        var min = child.minSize;
        width = Math.min(max.width, width);
        height = Math.min(max.height, height);
        width = Math.max(min.width, width);
        height = Math.max(min.height, height);

        var widthmarg = width + margw;
        var heightmarg = height + margh;

        ar.x += (ar.width * alignx) - (widthmarg * alignx) + alignoffsetX + marg.left;
        ar.y += (ar.height * aligny) - (heightmarg * aligny) + alignoffsetY + marg.top;

        child.moveTo(ar.x, ar.y);
        if (stretch !== go.GraphObject.None) {
          child.resizeObject.desiredSize = new go.Size(width, height);
        }

      } // end cell
    } // end col
  } //end row
}; // end arrangeTable
// end TableLayout class
