import time

from tqdm import tqdm


tasks = range(100)


def main():
    for t in tqdm(tasks, desc='Loading'):
        process(t)


def process(t):
    time.sleep(0.1)


if __name__ == '__main__':
    main()
