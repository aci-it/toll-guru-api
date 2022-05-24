import React, { Component } from 'react';
import "../styles/List.css";
import { Oval } from "react-loader-spinner";

class List extends Component {
    state = {
        search: "",
        viewStopsForOrder: [],
        dataList: [],
        orderNumbers: [],
        orders: [],
        popupVisible: false,
        isLoading: false
    }

    getCurrentList() {
        const data = this.props.data;
        let curList;
        let curOrderInfo = this.state.orders;
        
        if (this.state.search === "") {
            curList = data.map(order => {
                return (
                    <div key={order.orderNumber}>
                        <div className="list-item-container">
                            <div className="list-item">
                                <h4>{order.orderNumber}</h4>
                            </div>
                            <div className="list-item">
                                <h4>{order.stops.length}</h4>
                                <button className="stops-btn" onClick={e => this.viewStops(e, order)}>{this.state.viewStopsForOrder.includes(order.orderNumber) ? "Unique Stops ▲" : "Unique Stops ▼"}</button>
                            </div>
                            <div className="list-item">
                                {order.stops.length === 2 ? (order.stops[0].lat === order.stops[1].lat && order.stops[0].lon === order.stops[1].lon ? <h4>No Route Available</h4> : <button onClick={e => this.sendOrderData(e, order)}>Make API Call</button>) : <button onClick={e => this.sendOrderData(e, order)}>Make API Call</button>}
                            </div>
                        </div>
                        <div className="list-stops-container">
                            {
                                order.stops.map(stop => {
                                    return (
                                        <div className={this.state.viewStopsForOrder.includes(order.orderNumber) ? "list-stop" : "list-stop hidden"} key={`${order.orderNumber}-${stop.seq}`}>
                                            <h6 style={{width: "10px"}}>{stop.seq}</h6>
                                            <h6>{stop.lat}</h6>
                                            <h6>{stop.lon}</h6>
                                            <h6>{stop.time}</h6>
                                        </div>
                                    )
                                })
                            }
                        </div>
                            {
                                curOrderInfo.map(info => {
                                    if (info.orderNumber === order.orderNumber) {
                                        return (
                                            <div className={info.orderNumber === order.orderNumber ? "route-info-container" : "route-info-container hidden"} key={info.orderNumber + "-show-routes"}>
                                                <div className={info.orderNumber === order.orderNumber ? "route-info" : "route-info hidden"}>
                                                    <h4>Available Routes: {info.routes.length}</h4>
                                                    <button className="show-routes-btn" onClick={e => this.showRoutes(e, info)}>Show Routes</button>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return null
                                    }
                                })
                            }
                    </div>
                )
            });
        } else {
            curList = data.map(order => {
                if (order.orderNumber.includes(this.state.search)) {
                    return (
                        <div key={order.orderNumber}>
                            <div className="list-item-container">
                                <div className="list-item">
                                    <h4>{order.orderNumber}</h4>
                                </div>
                                <div className="list-item">
                                    <h4>{order.stops.length}</h4>
                                    <button className="stops-btn" onClick={e => this.viewStops(e, order)}>{this.state.viewStopsForOrder.includes(order.orderNumber) ? "Unique Stops ▲" : "Unique Stops ▼"}</button>
                                </div>
                                <div className="list-item">
                                    <button onClick={e => this.sendOrderData(e, order)}>Make API Call</button>
                                </div>
                            </div>
                            <div className="list-stops-container">
                                {
                                    order.stops.map(stop => {
                                        return (
                                            <div className={this.state.viewStopsForOrder.includes(order.orderNumber) ? "list-stop" : "list-stop hidden"} key={`${order.orderNumber}-${stop.seq}`}>
                                                <h6 style={{width: "10px"}}>{stop.seq}</h6>
                                                <h6>{stop.lat}</h6>
                                                <h6>{stop.lon}</h6>
                                                <h6>{stop.time}</h6>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                                {
                                    curOrderInfo.map(info => {
                                        if (info.orderNumber === order.orderNumber) {
                                            return (
                                                <div className={info.orderNumber === order.orderNumber ? "route-info-container" : "route-info-container hidden"} key={info.orderNumber + "-show-routes"}>
                                                    <div className={info.orderNumber === order.orderNumber ? "route-info" : "route-info hidden"}>
                                                        <h4>Available Routes: {info.routes.length}</h4>
                                                        <button className="show-routes-btn" onClick={e => this.showRoutes(e, info)}>Show Routes</button>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return null
                                        }
                                    })
                                }
                        </div>
                    )
                } else {
                    return null;
                }
            });
        }

        return (
            <div className="list-container">
                <div className="list-label-container">
                    <div className="list-label">
                        <h6>Order Number</h6>
                    </div>
                    <div className="list-label">
                        <h6>Unique Stops</h6>
                    </div>
                </div>
                <div className="list-items">
                    {curList}
                </div>
            </div>
        )
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        },() => {
            console.log(this.state.search);
        })
    }

    viewStops(e, order) {
        e.preventDefault();
        let viewStops = this.state.viewStopsForOrder;

        if (viewStops.includes(order.orderNumber)) {
            viewStops.splice(viewStops.indexOf(order.orderNumber), 1);
        } else {
            viewStops.push(order.orderNumber);
        }

        this.setState({
            viewStopsForOrder: viewStops
        })
    }

    sendOrderData(e, order) {
        e.preventDefault();
        this.generateRouteData(order)
    }

    generateRouteData(order) {
        let curStop;
        let curLat;
        let curLon;
        let waypointsList = [];
        let departureTime;
        let fromLat, fromLon, toLat, toLon;

        let curOrder = order;
        for (let y = 0; y < curOrder.stops.length; y++) {
            curStop = curOrder.stops[y];
            if (y === 0) {
                fromLat = curStop.lat;
                fromLon = curStop.lon;
                departureTime = curStop.time;
            } else if (y === curOrder.stops.length - 1) {
                toLat = curStop.lat;
                toLon = curStop.lon;
            } else {
                if (y === 1) {
                    waypointsList = [];
                }
                curLat = curStop.lat;
                curLon = curStop.lon;
                waypointsList.push({
                    lat: curLat,
                    lng: curLon
                })
            }
        }
        this.setState({
            isLoading: true
        },() => {
            this.compileRouteInfo(waypointsList, fromLat, fromLon, toLat, toLon, departureTime, curOrder.orderNumber);
        })
    }

    compileRouteInfo(waypoints, fromLat, fromLon, toLat, toLon, time, num) {
        let newData = this.state.orders;

        const data = JSON.stringify({
            "from": {
                "lat": fromLat,
                "lng": fromLon
            },
            "to": {
                "lat": toLat,
                "lng": toLon
            },
            "waypoints": waypoints,
            "vehicleType": "2AxlesTruck",
            "departure_time": time,
            "fuelPrice": 1.305,
            "fuelPriceCurrency": "USD",
            "fuelEfficiency": {
                "city": 28.57,
                "hwy": 22.4,
                "units": "mpg"
            },
            "truck": {
                "limitedWeight": 500
            },
            "driver": {
                "wage": 30,
                "rounding": 15,
                "valueOfTime": 0
            },
            "state_mileage": true,
            "hos": {
                "rule": 60,
                "dutyHoursBeforeEndOfWorkDay": 11,
                "dutyHoursBeforeRestBreak": 7,
                "drivingHoursBeforeEndOfWorkDay": 11,
                "timeRemaining": 60
            }
        });

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    newData.push({
                        orderNumber: num,
                        routes: JSON.parse(xhr.responseText).routes,
                        summary: JSON.parse(xhr.responseText).summary,
                    });
                    this.setState({
                        orders: newData,
                        isLoading: false
                    });
                  } else {
                    console.error(xhr.statusText);
                  }
            }
        }.bind(this);
          
        xhr.open("POST", "https://dev.tollguru.com/v1/calc/here");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-api-key", "JLT4DgT4N24hLngD7ftN9BBLLDNbPJjR");
        
        xhr.send(data);
    }

    showRoutes(e, info) {
        e.preventDefault();
        this.setState({
            popupVisible: !this.state.popupVisible,
            popupInfo: info
        })
    }

    disablePopup(e) {
        e.preventDefault();
        this.setState({
            popupVisible: false
        })
    }

    getPopup() {
        const info = this.state.popupInfo;

        if (info !== undefined) {
            return (
                <div className={this.state.popupVisible ? "popup-container" : "popup-container hidden"}>
                    <div className="popup-background" onClick={e => this.disablePopup(e)}></div>
                    <div className="popup-card">
                        <h1>Order {info.orderNumber}</h1>
                        <div className="popup-route-container">
                            {
                                info.routes.map((route, i) => {
                                    return (
                                        <div className="popup-routes" key={info.orderNumber + "-" + i}>
                                            <div className="popup-route-info">
                                                <h5>Route #{i + 1}, {route.summary.name}</h5>
                                                <h6>Costs - Fuel: {route.costs.fuel} | License Plate: {route.costs.licensePlate === undefined ? "None" : route.costs.licensePlate} | Prepaid Card: {route.costs.prepaidCard === undefined ? "None" : route.costs.prepaidCard} | Tag: {route.costs.tag === undefined ? "None" : route.costs.tag}</h6>
                                                <h6>Driver - Billed Hours: {route.driver.billedHours} | Wage: {route.driver.wage} | Total: {route.driver.total}</h6>
                                                {this.checkCheapest(route.summary.diffs.cheapest)}
                                                {this.checkFastest(route.summary.diffs.fastest)}
                                                <h6>Distance: {route.summary.distance.text}</h6>
                                                <h6>Duration: {route.summary.duration.text}</h6>
                                                <h6>Has Tolls: {route.summary.hasTolls === true ? "Yes" : "No"} | Has Express Tolls: {route.summary.hasExpressTolls ? "Yes" : "No"}</h6>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="exit-btn-container">
                                <button className="exit-btn" onClick={e => this.disablePopup(e)}>Exit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    checkCheapest(curr) {
        // const data = this.state.popupInfo.routes;
        // let numList = [];

        // for (let i = 0; i < data.length; i++) {
        //     numList.push(data[i].summary.diffs.cheapest);
        // }
        
        // console.log(numList);

        // for (let j = 0; j < numList.length; j++) {

        // }

        if (curr === 0) {
            return <h6 style={{color: 'green'}}><b><i>Cheapest</i></b></h6>
        } else {
            return <h6>Cheapest: {curr}</h6>
        }
    }

    checkFastest(curr) {
        // const data = this.state.popupInfo.routes;
        // console.log(data);
        if (curr === 0) {
            return <h6 style={{color: 'green'}}><b><i>Fastest</i></b></h6>
        } else {
            return <h6>Fastest: {curr}</h6>
        }
    }

    render() {
        return (
            <div>
                {this.state.isLoading ? <div className="loader-container"><Oval color="#FFF" height={100} width={100} /></div> : null}
                <input className="search-input" type="text" onChange={e => this.handleChange(e)} name="search" placeholder="Search" style={{marginLeft: "70px"}}/>
                {this.getCurrentList()}
                {this.getPopup()}
            </div>
        )
    }
}

export default List
