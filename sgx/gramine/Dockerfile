FROM python:3.9.13-bullseye

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends g++ make gcc git build-essential ca-certificates curl \
    libxslt-dev libxml2-dev libc-dev libssl-dev libffi-dev zlib1g-dev \
    && update-ca-certificates

# install gramine
# RUN curl -fsSLo /usr/share/keyrings/gramine-keyring.gpg https://packages.gramineproject.io/gramine-keyring.gpg && \
#     echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/gramine-keyring.gpg] https://packages.gramineproject.io/ stable main' | sudo tee /etc/apt/sources.list.d/gramine.list && \
#     apt-get update && \
#     apt-get install gramine

WORKDIR /app
ADD ./requirements.txt .
RUN pip install -r requirements.txt


ADD . .

# RUN python setup.py install

RUN adduser --disabled-password --gecos '' laisky \
    && chown -R laisky:laisky /app
USER laisky

CMD [ "python" , "demo.py" ]
