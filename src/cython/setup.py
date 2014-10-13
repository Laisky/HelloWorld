#!/usr/bin/env python
# -*- coding: utf-8 -*-
from distutils.core import setup
from distutils.extension import Extension

from Cython.Build import cythonize
from Cython.Distutils import build_ext
import numpy as np


# numpy C extensions
include_path = [np.get_include()]


ext_modules = [
    Extension('cnumpy', ['faster.pyx', 'fastest.pyx'],
              libraries=['m']),
    Extension('*', ['*.pyx'])
]


setup(
    name='cython',
    cmdclass={'build_ext': build_ext},
    ext_modules=cythonize(ext_modules, include_path=include_path)
)
