#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Setup script for PyGraphviz
"""
from __future__ import absolute_import
from __future__ import print_function
from __future__ import division

from glob import glob
import os
import sys
if os.path.exists('MANIFEST'): os.remove('MANIFEST')

from distutils.core import setup, Extension

from setup_extra import pkg_config, dotneato_config

if sys.argv[-1] == 'setup.py':
    print("To install, run 'python setup.py install'")
    print()

if sys.version_info[:2] < (2, 6):
    print("PyGraphviz requires Python version 2.6 or later (%d.%d detected)." % \
          sys.version_info[:2])
    sys.exit(-1)

include_dirs = None
library_dirs = None
define_macros = []

# If the setup script couldn't find your graphviz installation you can
# specify it here by uncommenting these lines or providing your own:
# You must set both 'library_dirs' and 'include_dirs'

# Linux, generic UNIX
#library_dirs='/usr/lib/graphviz'
#include_dirs='/usr/include/graphviz'

# OSX, Linux, alternate location
#library_dirs='/usr/local/lib/graphviz'
#include_dirs='/usr/local/include/graphviz'

# OSX (Fink)
#library_dirs='/sw/lib/graphviz'
#include_dirs='/sw/include/graphviz'

# OSX (MacPorts)
#library_dirs='/opt/local/lib/graphviz'
#include_dirs='/opt/local/include/graphviz'

# Windows
# Unknown - use command line -I and -L switches to set

if sys.platform == "win32":
    define_macros.append(('GVDLL', None))

else:
    # Attempt to find Graphviz installation
    if library_dirs is None and include_dirs is None:
        print("Trying pkg-config")
        include_dirs,library_dirs = pkg_config()

    if library_dirs is None and include_dirs is None:
        print("Trying dotneato-config")
        include_dirs, library_dirs = dotneato_config()

    if library_dirs is None or include_dirs is None:
        print()
        print("""Your Graphviz installation could not be found.

    1) You don't have Graphviz installed:
       Install Graphviz (http://graphviz.org)

    2) Your Graphviz package might incomplete.
       Install the binary development subpackage (e.g. libgraphviz-dev or similar.)

    3) You are using Windows
       There are no PyGraphviz binary packages for Windows but you might be
       able to build it from this source.  See
       http://networkx.lanl.gov/pygraphviz/reference/faq.html

    If you think your installation is correct you will need to manually
    change the include_dirs and library_dirs variables in setup.py to
    point to the correct locations of your graphviz installation.

    The current setting of library_dirs and include_dirs is:""")
        print("library_dirs=%s"%library_dirs)
        print("include_dirs=%s"%include_dirs)
        print()
        raise OSError("Error locating graphviz.")

print("library_dirs=%s" % library_dirs)
print("include_dirs=%s" % include_dirs)

if library_dirs:
    library_dirs = [library_dirs]

if include_dirs:
    include_dirs = [include_dirs]

# Write the version information.
sys.path.insert(0, 'pygraphviz')
import release
release.write_versionfile()
sys.path.pop(0)

packages = ["pygraphviz", "pygraphviz.tests"]
docdirbase = 'share/doc/pygraphviz-%s' % release.version
data = [
    (docdirbase, glob("*.txt")),
    (os.path.join(docdirbase, 'examples'), glob("examples/*.py")),
    (os.path.join(docdirbase, 'examples'), glob("examples/*.dat")),
    (os.path.join(docdirbase, 'examples'), glob("examples/*.dat.gz")),
]

extension_args = {}
if sys.platform != "win32":
    extension_args['runtime_library_dirs'] = library_dirs

extension = [
    Extension(
        "pygraphviz._graphviz",
        ["pygraphviz/graphviz_wrap.c"],
        include_dirs=include_dirs,
        library_dirs=library_dirs,
        libraries=["cgraph", "cdt"],
        define_macros=define_macros,
        **extension_args
    )
]

package_data = {'': ['*.txt'], }

if __name__ == "__main__":
    setup(
        name=release.name,
        version=release.version,
        author=release.authors['Hagberg'][0],
        author_email=release.authors['Hagberg'][1],
        description=release.description,
        keywords=release.keywords,
        long_description=release.long_description,
        license=release.license,
        platforms=release.platforms,
        url=release.url,
        download_url=release.download_url,
        classifiers=release.classifiers,
        packages=packages,
        data_files=data,
        ext_modules=extension,
        package_data=package_data
    )
