const LOAD_TRANSACTIONS = 'transaction/loadTransactions';
const BUY_STOCK = 'transactions/BUY_STOCK';
const LOAD_BOUGHT_TRANSACTIONS = 'transaction/loadBoughtTransactions'
// const SELL_STOCK = 'transactions/SELL_STOCK';

// get all transactions
export const loadTransactions = (transactions) => {
    return {
        type: LOAD_TRANSACTIONS,
        transactions
    }
}

// post
export const buyStock = (transaction) => ({
    type: BUY_STOCK,
    transaction
})

export const loadBoughtTransactions = (transactions) => {
    return {
        type: LOAD_BOUGHT_TRANSACTIONS,
        transactions
    }
}

// // delete
// export const sellStock = (transaction) => ({
//     type: SELL_STOCK,
//     payload: transaction
// })

// thunk - get all transactions
export const getAllTransactions = () => async (dispatch) => {
    const response = await fetch('/api/transactions/')

    const transactions = await response.json()
    // console.log('THUNKKK----', transactions)
    dispatch(loadTransactions(transactions))
}

export const getBoughtTransactions = (userId) => async (dispatch) => {
    const response = await fetch(`/api/transactions/${userId}/bought_transactions`)
    console.log('AM I GETTING THIS ')
    const transactions = await response.json()
    console.log('here is the backend info', transactions)
    dispatch(loadBoughtTransactions(transactions))
}

export const getTransactions = (userId) => async (dispatch) => {
    const response = await fetch('/api/transactions/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId})
    })

    if (response.ok) {
        // console.log('RESPONSEEEEEEEE', response)
        const transactions = await response.json()
        // console.log('storeeeeeee', transactions)
        dispatch(loadTransactions(transactions))
    }
}

// thunk - buy/sell stock ??
export const stockTransaction = (data) => async (dispatch) => {
    const res = await fetch(`/api/transactions/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    if (res.ok) {
        const transactionInfo = await res.json()
        dispatch(buyStock(transactionInfo))
    }
}


const initialState = { entries: {}, boughtTrans: {}, isLoading: true }

const transactionReducer = ( state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case LOAD_TRANSACTIONS:
            // console.log('ACTION-----', action.transactions)
            // return {
            //     ...state,
            //     entries: action.transactions
            // }
            newState = { ...state, entries: {...state.entries} }
            action.transactions.forEach(transaction => {newState.entries[transaction.id] = transaction})
            return newState
        case LOAD_BOUGHT_TRANSACTIONS:
            newState = { ...state, entries: { }, boughtTrans: { } }
            action.transactions.forEach(transaction => {newState.boughtTrans[transaction.id] = transaction})
            return newState
        case BUY_STOCK:
            newState = {
                ...state, entries: {
                    ...state.entries,
                    [action.transaction.id]: action.transaction
                }
            }
            return newState;
        default:
            return state
    }
}

export default transactionReducer
