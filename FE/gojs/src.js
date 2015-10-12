(function() {
    var $ = go.GraphObject.make;

    // 创建图标
    var myDiagram =
        $(go.Diagram, 'myDiagramDiv', {
            initialContentAlignment: go.Spot.Center,
            'undoManager.isEnabled': true
        });


    // 节点模板
    myDiagram.nodeTemplate = $(go.Node, 'Vertical',
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify), {
            cursor: 'pointer',
            portId: "",
            width: 100,
            height: 100
        },
        $(go.Picture, {
                margin: 0,
                width: 50,
                height: 50,
                // portId: '',
                // fromSpot: go.Spot.Right,
                // toSpot: go.Spot.Left
            },
            new go.Binding('scale', 'scale').makeTwoWay(),
            new go.Binding('source', 'image').makeTwoWay()
        ),
        $(go.TextBlock, '', {
                margin: 2,
                stroke: 'blue',
                font: 'bolder 12px sans-serif',
            },
            new go.Binding('text', 'key').makeTwoWay()
        )
    );


    // 连接模板
    myDiagram.linkTemplate = $(go.Link, {
            // routing: go.Link.Orthogonal,
            // curve: go.Link.JumpGap,
            // 弧线
            curve: go.Link.Bezier,
            // 跳线
            // routing: go.Link.Orthogonal,
            // curve: go.Link.JumpOver,
            // corner: 10,
            // 绕线
            // routing: go.Link.AvoidsNodes,
            // 直线
            // curve: go.Link.Bezier,
            // adjusting: go.Link.Stretch,
            // reshapable: true
        },
        new go.Binding('curviness', 'curviness'),
        new go.Binding('points').makeTwoWay(),
        $(go.Shape, // the link shape
            {
                strokeWidth: 0.2,
                stroke: 'black'
            },
            new go.Binding('stroke', 'stroke').makeTwoWay()
        ),
        $(go.TextBlock, '', {
                segmentOffset: new go.Point(0, -10),
                textAlign: 'center',
                font: '10pt helvetica, arial, sans-serif',
                stroke: 'red',
                margin: 0,
                editable: false
            },
            new go.Binding('text', 'text').makeTwoWay(),
            new go.Binding('stroke', 'stroke').makeTwoWay()
        )
    );

    // 点击事件
    myDiagram.addDiagramListener("ObjectSingleClicked",
        function(e) {
            var part = e.subject.part;
            if (!(part instanceof go.Link)) console.log("Clicked on " + part.data.key);
        });

    /**
     * ---------------------------------------------------
     */

    // 节点数据
    var nodeDataArray = [
        // layer 1 switch
        {
            key: 'C2-5800',
            loc: '0 0',
            image: 'images/switch.jpg'
        }, {
            key: 'C3-5800',
            loc: '0 100',
            image: 'images/switch.jpg'
        }, {
            key: 'C4-5800',
            loc: '0 200',
            image: 'images/switch.jpg'
        }, {
            key: 'C5-5800',
            loc: '0 300',
            image: 'images/switch.jpg'
        }, {
            key: 'C6-5800',
            loc: '0 400',
            image: 'images/switch.jpg'
        }, {
            key: 'C7-5800',
            loc: '0 500',
            image: 'images/switch.jpg'
        },
        // kernel
        {
            key: 'C2-6800',
            scale: 1.5,
            loc: '150 250',
            image: 'images/switch.jpg'
        }, {
            key: 'SS7706',
            scale: 1.5,
            loc: '300 400',
            image: 'images/switch.jpg'
        }, {
            key: 'VS-NeiWang',
            scale: 1.5,
            loc: '300 250',
            image: 'images/switch.jpg'
        }, {
            key: 'CE-12808-01',
            scale: 1.5,
            loc: '300 0',
            image: 'images/switch.jpg'
        }, {
            key: 'E1-Switch',
            scale: 1.2,
            loc: '250 550',
            image: 'images/switch.jpg'
        }, {
            key: 'E2-Switch',
            scale: 1.2,
            loc: '350 550',
            image: 'images/switch.jpg'
        },
        // sub
        {
            key: 'F1-S1-CE5850',
            scale: 1,
            loc: '500 0',
            image: 'images/switch.jpg'
        }, {
            key: 'E9-S1-CE5850',
            scale: 1,
            loc: '500 75',
            image: 'images/switch.jpg'
        }, {
            key: 'F2-S1-CE5850',
            scale: 1,
            loc: '500 150',
            image: 'images/switch.jpg'
        }, {
            key: 'E10-S1-CE5850',
            scale: 1,
            loc: '500 225',
            image: 'images/switch.jpg'
        }, {
            key: 'F3-S2-CE6850',
            scale: 1,
            loc: '500 300',
            image: 'images/switch.jpg'
        }, {
            key: 'F3-S1-CE6850',
            scale: 1,
            loc: '500 375',
            image: 'images/switch.jpg'
        }, {
            key: 'HX-S5700',
            scale: 1,
            loc: '500 450',
            image: 'images/switch.jpg'
        }, {
            key: 'E7-S5700-SW2',
            scale: 1,
            loc: '600 0',
            image: 'images/switch.jpg'
        }, {
            key: 'F4-CE5850-S1',
            scale: 1,
            loc: '600 75',
            image: 'images/switch.jpg'
        }, {
            key: 'E8-S5700-02',
            scale: 1,
            loc: '600 150',
            image: 'images/switch.jpg'
        }, {
            key: 'F5-CE5850-S1',
            scale: 1,
            loc: '600 225',
            image: 'images/switch.jpg'
        }, {
            key: 'F5-CE5850-S2',
            scale: 1,
            loc: '600 300',
            image: 'images/switch.jpg'
        }, {
            key: 'E7-S5700-01',
            scale: 1,
            loc: '600 375',
            image: 'images/switch.jpg'
        }, {
            key: 'E8-S5700-01',
            scale: 1,
            loc: '600 450',
            image: 'images/switch.jpg'
        }, {
            key: 'F6-S5700',
            scale: 1,
            loc: '700 0',
            image: 'images/switch.jpg'
        }, {
            key: 'F7-S5700',
            scale: 1,
            loc: '700 75',
            image: 'images/switch.jpg'
        }, {
            key: 'F8-S5700',
            scale: 1,
            loc: '700 150',
            image: 'images/switch.jpg'
        }, {
            key: 'F9-S5700',
            scale: 1,
            loc: '700 225',
            image: 'images/switch.jpg'
        }, {
            key: 'F10-S5700',
            scale: 1,
            loc: '700 300',
            image: 'images/switch.jpg'
        }, {
            key: 'E18-S1-CE5850',
            scale: 1,
            loc: '700 375',
            image: 'images/switch.jpg'
        }
    ];


    // 连接数据
    var linkDataArray = [
        // layer 1 link
        {
            from: 'C2-5800',
            to: 'C2-6800'
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
            loc: '750 0',
            to: 'F1-S1-CE5850'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'E9-S1-CE5850'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F2-S1-CE5850'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'E10-S1-CE5850'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F3-S2-CE6850'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F3-S1-CE6850'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'HX-S5700'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'E7-S5700-SW2'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F4-CE5850-S1'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'E8-S5700-02'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F5-CE5850-S1'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F5-CE5850-S2'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'E7-S5700-01'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'E8-S5700-01'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F6-S5700'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F7-S5700'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F8-S5700'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F9-S5700'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'F10-S5700'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'CE12808-01'
        }, {
            from: 'VS-NeiWang',
            loc: '750 0',
            to: 'E18-S1-CE5850'
        }
    ];

    myDiagram.model = $(go.GraphLinksModel, {
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray
    });
})()
