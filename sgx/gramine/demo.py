from kipp.utils import get_logger
import sys


def main():
    print(f"get args {sys.argv}")
    get_logger().info("Hello World")

if __name__ == '__main__':
    main()
