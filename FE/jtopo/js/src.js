(function() {

    var canvas = document.getElementById('canvas');
    var stage = new JTopo.Stage(canvas);
    //显示工具栏
    showJTopoToobar(stage);

    var scene = new JTopo.Scene();
    scene.background = './msc.png';

    function node(x, y, img, name) {
        var node = new JTopo.Node(name);
        node.setImage('msc.png', true);
        node.setLocation(x, y);
        scene.add(node);
        return node;
    }

    function linkNode(nodeA, nodeZ) {
        var link = new JTopo.FoldLink(nodeA, nodeZ);
        link.lineWidth = 3;
        link.strokeColor = '255,255,0';
        scene.add(link);
        return link;
    }

    var s1 = node(49, 41, 'satellite_antenna.png', 'Satellitte Feed');
    var s2 = node(57, 136, 'antenna.png', 'Off air');
    var s3 = node(57, 251, 'msc.png', 'Programing');

    var r1 = node(143, 43, 'router.png');
    var r2 = node(143, 63, 'router.png');
    r2.alarm = '2 W';
    var r3 = node(143, 83, 'router.png');
    var r4 = node(143, 103, 'router.png');
    var r5 = node(143, 123, 'router.png', 'Encoder');

    var r6 = node(243, 123, 'router.png', 'Scrambler');
    linkNode(r1, r6);
    linkNode(r2, r6);
    linkNode(r3, r6);
    linkNode(r4, r6);
    linkNode(r5, r6);

    var r7 = node(143, 180, 'router.png');
    var r8 = node(143, 200, 'router.png');
    linkNode(r7, r6);
    linkNode(r8, r6);

    var dataCloud = node(316, 113, 'cloud.png');
    scene.add(new JTopo.Link(dataCloud, r6));

    var tw130 = node(436, 107, 'tw130.png');
    scene.add(new JTopo.Link(tw130, dataCloud));

    var pstn = node(316, 176, 'cloud.png');
    linkNode(pstn, tw130);

    var wdm = node(525, 114, 'wdm.png', 'WDM');
    scene.add(new JTopo.Link(wdm, tw130));

    var testing = node(568, 128, 'testing.png');
    testing.alarm = '1 M';
    scene.add(new JTopo.Link(testing, wdm));

    var wdm2 = node(607, 114, 'wdm.png', 'WDM');
    scene.add(new JTopo.Link(wdm2, testing));

    var mainframe = node(654, 152, 'mainframe.png');
    linkNode(mainframe, wdm2);

    var phone = node(738, 173, 'phone.png', 'Phone');
    linkNode(phone, mainframe);

    var host = node(730, 225, 'host.png', 'Pc');
    linkNode(host, mainframe);

    var router2 = node(706, 282, 'router2.png', 'STB');
    router2.alarm = "1 W";
    router2.alarmColor = '0,255,0';
    linkNode(router2, mainframe);

    var terminal = node(669, 326, 'terminal.png', 'IPTV/SDV');
    linkNode(terminal, router2);

    var modem = node(623, 49, 'modem.png', 'Modem');
    var pc = node(742, 7, 'host.png');
    var router3 = node(671, 73, 'router2.png');
    var terminal3 = node(736, 100, 'terminal.png');

    linkNode(pc, modem);
    linkNode(router3, modem);
    linkNode(terminal3, router3);

    stage.add(scene);
})()
