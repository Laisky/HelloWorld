# build python3 via pyenv

FROM laisky/base
MAINTAINER "ppcelery@gmail.com"

# install pyenv
RUN \
    # install pyenv
    git clone git://github.com/yyuu/pyenv.git .pyenv & \
    echo '# pyenv' >> /root/.bashrc & \
    echo 'export PYENV_ROOT="/home/laisky/.pyenv"' >> /root/.bashrc & \
    echo 'export PATH="$PYENV_ROOT/bin:$PYENV_ROOT/shims:/usr/texbin:$PATH"' >> /root/.bashrc & \
    echo 'eval "$(pyenv init -)"' >> /root/.bashrc & \

    # install python
    source /root/.bashrc & \
    pyenv install 3.4.1 & \
    pyenv install 2.7.9 & \

    # config
    pyenv global 3.4.1 & \
    pyenv rehash & \
    source /root/.bashrc & \

    # install pip
    wget https://pypi.python.org/packages/source/s/setuptools/setuptools-15.1.tar.gz#md5=10407f6737d8dc37e5310e68c1f1f6ec -O /tmp/setuptools.tar.gz & \
    mkdir /tmp/setuptools & \
    tar -xf /tmp/setuptools.tar.gz -C /tmp/setuptools --strip-components 1 & \
    python /tmp/setuptools/setup.py install & \
    source /root/.bashrc & \

    # install setuptools
    pip install --upgrade setuptools

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /root

# Define default command.
CMD ["bash"]
