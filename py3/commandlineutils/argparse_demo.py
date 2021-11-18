import argparse
import textwrap


def parse_command(host='1.1.1.1', port=3306,
                  db='messerflow', user='root', passwd='devops'):
    parser = argparse.ArgumentParser('Update Messerflow Database.',
                                     formatter_class=argparse.RawTextHelpFormatter  # <-- 支持输出多行 help
                                     )
    # 定义多行的 help
    parser.add_argument('--host', type=str, default=host,
                        help=textwrap.dedent('''\
                        Database address:
                            first line
                            second line
                        '''))
    parser.add_argument('--port', type=int, default=port, help='Database port')
    parser.add_argument('--db', type=str, default=db, help='Database name')
    parser.add_argument('--user', type=str, default=user, help='Database auth username')
    parser.add_argument('--passwd', type=str, default=passwd, help='Database auth password')

    return parser.parse_args()


if __name__ == '__main__':
    r = parse_command()
    print(r)
