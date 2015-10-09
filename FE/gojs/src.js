(function() {
    var $ = go.GraphObject.make;
    var myDiagram =
        $(go.Diagram, 'myDiagramDiv', {
            initialContentAlignment: go.Spot.Center, // center Diagram contents
            'undoManager.isEnabled': true, // enable Ctrl-Z to undo and Ctrl-Y to redo
            // layout: $(go.TreeLayout, {
            //         angle: 0,
            //         nodeSpacing: 50,
            //         layerSpacing: 50
            //     })
            // layout: $(go.LayeredDigraphLayout)
            // layout: $(go.GridLayout, {
            //     comparer: go.GridLayout.smartComparer
            // })
            layout: $(go.LayeredDigraphLayout, {
                direction: 0
            })
        });

    // the template we defined earlier
    myDiagram.nodeTemplate = $(go.Node, 'Vertical',
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding('scale', 'scale').makeTwoWay(), {
            cursor: 'pointer',
            // fromLinkable: true,
            // toLinkable: true
            // background: '#44CCFF'
        },
        $(go.Picture, {
                margin: 0,
                width: 50,
                height: 50,
            },
            new go.Binding('source', 'image').makeTwoWay()
        ),
        $(go.TextBlock, '', {
                margin: 2,
                stroke: 'blue',
                font: 'bold 16px sans-serif',
            },
            new go.Binding('text', 'key').makeTwoWay()
        )
    );

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate = $(go.Link, // the whole link panel
        {
            // 跳线
            // routing: go.Link.Orthogonal,
            // curve: go.Link.JumpOver,
            corner: 10,
            // 绕线
            routing: go.Link.AvoidsNodes,
            // corner: 10
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
        // $(go.Shape, // the arrowhead
        //     {
        //         toArrow: 'standard',
        //         stroke: 'black'
        //     },
        //     new go.Binding('stroke', 'stroke').makeTwoWay(),
        //     new go.Binding('fill', 'stroke').makeTwoWay()
        // ),
        // $(go.Shape, // the arrowtail
        //     {
        //         fromArrow: 'backward',
        //         stroke: 'black'
        //     },
        //     new go.Binding('stroke', 'stroke').makeTwoWay(),
        //     new go.Binding('fill', 'stroke').makeTwoWay()
        // ),
        $(go.TextBlock, '', // the label
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

    myDiagram.groupTemplate =
        $(go.Group, "Auto",
            new go.Binding('angle', 'angle').makeTwoWay(), {
                layout: $(go.TreeLayout, {
                    angle: 90,
                    nodeSpacing: 20,
                    layerSpacing: 20
                }),
            });

    var nodeDataArray = [
        // layer 1 switch
        {
            key: 'C2-5800',
            image: 'images/switch.jpg'
        }, {
            key: 'C3-5800',
            image: 'images/switch.jpg'
        }, {
            key: 'C4-5800',
            image: 'images/switch.jpg'
        }, {
            key: 'C5-5800',
            image: 'images/switch.jpg'
        }, {
            key: 'C6-5800',
            image: 'images/switch.jpg'
        }, {
            key: 'C7-5800',
            image: 'images/switch.jpg'
        },
        // kernel
        {
            key: 'C2-6800',
            scale: 1.5,
            image: 'images/switch.jpg'
        }, {
            key: 'SS7706',
            scale: 1.5,
            group: 'S7706-Group',
            image: 'images/switch.jpg'
        }, {
            key: 'VS-NeiWang',
            scale: 1.5,
            // group: 'S7706-Group',
            image: 'images/switch.jpg'
        }, {
            key: 'CE-12808-01',
            scale: 1.5,
            // group: 'S7706-Group',
            image: 'images/switch.jpg'
        }, {
            key: 'E1-Switch',
            scale: 1.2,
            group: 'S7706-Group',
            image: 'images/switch.jpg'
        }, {
            key: 'E2-Switch',
            scale: 1.2,
            group: 'S7706-Group',
            image: 'images/switch.jpg'
        },
        // sub switch
        {
            key: 'F1-S1-CE5850',
            image: 'images/switch.jpg'
        }, {
            key: 'F2-S1-CE5850',
            image: 'images/switch.jpg'
        }, {
            key: 'F3-S1-CE5850',
            image: 'images/switch.jpg'
        },
        // s7706 group
        {
            key: 'S7706-Group',
            isGroup: true
        },
    ];


    var linkDataArray = [
        // layer 1 link
        {
            from: 'C2-5800',
            to: 'C2-6800'
                // stroke: 'black'

        }, {
            from: 'C3-5800',
            to: 'C2-6800'

        }, {
            from: 'C4-5800',
            to: 'C2-6800'

        }, {
            from: 'C5-5800',
            to: 'C2-6800'

        }, {
            from: 'C6-5800',
            to: 'C2-6800'

        }, {
            from: 'C7-5800',
            to: 'C2-6800'
        }, {
            from: 'C2-6800',
            to: 'VS-NeiWang'
        },
        // VS-NeiWang
        {
            from: 'VS-NeiWang',
            to: 'CE-12808-01'
        }, {
            from: 'VS-NeiWang',
            to: 'SS7706'
        },
        // S7706
        {
            from: 'SS7706',
            to: 'E1-Switch'
        }, {
            from: 'SS7706',
            to: 'E2-Switch'
        },
        // sub
        {
            from: 'VS-NeiWang',
            to: 'F1-S1-CE5850'
        }, {
            from: 'VS-NeiWang',
            to: 'F2-S1-CE5850'
        }, {
            from: 'VS-NeiWang',
            to: 'F3-S1-CE5850'
        },
    ];

    myDiagram.model = $(go.GraphLinksModel, {
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray
    });
})()
