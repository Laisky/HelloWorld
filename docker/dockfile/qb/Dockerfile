# build project qb

FROM laisky/python
MAINTAINER "ppcelery@gmail.com"

# ADD Github Deploy Key
ADD .ssh /root/.ssh

# Add supervisord.conf
ADD supervisord.conf /etc/supervisor/supervisord.conf

# install qb
RUN \
    # config ssh key
    source /root/.bashrc && \
    chmod -R 400 /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts && \

    # add user
    useradd caigen100 -m -s /bin/bash -U && \

    # clone qb
    mkdir -p /var/www/ && \
    git clone git@github.com:caigen100/qb.git /var/www/qb && \
    chown -R caigen100:caigen100 /var/www/qb && \

    # install
    pip install -r /var/www/qb/requirements.txt && \
    cd /var/www/qb && \
    python /var/www/qb/setup.py develop && \

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /var/www/qb

# Define default command.
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
