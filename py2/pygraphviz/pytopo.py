#! /usr/bin/env python
# -*- coding: utf-8


"""
@description: Generate network topological graph by pygraphviz_1.3rc.
@created_at: Mon Aug 24 16:21:10 2015
@author: Laisky
@copyright: 2015/Laisky
@license: MIT/Apache
@demo: https://github.com/Laisky/HelloWorld/blob/master/py2/pygraphviz/pytopo.ipynb
"""


from __future__ import unicode_literals, division
from collections import namedtuple

import pygraphviz as pgv


BOX_SIZE = namedtuple('boxsize', ('width', 'height'))
GRAPH_SIZE = BOX_SIZE(400, 400)
NODE_SIZE = BOX_SIZE(50, 50)


def gen_label(label=None, image=None):
    return (
        '<<table border="0" align="center">'
        '<tr><td fixedsize="true" width="{width}" height="{width}"><img src="{image}" /></td></tr>'
        '<tr><td>{label}</td></tr>'
        '</table>>'
    ).format(width=NODE_SIZE.width, height=NODE_SIZE.height, label=label, image=image)


class TopoGraph(object):

    def __init__(self):
        g = pgv.AGraph(
            directed=True,
            rankdir='LR',
            encoding='UTF-8',
            compound=True,  # 可以让箭头指向 cluster
            size='{width},{height}'.format(width=GRAPH_SIZE.width, height=GRAPH_SIZE.height)
        )
        self.g = g
        self.nodes = set([])
        self.edges = set([])

    def add_node(self, node):
        assert node.node_name not in self.nodes
        self.g.add_node(**node.kwargs)
        self.nodes.add(node.node_name)
        return node.node_name

    def add_edge(self, source, target, *attrs, **kw):
        assert source in self.nodes, 'source not exists!'
        assert target in self.nodes, 'target not exists!'
        nodes_name_ = (source, target)
        edge_name_ = ('{}-{}'.format(min(nodes_name_), max(nodes_name_)))
        assert edge_name_ not in self.edges, 'edges already exists!'
        self.g.add_edge(source, target, *attrs, **kw)
        self.edges.add(edge_name_)

    def set_same_rank(self, nodes, *args, **kw):
        self.g.add_subgraph(nodes, rank='same', *args, **kw)

    def draw(self, path):
        self.g.layout('dot')
        self.g.draw(path, format='jpg')


class Node(object):

    def __init__(self, node_name, label=None, image=None, graph=None):
        assert label or image, 'Create node need at least one label or image.'
        self.node_name = node_name
        self.kwargs = {
            'n': node_name,
            'shape': 'plaintext',
            'label': gen_label(label, image)
        }

        if graph:
            self.add_to_graph(graph)

    def add_to_graph(self, graph):
        graph.add_node(self)


class RouterNode(Node):

    def __init__(self, node_name, label='路由器', image='./img/router.jpg', graph=None):
        super(RouterNode, self).__init__(node_name, label, image, graph)


class NetworkNode(Node):

    def __init__(self, node_name, label='网线', image='./img/network.jpg', graph=None):
        super(NetworkNode, self).__init__(node_name, label, image, graph)


class CoreRouterNode(Node):

    def __init__(self, node_name, label='核心路由器', image='./img/core-router.jpg', graph=None):
        super(CoreRouterNode, self).__init__(node_name, label, image, graph)


class ServerNode(Node):

    def __init__(self, node_name, label='服务器', image='./img/server.jpg', graph=None):
        super(ServerNode, self).__init__(node_name, label, image, graph)


class SwitchNode(Node):

    def __init__(self, node_name, label='交换机', image='./img/switch.jpg', graph=None):
        super(SwitchNode, self).__init__(node_name, label, image, graph)


class FirewallNode(Node):

    def __init__(self, node_name, label='防火墙', image='./img/firewall.jpg', graph=None):
        super(FirewallNode, self).__init__(node_name, label, image, graph)


class S5700Node(Node):

    def __init__(self, node_name, label='S5700', image='./img/s5700.jpg', graph=None):
        super(S5700Node, self).__init__(node_name, label, image, graph)


class LinkproofNode(Node):

    def __init__(self, node_name, label='LinkProof', image='./img/link_proof.jpg', graph=None):
        super(LinkproofNode, self).__init__(node_name, label, image, graph)
