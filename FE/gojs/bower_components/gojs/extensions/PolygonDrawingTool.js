"use strict";
/*
*  Copyright (C) 1998-2015 by Northwoods Software Corporation. All Rights Reserved.
*/

// A custom Tool for drawing polygons or polylines

/**
* @constructor
* @extends Tool
* @class
* This tool allows the user to draw a new polygon or polyline shape by clicking where the corners should go.
* Right click or type ENTER to finish the operation.
* <p/>
* Set {@link #isPolygon} to false if you want this tool to draw open unfilled polyline shapes.
* Set {@link #archetypePartData} to customize the node data object that is added to the model.
* Data-bind to those properties in your node template to customize the appearance and behavior of the part.
* <p/>
* This tool uses a temporary {@link Shape}, {@link #temporaryShape}, held by a {@link Part} in the "Tool" layer,
* to show interactively what the user is drawing.
*/
function PolygonDrawingTool() {
  go.Tool.call(this);
  this.name = "PolygonDrawing";
  this._isPolygon = true;
  this._archetypePartData = {}; // the data to copy for a new polygon Part

  // this is the Shape that is shown during a drawing operation
  this._temporaryShape = go.GraphObject.make(go.Shape, { name: "SHAPE", fill: "lightgray", strokeWidth: 1.5 });
  // the Shape has to be inside a temporary Part that is used during the drawing operation
  go.GraphObject.make(go.Part, { layerName: "Tool" }, this._temporaryShape);
}
go.Diagram.inherit(PolygonDrawingTool, go.Tool);

/**
* Don't start this tool in a mode-less fashion when the user's mouse-down is on an existing Part.
* When this tool is a mouse-down tool, it requires using the left mouse button in the background of a modifiable Diagram.
* Modal uses of this tool will not call this canStart predicate.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.canStart = function() {
  if (!this.isEnabled) return false;
  var diagram = this.diagram;
  if (diagram === null || diagram.isReadOnly || diagram.isModelReadOnly) return false;
  var model = diagram.model;
  if (model === null) return false;
  // require left button
  if (!diagram.firstInput.left) return false;
  // can't start when mouse-down on an existing Part
  var obj = diagram.findObjectAt(diagram.firstInput.documentPoint, null, null);
  return (obj === null);
};

/**
* Start a transaction, capture the mouse, use a "crosshair" cursor,
* and start accumulating points in the geometry of the {@link #temporaryShape}.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.doActivate = function() {
  go.Tool.prototype.doActivate.call(this);
  this.startTransaction(this.name);
  this.diagram.isMouseCaptured = true;
  this.diagram.currentCursor = "crosshair";
  // the first point
  if (!('ontouchstart' in window)) this.addPoint(this.diagram.lastInput.documentPoint);
  this.temporaryShape.fill = (this.isPolygon ? "lightgray" : null);
};

/**
* Stop the transaction and clean up.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.doDeactivate = function() {
  go.Tool.prototype.doDeactivate.call(this);
  if (this.temporaryShape !== null) {
    this.diagram.remove(this.temporaryShape.part);
  }
  this.diagram.currentCursor = "";
  this.diagram.isMouseCaptured = false;
  this.stopTransaction();
};

/**
* This internal method adds a point to the geometry of the {@link #temporaryShape}.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.addPoint = function(p) {
  var shape = this.temporaryShape;
  if (shape === null) return;

  // for the temporary Shape, normalize the geometry to be in the viewport
  var viewpt = this.diagram.viewportBounds.position;
  var q = new go.Point(p.x-viewpt.x, p.y-viewpt.y);

  var part = shape.part;
  // if it's not in the Diagram, re-initialize the Shape's geometry and add the Part to the Diagram
  if (part.diagram === null) {
    var fig = new go.PathFigure(q.x, q.y, true);  // possibly filled, depending on Shape.fill
    var geo = new go.Geometry().add(fig);  // the Shape.geometry consists of a single PathFigure
    this.temporaryShape.geometry = geo;
    part.position = viewpt;  // position the Shape's Part
    this.diagram.add(part);
  } else {
    // must copy whole Geometry in order to add a PathSegment
    var geo = shape.geometry.copy();
    var fig = geo.figures.first();
    fig.add(new go.PathSegment(go.PathSegment.Line, q.x, q.y));
  }
  shape.geometry = geo;
};

/**
* This internal method changes the last point of the geometry of the {@link #temporaryShape}.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.moveLastPoint = function(p) {
  // must copy whole Geometry in order to change a PathSegment
  var shape = this.temporaryShape;
  var geo = shape.geometry.copy();
  var segs = geo.figures.first().segments;
  if (segs.count > 0) {
    // for the temporary Shape, normalize the geometry to be in the viewport
    var viewpt = this.diagram.viewportBounds.position;
    var seg = segs.elt(segs.count - 1);
    // modify the last PathSegment to be the given Point p
    seg.endX = p.x-viewpt.x;
    seg.endY = p.y-viewpt.y;
    shape.geometry = geo;
  }
};

/**
* This internal method removes the last point of the geometry of the {@link #temporaryShape}.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.removeLastPoint = function() {
  // must copy whole Geometry in order to remove a PathSegment
  var shape = this.temporaryShape;
  var geo = shape.geometry.copy();
  var segs = geo.figures.first().segments;
  if (segs.count > 0) {
    segs.removeAt(segs.count-1);
    shape.geometry = geo;
  }
};

/**
* Add a new node data JavaScript object to the model and initialize the Part's
* position and its Shape's geometry by copying the {@link #temporaryShape}'s {@link Shape#geometry}.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.finishShape = function() {
  var diagram = this.diagram;
  var shape = this.temporaryShape;
  if (shape !== null && this.archetypePartData !== null) {
    // remove the temporary point, which is last, except on touch devices
    if (!('ontouchstart' in window)) this.removeLastPoint();
    var tempgeo = shape.geometry;
    // require 3 points (2 segments) if polygon; 2 points (1 segment) if polyline
    if (tempgeo.figures.first().segments.count >= (this.isPolygon ? 2 : 1)) {
      // normalize geometry and node position
      var viewpt = diagram.viewportBounds.position;
      var geo = tempgeo.copy();
      if (this.isPolygon) {
        // if polygon, close the last segment
        var segs = geo.figures.first().segments;
        var seg = segs.elt(segs.count-1);
        seg.isClosed = true;
      }
      var pos = geo.normalize();
      pos.x = viewpt.x - pos.x;
      pos.y = viewpt.y - pos.y;
      // create the node data for the model
      var d = diagram.model.copyNodeData(this.archetypePartData);
      // adding data to model creates the actual Part
      diagram.model.addNodeData(d);
      var part = diagram.findPartForData(d);
      // assign the location
      part.location = new go.Point(pos.x + geo.bounds.width/2, pos.y + geo.bounds.height/2);
      // assign the Shape.geometry
      var shape = part.findObject("SHAPE");
      if (shape !== null) shape.geometry = geo;
      this.transactionResult = this.name;
    }
  }
  this.stopTool();
};

/**
* Add another point to the geometry of the {@link #temporaryShape}.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.doMouseDown = function() {
  if (!this.isActive) {
    this.doActivate();
  }
  // a new temporary end point, the previous one is now "accepted"
  this.addPoint(this.diagram.lastInput.documentPoint);
  if (!this.diagram.lastInput.left) {  // e.g. right mouse down
    this.finishShape();
  }
};

/**
* Move the last point of the {@link #temporaryShape}'s geometry to follow the mouse point.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.doMouseMove = function() {
  if (this.isActive) {
    this.moveLastPoint(this.diagram.lastInput.documentPoint);
  }
};

/**
* Do not stop this tool, but continue to accumulate Points via mouse-down events.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.doMouseUp = function() {
  // don't stop this tool (the default behavior is to call stopTool)
};

/**
* Typing the "ENTER" key accepts the current geometry (excluding the current mouse point)
* and creates a new part in the model by calling {@link #finishShape}.
* <p/>
* Typing the "Z" key causes the previous point to be discarded.
* <p/>
* Typing the "ESCAPE" key causes the temporary Shape and its geometry to be discarded and this tool to be stopped.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.doKeyDown = function() {
  if (!this.isActive) return;
  var e = this.diagram.lastInput;
  if (e.key === '\r') {  // accept
    this.finishShape();  // all done!
  } else if (e.key === 'Z') {  // undo
    this.undo();
  } else {
    go.Tool.prototype.doKeyDown.call(this);
  }
};

/**
* Undo: remove the last point and continue the drawing of new points.
* @this {PolygonDrawingTool}
*/
PolygonDrawingTool.prototype.undo = function() {
  // remove a point, and then treat the last one as a temporary one
  this.removeLastPoint();
  var lastInput = this.diagram.lastInput;
  if (lastInput.event instanceof window.MouseEvent) this.moveLastPoint(lastInput.documentPoint);
};


// Public properties

/**
* Gets or sets whether this tools draws a filled polygon or an unfilled open polyline.
* The default value is true.
* @name PolygonDrawingTool#isPolygon
* @function.
* @return {boolean}
*/
Object.defineProperty(PolygonDrawingTool.prototype, "isPolygon", {
  get: function() { return this._isPolygon; },
  set: function(val) { this._isPolygon = val; }
});

/**
* Gets or sets the Shape that is used to hold the line as it is being drawn.
* The default value is a simple Shape drawing an unfilled open thin black line.
* @name PolygonDrawingTool#temporaryShape
* @function.
* @return {Shape}
*/
Object.defineProperty(PolygonDrawingTool.prototype, "temporaryShape", {
  get: function() { return this._temporaryShape; },
  set: function(val) {
    if (this._temporaryShape !== val && val !== null) {
      val.name = "SHAPE";
      var panel = this._temporaryShape.panel;
      panel.remove(this._temporaryShape);
      this._temporaryShape = val;
      panel.add(this._temporaryShape);
    }
  }
});

/**
* Gets or sets the node data object that is copied and added to the model
* when the drawing operation completes.
* @name PolygonDrawingTool#archetypePartData
* @function.
* @return {Object}
*/
Object.defineProperty(PolygonDrawingTool.prototype, "archetypePartData", {
  get: function() { return this._archetypePartData; },
  set: function(val) { this._archetypePartData = val; }
});
