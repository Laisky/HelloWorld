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

    # ssh
    mkdir -p /var/run/sshd && \
    echo 'root:screencast' | chpasswd && \
    sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    # SSH login fix. Otherwise user is kicked off after login
    sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

EXPOSE 22

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /var/www/qb

# Define default command.
CMD ["supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
