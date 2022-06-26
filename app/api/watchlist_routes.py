from flask import Blueprint
from flask_login import login_required, current_user
from app.forms import WatchlistForm
from models import Watchlist, db, Company

watchlist_routes = Blueprint('watchlists', __name__, url_prefix='/watchlists')

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

# Users can create a new watchlist
@watchlist_routes.route('/', methods=['POST'])
@login_required
def post_watchlists():
    form = WatchlistForm()
    if form.validate_on_submit():
        new_watchlist = WatchlistForm(
            name=form.data['name'],
            userId = current_user.get_id()
        )
        db.session.add(new_watchlist)
        db.session.commit()
        return new_watchlist.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# Users will get their watchlist
# @watchlist_routes.route('/<int:id>')
# def get_watchlists(id):
#     watchlist = Watchlist.query.filter(Watchlist.id == id).first()
#     return watchlist.to_dict()

# Users can update their watchlist
@watchlist_routes.route('/<int:id>', methods=['PUT'])
def put_watchlists(id):
    form = UpdateWatchListForm() # Do we need UpdateWatchListForm?
    watchlist = Watchlist.query.filter(Watchlist.id == id).first()
    watchlist.name = form['name']
    db.session.commit()
    return watchlist.to_dict()

# Users can delete their watchlist
@watchlist_routes.route('/<int:id>', methods=['DELETE'])
def delete_watchlists(id):
    watchlist = Watchlist.query.filter(Watchlist.id == id).first()
    db.session.delete(watchlist)
    db.session.commit()
    # Are we returning the the updated list after a list has been deleted?
    return watchlist.to_dict()
