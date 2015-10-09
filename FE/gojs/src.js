(function() {
    var $ = go.GraphObject.make;
    var myDiagram =
        $(go.Diagram, 'myDiagramDiv', {
            initialContentAlignment: go.Spot.Center, // center Diagram contents
            'undoManager.isEnabled': true, // enable Ctrl-Z to undo and Ctrl-Y to redo
            layout: $(go.TreeLayout, {
                angle: 90,
                nodeSpacing: 30,
                layerSpacing: 30
            })
        });

    // the template we defined earlier
    myDiagram.nodeTemplate = $(go.Node, 'Vertical', {
            cursor: 'pointer',
            // background: '#44CCFF'
        },
        $(go.Picture, {
                margin: 0,
                width: 50,
                height: 50,
            },
            new go.Binding('source')),
        $(go.TextBlock, 'Default Text', {
                margin: 2,
                stroke: 'blue',
                font: 'bold 16px sans-serif'
            },
            new go.Binding('text', 'name'))
    );

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate = $(go.Link, // the whole link panel
        {
            // 跳线
            // routing: go.Link.Orthogonal,
            // curve: go.Link.JumpOver
            // 绕线
            routing: go.Link.AvoidsNodes,
            corner: 10
                // 直线
                // curve: go.Link.Bezier,
                // adjusting: go.Link.Stretch,
                // reshapable: true
        },
        new go.Binding('curviness', 'curviness'),
        new go.Binding('points').makeTwoWay(),
        $(go.Shape, // the link shape
            {
                strokeWidth: 1.5,
                stroke: 'black'
            },
            new go.Binding('stroke', 'stroke').makeTwoWay()
        ),
        $(go.Shape, // the arrowhead
            {
                toArrow: 'standard',
                stroke: 'black'
            },
            new go.Binding('stroke', 'stroke').makeTwoWay(),
            new go.Binding('fill', 'stroke').makeTwoWay()
        ),
        $(go.TextBlock, 'text', // the label
            {
                segmentOffset: new go.Point(0, -10),
                textAlign: 'center',
                font: '10pt helvetica, arial, sans-serif',
                stroke: 'red',
                margin: 0,
                editable: true // editing the text automatically updates the model data
            },
            new go.Binding('text', 'text').makeTwoWay(),
            new go.Binding('stroke', 'stroke').makeTwoWay()
        )
    );



    var nodeDataArray = [{
        key: '1',
        name: 'Don Meow',
        source: 'images/switch.jpg'
    }, {
        key: '2',
        name: 'Demeter',
        source: 'images/router.jpg'
    }, {
        key: '3',
        name: 'Copricat',
        source: 'images/router.jpg'
    }, {
        key: '4',
        name: 'Jellylorum',
        source: 'images/router.jpg'
    }, {
        key: '5',
        name: 'Alonzo',
        source: 'images/server.jpg'
    }, {
        key: '6',
        name: 'Munkustrap',
        source: 'images/server.jpg'
    }];
    var linkDataArray = [{
        from: '1',
        to: '2',
        text: 'aaa',
        stroke: 'red'
    }, {
        from: '1',
        to: '3',
        text: 'bbb',
        stroke: 'blue'
    }, {
        from: '1',
        to: '4',
        text: 'ccc',
        stroke: 'black'
    }];

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
})()
