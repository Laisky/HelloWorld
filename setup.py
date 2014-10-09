#!/usr/bin/env python
# -*- coding: utf-8 -*-
from setuptools import setup, find_packages
from pip.req import parse_requirements


requires = [str(i.req) for i in parse_requirements('requirements.txt')
            if i.req is not None]


setup(name='src',
      version='0.1',
      package=find_packages('src'),
      install_requires=requires)
