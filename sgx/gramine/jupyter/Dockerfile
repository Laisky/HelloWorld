FROM ppcelery/gramine:base-20221114

WORKDIR /app
ADD . .

RUN make SGX=1

RUN chmod +rx -R /app && \
    adduser --disabled-password --gecos '' laisky
USER laisky

CMD gramine-sgx python3 -c 'import os; print(os.listdir("."))'
# CMD gramine-sgx python3 -m jupyter notebook --ip=0.0.0.0 --port=8888
# CMD gramine-sgx python3 -c 'import numpy; numpy.core.test()'
