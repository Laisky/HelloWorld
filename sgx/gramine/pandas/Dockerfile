FROM ppcelery/gramine:base-20221110-4

WORKDIR /app
ADD . .

ENV PYTHONPATH="/usr/local/lib/python38.zip:/usr/local/lib/python3.8:/usr/local/lib/python3.8/lib-dynload:/usr/local/lib/python3.8/site-packages"

RUN make SGX=1

# CMD gramine-sgx python3 -c 'import os; print(os.listdir("."))'
CMD gramine-sgx python3 demo.py
