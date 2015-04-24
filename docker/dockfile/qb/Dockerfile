# build project qb

FROM laisky/python
MAINTAINER "ppcelery@gmail.com"

# ADD Github Deploy Key
ADD .ssh /root/.ssh

# install qb
RUN \
    # config ssh key
    chmod -R 400 /root/.ssh && \
    touch /root/.ssh/known_hosts && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts && \

    # clone qb
    git clone git@github.com:caigen100/qb.git qb
