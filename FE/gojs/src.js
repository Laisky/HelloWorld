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
            },
            new go.Binding('scale', 'scale').makeTwoWay(),
            new go.Binding('source', 'image').makeTwoWay()
        ),
        $(go.TextBlock, '', {
                margin: 2,
                stroke: 'blue',
                font: 'bolder 14px sans-serif',
            },
            new go.Binding('text', 'key').makeTwoWay()
        )
    );


    // 连接模板
    myDiagram.linkTemplate = $(go.Link, {
            // 跳线
            // routing: go.Link.Orthogonal,
            // curve: go.Link.JumpOver,
            // corner: 10,
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
        $(go.TextBlock, '', {
                segmentOffset: new go.Point(0, -10),
                textAlign: 'center',
                font: '10pt helvetica, arial, sans-serif',
                stroke: 'red',
                margin: 0,
                editable: true
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
            loc: '300 250',
            image: 'images/switch.jpg'
        }, {
            key: 'SS7706',
            scale: 1.5,
            loc: '450 400',
            image: 'images/switch.jpg'
        }, {
            key: 'VS-NeiWang',
            scale: 1.5,
            loc: '450 250',
            image: 'images/switch.jpg'
        }, {
            key: 'CE-12808-01',
            scale: 1.5,
            loc: '450 0',
            image: 'images/switch.jpg'
        }, {
            key: 'E1-Switch',
            scale: 1.2,
            loc: '400 550',
            image: 'images/switch.jpg'
        }, {
            key: 'E2-Switch',
            scale: 1.2,
            loc: '500 550',
            image: 'images/switch.jpg'
        },
        // sub switch
        {
            key: 'F1-S1-CE5850',
            loc: '800 0',
            image: 'images/switch.jpg'
        }, {
            key: 'F2-S1-CE5850',
            loc: '800 100',
            image: 'images/switch.jpg'
        }, {
            key: 'F3-S1-CE5850',
            loc: '800 200',
            image: 'images/switch.jpg'
        },
    ];


    // 连接数据
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
