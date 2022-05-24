import './App.css';

import React, { Component } from 'react';
import CsvReader from './components/CsvReader';

class App extends Component {
    state = {
        responseData: {}
    }

    render() {
        return (
            <div>
                <CsvReader />
            </div>
        )
    }
}

export default App;
