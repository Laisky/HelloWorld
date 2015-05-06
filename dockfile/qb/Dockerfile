# build project qb

FROM laisky/python
MAINTAINER "ppcelery@gmail.com"

# Set environment variables.
ENV HOME /root

# ADD Github Deploy Key
ADD .ssh $HOME/.ssh

# Add supervisord.conf
ADD supervisord.conf /etc/supervisor/supervisord.conf

# install qb
RUN \
    # config ssh key
    source $HOME/.bashrc && \
    chmod -R 400 $HOME/.ssh && \
    ssh-keyscan github.com >> $HOME/.ssh/known_hosts && \

    # add user
    useradd caigen100 -m -s /bin/bash -U && \
    chmod 755 $HOME && \
    chmod -R 755 $HOME/.pyenv && \

    # clone qb
    mkdir -p /var/www/ && \
    git clone git@github.com:caigen100/qb.git /var/www/qb && \
    chown -R caigen100:caigen100 /var/www/qb && \

    # install
    pip install -r /var/www/qb/requirements.txt && \
    cd /var/www/qb && \
    python /var/www/qb/setup.py develop

EXPOSE 8000


# Define working directory.
WORKDIR /var/www/qb

# Define default command.
CMD ["supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
