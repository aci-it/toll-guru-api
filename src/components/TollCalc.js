import React, { Component } from 'react'

class TollCalc extends Component {
    state = {
        orders: [],
        fuelPrice: 0,
        dataList: [],
        orderNumbers: []
    }

    generateRouteData(e) {
        e.preventDefault();
        const data = this.props.data;
        // console.log(data);

        let curOrder;
        let curStop;
        let curLat;
        let curLon;
        let waypointsList = [];
        let departureTime;
        let fromLat, fromLon, toLat, toLon;

        for (let x = 0; x < data.length; x++) {
            curOrder = data[x];
            console.log(curOrder);
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
            this.compileRouteInfo(waypointsList, fromLat, fromLon, toLat, toLon, departureTime, curOrder.orderNumber);
        }
    }

    compileRouteInfo(waypoints, fromLat, fromLon, toLat, toLon, time, num) {
        console.log("From:", fromLat, fromLon);
        console.log("Cur:", waypoints);
        console.log("To:", toLat, toLon);
        console.log("Departure Time:", time);

        let curDataList = this.state.dataList;
        let curOrderNumbers = this.state.orderNumbers;

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
            "fuelPrice": this.state.fuelPrice,
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

        curDataList.push(data);
        curOrderNumbers.push(num);

        this.setState({
            dataList: curDataList,
            orderNumbers: curOrderNumbers
        })

        let newData = this.state.orders;

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
                        orders: newData
                    },() => {
                        console.log(this.state.orders)
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

    submitData(e) {
        e.preventDefault();
        const dataList = this.state.dataList;
        const orderNumbers = this.state.orderNumbers;

        console.log(orderNumbers, dataList);

        for (let i = 0; i < dataList.length; i++) {
            let newData = this.state.orders;
            let num = orderNumbers[i];

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
                            orders: newData
                        },() => {
                            console.log(`Submitted Order #${num}`)
                        });
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            }.bind(this);
            
            xhr.open("POST", "https://dev.tollguru.com/v1/calc/here");
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("x-api-key", "JLT4DgT4N24hLngD7ftN9BBLLDNbPJjR");
            
            xhr.send(dataList[i]);
        }
    }

    checkResults(e) {
        e.preventDefault();
        console.log(this.state.orders);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div>
                <input onChange={e => this.handleChange(e)} name="fuelPrice" placeholder="Fuel Price" />
                <br />
                <button onClick={e => this.generateRouteData(e)}>Generate Route Data</button>
                <br />
                <button onClick={e => this.submitData(e)}>Submit Data</button>
                <br />
                <button onClick={e => this.checkResults(e)}>Check Results</button>
            </div>
        )
    }
}

export default TollCalc
