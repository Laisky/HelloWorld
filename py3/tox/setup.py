from setuptools import setup, find_packages

requirements = [
    'pip',
]


setup(name='tox_text',
      version='0.1',
      packages=find_packages('src'),
      package_dir={'': 'src'},
      include_package_data=True,
      install_requires=requirements,)
