# build project qb

FROM laisky/python
MAINTAINER "ppcelery@gmail.com"

# ADD Github Deploy Key
ADD .ssh /root/.ssh

# install qb
RUN \
    # config ssh key
    source /root/.bashrc && \
    chmod -R 400 /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts && \

    # clone qb
    git clone git@github.com:caigen100/qb.git qb && \

    # install
    pip install -r /root/qb/requirements.txt && \
    cd /root/qb && \
    python /root/qb/setup.py develop

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /root

# Define default command.
CMD ["bash"]
