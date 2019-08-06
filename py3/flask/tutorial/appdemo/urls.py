from flask import Blueprint


# http://localhost:27855/appdemo/123
urlpattern = Blueprint('first_ticket', __name__,
                       template_folder='templates')


@urlpattern.route('/', defaults={'page': 'index'}, methods=['GET'])
@urlpattern.route('/<page>')
def show(page):
    return 'GET Page show for page: {}'.format(page)
