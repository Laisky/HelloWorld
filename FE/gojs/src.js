(function() {
    var $ = go.GraphObject.make;
    var myDiagram =
        $(go.Diagram, "myDiagramDiv", {
            initialContentAlignment: go.Spot.Center, // center Diagram contents
            "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
        });

    // the template we defined earlier
    myDiagram.nodeTemplate =
        $(go.Node, "Vertical", {
                cursor: 'pointer',
                // background: "#44CCFF"
            },
            $(go.Picture, {
                    margin: 0,
                    width: 50,
                    height: 50,
                },
                new go.Binding("source")),
            $(go.TextBlock, "Default Text", {
                    margin: 2,
                    stroke: "blue",
                    font: "bold 16px sans-serif"
                },
                new go.Binding("text", "name"))
        );

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $(go.Link, // the whole link panel
            {
                curve: go.Link.Bezier,
                adjusting: go.Link.Stretch,
                reshapable: true
            },
            new go.Binding("curviness", "curviness"),
            new go.Binding("points").makeTwoWay(),
            $(go.Shape, // the link shape
                {
                    strokeWidth: 1.5
                }
            ),
            $(go.Shape, // the arrowhead
                {
                    toArrow: "standard",
                    stroke: null
                }
            ),
            $(go.TextBlock, 'text', // the label
                {
                    segmentIndex: 0,
                    segmentFraction: 0.2,
                    textAlign: "center",
                    font: "10pt helvetica, arial, sans-serif",
                    stroke: "red",
                    margin: 0,
                    editable: true // editing the text automatically updates the model data
                },
                new go.Binding("text", "text").makeTwoWay()
            ),
            // $(go.TextBlock, "mid", {
            //     segmentIndex: 0,
            //     segmentFraction: 0.5
            // }),
        );



    var nodeDataArray = [{
        key: "1",
        name: "Don Meow",
        source: "images/head.jpg"
    }, {
        key: "2",
        name: "Demeter",
        source: "images/head.jpg"
    }, {
        key: "3",
        name: "Copricat",
        source: "images/head.jpg"
    }, {
        key: "4",
        name: "Jellylorum",
        source: "images/head.jpg"
    }, {
        key: "5",
        name: "Alonzo",
        source: "images/head.jpg"
    }, {
        key: "6",
        name: "Munkustrap",
        source: "images/head.jpg"
    }];
    var linkDataArray = [{
        from: '1',
        to: '2',
        // text: 'aaa'
    }];

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
})()