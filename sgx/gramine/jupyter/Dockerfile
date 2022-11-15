# db . -t jupyter
FROM ppcelery/gramine:base-20221115

RUN python3 -m pip install jupyter "MarkupSafe<2.1"

WORKDIR /app
ADD . .

RUN chmod +rx -R /app \
    && chmod 777 /app \
    && adduser --disabled-password -u 6666 --gecos '' laisky
USER laisky

RUN mkdir notebook

RUN make SGX=1

# CMD gramine-sgx python3 -c 'import os; print(os.listdir("."))'
# CMD gramine-sgx python3 -m jupyter notebook --ip="*" --port=8888 --no-browser --notebook-dir=notebook
CMD gramine-sgx python3 -m jupyter notebook --config='/app/jupyter_notebook_config.py'
# CMD gramine-sgx python3 -c 'import numpy; numpy.core.test()'
