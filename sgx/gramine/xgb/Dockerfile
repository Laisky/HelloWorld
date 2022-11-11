FROM ppcelery/gramine:base-20221110-6

WORKDIR /app
ADD . .

RUN make SGX=1

# CMD gramine-sgx python3 -c 'import os; print(os.listdir("."))'
CMD gramine-sgx python3 demo.py
