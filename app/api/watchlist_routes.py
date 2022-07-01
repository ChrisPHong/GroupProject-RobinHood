from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.forms import WatchlistForm
from app.models import Watchlist, db, Company
import json

watchlist_routes = Blueprint('watchlists', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

# Users can get all their watchlists
@watchlist_routes.route('/')
@login_required
def get__all_watchlists():
    watchlists = Watchlist.query.filter(Watchlist.user_id == current_user.get_id()).all()
    # print('<<<<<<<<<< watchlists >>>>>>>>>', [watchlist.to_dict() for watchlist in watchlists])
    return jsonify([watchlist.to_dict() for watchlist in watchlists])


# Users can create a new watchlist
@watchlist_routes.route('/', methods=['POST'])
# @login_required
def post_watchlists():
    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_watchlist = Watchlist(
            name=form.data['name'],
            user_id = request.json['userId']

        )
        db.session.add(new_watchlist)
        db.session.commit()
        return new_watchlist.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# Users can update their watchlist
@watchlist_routes.route('/<int:id>', methods=['PATCH'])
def patch_watchlists(id):

    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    watchlist = Watchlist.query.filter(Watchlist.id == id).first()

    print(watchlist, "INSIDE THE EDIT ROUTE AND THIS IS THE WATCHLIST")

    if form.validate_on_submit():
        watchlist.name = form.data['name']
        db.session.add(watchlist)
        db.session.commit()
        return watchlist.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}

# Users can delete their watchlist
@watchlist_routes.route('/<int:id>', methods=['DELETE'])
def delete_watchlists(id):
    watchlist = Watchlist.query.filter(Watchlist.id == id).first()
    db.session.delete(watchlist)
    db.session.commit()

    return watchlist.to_dict()

@watchlist_routes.route('/<int:id>/add', methods=['POST'])
@login_required
def post_company_watchlists(id):
    # payload = request.json['payload']
    # print('----------- payload in backend ----------------', payload)
    ticker = request.json['ticker']
    # id = request.json['payload'].watchlistId
    print('<<<<<<<<<<< ticker >>>>>>>', ticker)
    print('<<<<<<<<<<< id >>>>>>>', id)


    watchlist = Watchlist.query.filter(Watchlist.id == id).first()
    stock = Company.query.filter(Company.ticker == ticker.upper()).first()

    watchlist.watch_comps.append(stock)
    print('<<<<<<<<<< watchlist >>>>>>>>>>>>>>', watchlist)
    print('<<<<<<<<<< stock >>>>>>>>>>>>>>', stock)

    # db.session.add(new_company_watchlist)
    db.session.commit()
    watchlists = Watchlist.query.filter(Watchlist.user_id == current_user.get_id()).all()
    # print('<<<<<<<<<< watchlists >>>>>>>>>', [watchlist.to_dict() for watchlist in watchlists])
    return jsonify([watchlist.to_dict() for watchlist in watchlists])
    return "Added company to watchlist"

    # Seed Data example
    #     name="Tech",
    #     user_id=1,
    #     watch_comps = tech_companies

    # return {'errors': validation_errors_to_error_messages(form.errors)}
