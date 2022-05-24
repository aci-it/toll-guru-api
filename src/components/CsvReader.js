import { useState } from 'react';
import Converter from './Converter';
import "../styles/CsvReader.css";

export default function CsvReader(){
    // Declare csvFile, csvArray, and respective functions
    const [csvFile, setCsvFile] = useState();
    const [csvArray, setCsvArray] = useState([]);

    // Process CSV, happens on Submit
    const processCSV = (str, delim=',') => {
        // Standard reorganization of data, adding commas, etc.
        const headers = str.slice(0,str.indexOf('\n')).split(delim);
        const rows = str.slice(str.indexOf('\n')+1).split('\n');

        // Declare placeholder variables for weird Javascript thing below
        let newHeaders = [];
        let newRows = [];

        let tempHeader;
        let tempRow;

        // Loop through each header, check for problematic characters, remove and push to new list
        for (let i = 0; i < headers.length; i++) {
            tempHeader = headers[i];
            if (tempHeader.includes('\r')) {
                tempHeader = headers[i].replace('\r','');
            }

            if (tempHeader.includes('"')) {
                tempHeader = tempHeader.replaceAll('"','');
            }

            newHeaders.push(tempHeader);
        }

        // Loop through each row, check for problematic characters, remove and push to new list
        for (let i = 0; i < rows.length; i++) {
            tempRow = rows[i];
            if (tempRow.includes('\r')) {
                tempRow = rows[i].replace('\r','');
            }

            if (tempRow.includes('"')) {
                tempRow = tempRow.replaceAll('"','');
            }
            
            if (tempRow.includes(', ')) {
                tempRow = tempRow.replaceAll(', ',' - ');
            }

            // Count all commas up to the last one and remove them
            // Escape characters?

            newRows.push(tempRow);
        }

        // Go through new data, generate new array, and set csvArray equal to the new one
        let newArray = newRows.map( row => {
            const values = row.split(delim);
            const eachObject = newHeaders.reduce((obj, header, i) => {
                obj[header] = values[i];
                return obj;
            }, {})
            return eachObject;
        })

        newArray.pop();

        setCsvArray(newArray);
    }

    // On submit, get the Csv in FileReader, get the text, and execute processCSV function
    const submit = () => {
        const file = csvFile;
        const reader = new FileReader();

        reader.onload = function(e) {
            const text = e.target.result;
            processCSV(text);
        }

        reader.readAsText(file);
    }

    return (
        <div className="csv-reader-container">
            <form id='csv-form'>
                <input
                    className="csv-reader-btn"
                    style={{margin: "20px 0px 0px 70px"}}
                    disabled={csvArray.length !== 0}
                    type='file'
                    accept='.csv'
                    id='csvFile'
                    onChange={(e) => {
                        setCsvFile(e.target.files[0])
                    }}
                >
                </input>
                <br/>
                <button
                    className="csv-submit-btn"
                    disabled={csvFile === undefined || csvArray.length !== 0}
                    style={{marginLeft: "70px"}}
                    onClick={(e) => {
                        e.preventDefault()
                        if(csvFile)submit()
                    }}
                >
                    Submit .csv
                </button>
                <p style={{display: "inline-block", margin: "0px 0px 0px 10px"}}>{csvArray.length !== 0 ? "Submitted!" : ""}</p>
                <Converter data={csvArray}/>
            </form>
        </div>
    );

}