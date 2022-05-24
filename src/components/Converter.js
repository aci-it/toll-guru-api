import React, { Component } from 'react'
import List from './List';
// import TollCalc from './TollCalc';

class Converter extends Component {
    state = {
        orders: [],
        disabled: false,
    }

    convertOrders(e) {
        e.preventDefault();
        const data = this.props.data;

        let curOrderNum;
        let curStops = [];
        let curOrder = [];
        let orderList = [];
        let prevOrderNum = data[0].ordernumber;

        for (let i = 0; i < data.length; i++) {
            curOrderNum = data[i].ordernumber;

            if (curOrderNum !== prevOrderNum) {
                curOrder = {
                    orderNumber: data[i - 1].ordernumber,
                    stops: curStops
                }

                orderList.push(curOrder);

                curStops = [];
                curOrder = [];
            }

            
            curStops.push({
                seq: data[i].sequence,
                lat: data[i].latitude,
                lon: data[i].longitude,
                time: data[i].timestamp
            })
            

            prevOrderNum = curOrderNum;

            if (i === data.length - 1) {
                curOrder = {
                    orderNumber: data[i - 1].ordernumber,
                    stops: curStops
                }

                orderList.push(curOrder);
            }
        }

        this.consolidateOrders(orderList);
    }
    
    consolidateOrders(orders) {
        for (let x = 0; x < orders.length; x++) {
            if (orders[x].stops.length > 2) {
                for (let y = 1; y < orders[x].stops.length; y++) {
                    if (orders[x].stops[y].lat === orders[x].stops[y - 1].lat && orders[x].stops[y].lon === orders[x].stops[y - 1].lon) {
                        orders[x].stops.splice(y, 1);
                        y-=1;
                    }
                }
            } 
        }

        this.setState({
            orders: orders,
            disabled: true
        })
    }

    render() {
        return (
            <div>
                <button onClick={e => this.convertOrders(e)} style={{marginLeft: "70px"}} disabled={this.state.orders.length !== 0}>Import .csv Into Table</button>
                {/* <TollCalc data={this.state.orders}/> */}
                <List data={this.state.orders}/>
            </div>
        )
    }
}

export default Converter
