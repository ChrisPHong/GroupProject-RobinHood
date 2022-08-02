const LOAD_WATCHLIST = 'watchlist/LOAD'
const POST_WATCHLIST = 'watchlist/POST'
const DELETE_WATCHLIST = 'watchlist/DELETE'
const EDIT_WATCHLIST = 'watchlist/EDIT'
const POST_STOCKS_WATCHLIST = 'stocks/watchlist/POST'
const DELETE_STOCKS_WATCHLIST = 'stocks/watchlist/DELETE'
const CLEAR_ALL_WATCHLISTS = 'watchlist/CLEAR/LOGOUT'

export const loadWatchlist = (watchlists) => {
    return {
        type: LOAD_WATCHLIST,
        watchlists
    }
}

export const postList = (watchlist) => {
    return {
        type: POST_WATCHLIST,
        watchlist
    }
}

export const deleteList = (watchlistId) => {
    return {
        type: DELETE_WATCHLIST,
        watchlistId
    }
}

export const editList = (watchlist) => {
    return {
        type: EDIT_WATCHLIST,
        watchlist
    }
}

export const postStocksWatchlist = (stocks) => {
    return {
        type: POST_STOCKS_WATCHLIST,
        stocks
    }
}

export const deleteStocksWatchlist = (stocks) => {
    return {
        type: DELETE_STOCKS_WATCHLIST,
        stocks
    }
}

export const clearAllWatchlist = (stocks) => {
    return {
        type: CLEAR_ALL_WATCHLISTS,
        stocks
    }
}

export const createStockWatchlists = (payload) => async (dispatch) => {

    const response = await fetch(`/api/watchlists/${payload.watchlistId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })


    if (response.ok) {

        const watchlists = await response.json()

        dispatch(loadWatchlist(watchlists))
    }

}
export const deleteStockWatchlists = (payload) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${payload.watchlistId}/delete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })


    if (response.ok) {
        const watchlists = await response.json()


        dispatch(loadWatchlist(watchlists))
    }

}

export const getWatchlists = (payload) => async (dispatch) => {
    const response = await fetch('/api/watchlists/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const watchlists = await response.json()
        dispatch(loadWatchlist(watchlists))
    }

}
export const postWatchlists = (payload) => async (dispatch) => {
    const response = await fetch('/api/watchlists/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const watchlist = await response.json()
        dispatch(postList(watchlist))
    }

}

export const editWatchlists = (payload) => async (dispatch) => {

    const id = payload.id
    const response = await fetch(`/api/watchlists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    console.log(response, "<<<<< THIS IS THE RESPONSE!")
    if(!response.ok){
        return "The name you provided already exists. Please enter a new value"
    }
    if (response.ok) {

        const watchlist = await response.json()

        dispatch(editList(watchlist))
    }

}

export const deleteWatchList = (watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteList(watchlistId));

        return data
    }
}

export const clearAllWatchList = () => async (dispatch) => {
        dispatch(clearAllWatchlist())
        return {}
}

const initialState = { entries: {}, isLoading: true }


const watchlistReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_WATCHLIST:
            newState = { ...state, entries: { ...state.entries } }
            action.watchlists.map(watchlist => { newState.entries[watchlist.id] = watchlist })
            return newState
        case POST_WATCHLIST:

            newState = {
                ...state, entries: {
                    ...state.entries,
                    [action.watchlist.id]: action.watchlist
                }
            }

            return newState

        case DELETE_WATCHLIST:

            newState = { ...state }
            delete newState.entries[action.watchlistId]
            return newState

        case EDIT_WATCHLIST:
            // if(action.watchlist.errors){
            //     console.log(action.watchlist.errors, "<<<<<<<<<<<< ACTION!")
            //     newState = {
            //         ...state, entries: {
            //             ...state.entries,
            //             error: action.watchlist.errors
            //         }
            //     }
            //     return newState
            // }
            newState = {
                ...state, entries: {
                    ...state.entries,
                    [action.watchlist.id]: action.watchlist
                }
            }
            return newState
        case POST_STOCKS_WATCHLIST:
            newState = { ...state, entries: { ...state.entries, watchComps: { ...state.entries.watchComps, [action.watchlists.watchComps.id]: action.watchlists.watchComps } } }

            return newState
        case DELETE_STOCKS_WATCHLIST:
            newState = { ...state }
            delete state.entries.watchComps[action.watchlists.watchComps.id]
        case CLEAR_ALL_WATCHLISTS:
            return { entries: {}, isLoading: true }
        default:
            return state
    }
}

export default watchlistReducer
