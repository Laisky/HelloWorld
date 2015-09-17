from setuptools import setup, find_packages

setup(name='tox_text',
      version='1.9.1',
      packages=find_packages('src'),
      package_dir={'': 'src'},
      include_package_data=True,
      install_requires=[],)
