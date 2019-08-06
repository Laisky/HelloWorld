import click


@click.command()
# 命名参数
# 形如 --count 2
@click.option('--count', default=1, help='Number of greetings.')
# 交互式参数
# 会询问输入
@click.option('--name', prompt='Your name', help='The person to greet.')
# 固定参数
@click.argument('title')
def normal(count, name, title):
    """Simple program that greets NAME for a total of COUNT times."""
    for x in range(count):
        click.echo('Hello %s %s!' % (title, name))


# Nested
@click.group()
def cli():
    pass


@cli.command()
@click.option('--name', prompt='databse name', help='Database name')
def initdb(name):
    click.echo('Initialized the database %s' % name)


@cli.command()
@click.option('--name', prompt='databse name', help='Database name')
def dropdb(name):
    click.echo('Dropped the database %s' % name)


if __name__ == '__main__':
    # normal()
    cli()
