# build project qb

FROM laisky/python
MAINTAINER "ppcelery@gmail.com"

# ADD Github Deploy Key
ADD root/.ssh /root/.ssh

# install qb
RUN \
    git clone git@github.com:caigen100/qb.git qb
