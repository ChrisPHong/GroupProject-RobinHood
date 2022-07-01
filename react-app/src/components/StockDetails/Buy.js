import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stockTransaction } from '../../store/transaction';

const Buy = ({ user, companyId, ticker, priceArr }) => {
    const dispatch = useDispatch()
    const transactions = useSelector(state => state?.transaction?.entries);
    const userId = user.id;
    console.log('USERRRRR', user)

    // console.log(transactions)
    // const stock = useSelector(state => state?.stock?.entries)
    // const companies = Object.values(stocks)
    // console.log('---companies in buy page', companies)
    const [transactionPrice, setTransactionPrice] = useState((0).toFixed(2));
    const [sharesBought, setSharesBought] = useState(0);
    const [order, setOrder] = useState('buy');
    const [balance, setBalance] = useState(user?.balance)

    const transactionTotal = e => {
        setSharesBought(e.target.value);
        setTransactionPrice((e.target.value * (priceArr[priceArr.length - 1].price)).toFixed(2));
        //  price = market price per share
    }


    const buyStock = async (e) => {
        e.preventDefault();
        setOrder('ordered');
        setBalance((Number(balance) - Number(transactionPrice)).toFixed(2));
        let newBalance = (Number(balance) - Number(transactionPrice)).toFixed(2);

        // console.log('transaction price----', typeof(parseInt(transactionPrice)))
        // console.log('transaction price----', typeof(user.id))
        // console.log('transaction price----', typeof(parseInt(sharesBought)))
        // console.log('transaction price----', typeof(companyId))
        // console.log('transaction price----', typeof('buy'))
        let newTransaction = {
            user_id: user.id,
            shares: parseInt(sharesBought),
            price: parseInt(transactionPrice),
            type: 'buy',
            date: Date.now(),
            company_id: companyId,
            // balance: Number(newBalance)
        }
        // const payload = { companyId, userId };
        dispatch(stockTransaction(newTransaction))
    }

    if (buyStock) {
        setTimeout(() => {
            setOrder('buy');
        }, 3500)
    }

    return (
        <div>
            <form onSubmit={buyStock}>
                <div className='transaction-box'>
                    <div className='transaction-labels' id='buy-label'>Type: Buy</div>
                    <div className='transaction-labels'>Shares</div>
                    <select name="shares" id="shares" onChange={transactionTotal} value={sharesBought}>
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div className='transaction-info'>
                    <div className='transaction-labels'>Market Price</div>
                    <div id='transaction-stock-price'>
                        {/* ${(priceArr[priceArr.length - 1].price).toFixed(2)} */}
                        {priceArr}
                        {priceArr.length}
                    </div>
                </div>
                <hr />
                <div className='transaction-info'>
                    <div className='transaction-labels'>Estimated Cost</div>
                    <div id='transaction-estimate'>
                        ${transactionPrice}
                    </div>
                </div>
                <div className='transaction-btn'>
                    <button id='buy-btn' type="submit"
                        onClick={(e) => {
                        buyStock(e);
                        }}
                        disabled={(balance > Number(transactionPrice) && sharesBought !== "") ? false : true}>
                        {order}
                    </button>
                </div>
                <div className='transaction-labels' id='transaction-balance'>Balance Available: ${balance}</div>
            </form>
        </div>
    )
}
export default Buy;
