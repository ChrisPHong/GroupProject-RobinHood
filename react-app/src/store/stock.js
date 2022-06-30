const LOAD_STOCKS = 'stock/loadStocks'
const LOAD_OWNED_WEEKLY_PRICES = 'stock/loadOwnedWeeklyPrices'
const LOAD_ONE_STOCK = 'stock/loadOneStock'

export const loadStocks = (stocks) => {
    return {
        type: LOAD_STOCKS,
        stocks
    }
}

export const loadOwnedWeeklyPrices = (companies) => {
    return {
        type: LOAD_OWNED_WEEKLY_PRICES,
        companies
    }
}

export const loadOneStock = (stock) => {
    return {
        type: LOAD_ONE_STOCK,
        stock
    }
}

export const loadTest = (func) => {
    return {
        type: LOAD_TESTS,
        func
    }
}

export const getStocks = () => async (dispatch) => {
    const response = await fetch('/api/stocks/')

    const stocks = await response.json()
    dispatch(loadStocks(stocks))
}

export const getOwnedWeeklyPrices = (userId) => async (dispatch) => {
    const response = await fetch('/api/stocks/weekly', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId})
    })

    if (response.ok) {
        const companies = await response.json()
        dispatch(loadOwnedWeeklyPrices(companies))
    }
}

export const getOneStock = (ticker) => async (dispatch) => {
    const response = await fetch(`/api/stocks/${ticker}`)

    const stock = await response.json()
    dispatch(loadOneStock(stock))
}


const initialState = { entries: {}, isLoading: true }


const stockReducer = ( state = initialState, action ) => {
    let newState
    switch (action.type) {
        case LOAD_STOCKS:
            newState = { ...state, entries: {...state.entries} }
            action.stocks.forEach(stock => newState.entries[stock.id] = stock)
            return newState
        case LOAD_OWNED_WEEKLY_PRICES:
            newState = { ...state, entries: {...state.entries} }
            action.companies.forEach(company => newState.entries[company.id] = company)
            return newState
        case LOAD_ONE_STOCK:
            newState = {entries:{}}
            newState.entries[action.stock.ticker] = action.stock
            return newState
        default:
            return state
    }
}

export default stockReducer
