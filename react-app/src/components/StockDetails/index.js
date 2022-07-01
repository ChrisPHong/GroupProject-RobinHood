import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOneStock, getStockPrices } from '../../store/stock';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import News from '../News'
import { getCompanyNews } from '../../store/news';
import './StockDetails.css'

const StockDetails = () => {
    const dispatch = useDispatch()
    const { ticker } = useParams()
    // console.log(ticker.toUpperCase())
    const stock = useSelector(state => state?.stock?.entries[ticker.toUpperCase()])
    const news = useSelector(state => state?.news?.entries)
    const prices = useSelector(state => state?.stock?.prices)
    // console.log(prices)
    const pricesData = Object.values(prices)
    // console.log(pricesData)
    // console.log('why are prices not rendering', prices)
    // console.log('heres the pricesData that DOESNT WANNA WORK SOMETIMES SMH', pricesData)

    const [data, setData] = useState(pricesData)
    const [currPrice, setCurrPrice] = useState(data[data?.length - 1])

    let min = Infinity
    let max = -Infinity
    if (stock) {
        // console.log(stock.prices)
        for (let i = 0; i < prices?.length; i++) {
            if (prices[i] < min) {
                min = prices[i].toFixed(2);
            }
            if (stock?.prices[i] > max) {
                max = prices[i].toFixed(2);
            }
        }
    }
    // console.log(min)
    // console.log(max)
    // getting stocks from backend
    useEffect(() => {
        if (stock === undefined) {
            dispatch(getCompanyNews(ticker))
            dispatch(getOneStock(ticker))
            dispatch(getStockPrices(ticker))
        }
    }, [dispatch, stock])

    useEffect(() => {
        createData('1w')
    }, [pricesData?.length])

    const createData = (time) => {
        if (time === '1y') {
            setData(pricesData)
            return data
        }
        if (time === '1w') {
            setData(pricesData?.slice(-7))
            return data
        }
        if (time === '1m') {
            setData(pricesData?.slice(-30))
            return data
        }
        if (time === '3m') {
            setData(pricesData?.slice(-90))
            return data
        }
        if (time === '6m') {
            setData(pricesData?.slice(-(Math.floor(pricesData?.length / 2))))
            return data
        }
    }

    const lineMouseOver = (price) => {
        if (price) {
            setCurrPrice(price?.toFixed(2))
        }
    }

    // Customized tooltip to show price and date
    const customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-price">{`$${((payload[0].value)).toFixed(2)}`}</p>
                    <p className="tooltip-date">{label}</p>
                </div>
            );
        }
        return null;
    }

    return (
        <div id='stocks-detail-ctn'>
            {/* -------------------- LINE CHART HERE -------------------- */}
            <div className='asset-chart'>
                <LineChart
                    width={950}
                    height={300}
                    data={data}
                    onMouseMove={(e) => lineMouseOver(e?.activePayload && e?.activePayload[0].payload.price)}
                >
                    <XAxis dataKey="date" hide='true' />
                    <YAxis dataKey="price" domain={['dataMin', 'dataMax']} hide='true' />
                    <Tooltip
                        cursor={false}
                        content={customTooltip}
                    />
                    <Line
                        type="linear"
                        dataKey="price"
                        stroke="#0b7cee"
                        activeDot={{ r: 5 }}
                        dot={false}
                        animationDuration={500}
                        strokeWidth={2}
                    />
                </LineChart>
            </div>
            <div className='stock-chart-bottom'>
                <div className='stock-timeframe'>
                    <span className='weekly'>
                        <button
                            value='1w'
                            onClick={e => createData(e.target.value)}
                        >
                            1W
                        </button>
                    </span>
                    <span className='monthly'>
                        <button
                            value='1m'
                            onClick={e => createData(e.target.value)}
                        >
                            1M
                        </button>
                    </span>
                    <span className='three-months'>
                        <button
                            value='3m'
                            onClick={e => createData(e.target.value)}
                        >
                            3M
                        </button>
                    </span>
                    <span className='six-months'>
                        <button
                            value='6m'
                            onClick={e => createData(e.target.value)}
                        >
                            6M
                        </button>
                    </span>
                    <span className='one-year'>
                        <button
                            value='1y'
                            onClick={e => createData(e.target.value)}
                        >
                            1Y
                        </button>
                    </span>
                </div>
            </div>
            {stock &&
                <div className='stock-details-information'>
                    <div className='stock-details-name-title'>
                        {stock.name} ({stock.ticker})
                    </div>
                    <div className='stock-details-company-information'>
                        <div>
                            <div className='stock-details-about-title'>
                                About
                            </div>
                            <hr></hr>
                            <div className='stock-details-about-description'>
                                {stock.description}
                            </div>
                        </div>
                        <div className='stock-details-title'>
                            <div>
                                <div className='stock-details-ceo-title'>
                                    CEO
                                </div>
                                <div>
                                    {stock.ceo}
                                </div>
                            </div>
                            <div>
                                <div className='stock-details-employees-title'>
                                    Employees
                                </div>
                                <div>
                                    {stock.employees}
                                </div>
                            </div>
                            <div>
                                <div className='stock-details-headquarters-title'>
                                    Headquarters
                                </div>
                                <div>
                                    {stock.headquarters}
                                </div>
                            </div>
                            <div>
                                <div className='stock-details-founded-title'>
                                    Founded
                                </div>
                                <div>
                                    {stock.founded}
                                </div>
                            </div>
                        </div>
                        <div className='stock-details-keystats-title'>
                            Key Statistic
                        </div>
                        <hr></hr>
                        <div className='stock-details-keystats-information'>
                            <div>
                                <div className='stock-details-high-price'>
                                    High
                                </div>
                                <div className='stock-details-high-price-number'>
                                    ${max}
                                </div>
                            </div>
                            <div>
                                <div className='stock-details-low-price'>
                                    Low
                                </div>
                                <div className='stock-details-low-price-number'>
                                    ${min}
                                </div>
                            </div>
                            <div>
                                <div className='stock-details-open-price'>
                                    Open price
                                </div>
                                <div>
                                    ${stock?.prices?.toFixed(2)}
                                </div>
                            </div>
                            <div>
                                <div className='stock-details-close-price'>
                                    Close price
                                </div>
                                <div>
                                    {/* ${stock.prices[stock.prices.length - 1].toFixed(2)} */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {news ? <div>
                        <News news={news} ticker={ticker} />
                    </div> : <div>Loading</div>}
                </div>}
        </div>
    )

}

export default StockDetails
