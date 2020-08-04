import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { CSVReader } from 'react-papaparse';

const buttonRef = React.createRef();

//Call API with POST and PUT
export async function fetchdata(url = '', data = {}, mtd = 'GET') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: mtd, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  console.log(response);
  let retval;
  if(response.status === 204) {
    retval = {status:response.status,data:{}};
  }
  else {
    retval = {status:response.status,data:response.json()};
  }
  console.log(retval);
  return retval; // parses JSON response into native JavaScript objects
}

//Call API with GET (No Body: data)
export async function GETdataNoBody(url = '') {

  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });

  return response.json();
}

//Wrap API Calls in function so that each action will be async
async function runAction(fnurl = '',data = {}, i, csvType, fndata, myelement) {
  GETdataNoBody(fnurl + '/' + data[i].data[0].toString().trim().replace(/"/g, ""))
    .then(function (data2) {
      console.log(data2);
      //Has ID, update data
      if (csvType === 'groups') {
        fndata.group_name = data[i].data[1].toString().trim().replace(/"/g, "");
      } else if (csvType === 'people') {
        fndata.first_name = data[i].data[1].toString().trim().replace(/"/g, "");
        fndata.last_name = data[i].data[2].toString().trim().replace(/"/g, "");
        fndata.email_address = data[i].data[3].toString().trim().replace(/"/g, "");
        fndata.status = data[i].data[4].toString().trim().replace(/"/g, "");
        fndata.group_id = data[i].data[5].toString().trim().replace(/"/g, "");
      }
      fetchdata(fnurl + '/' + data[i].data[0].toString().trim().replace(/"/g, ""), fndata, 'PUT')
        .then(function (data3) {
          console.log(data3);
          myelement = (<div className="ui blue inverted segment"><strong>Success</strong></div>);
          ReactDOM.render(myelement, document.getElementById('errmsg'));
          setTimeout(function(){ window.location.reload(false); }, 3000);
        })
        .catch(function (error) {
          //console.error('Error:', error);
        });
    })
    .catch(function (error) {
      //console.error('Error:', error);
      //Has not ID, insert data
      if (csvType === 'groups') {
        fndata.group_name = data[i].data[1].toString().trim().replace(/"/g, "");
      } else if (csvType === 'people') {
        fndata.first_name = data[i].data[1].toString().trim().replace(/"/g, "");
        fndata.last_name = data[i].data[2].toString().trim().replace(/"/g, "");
        fndata.email_address = data[i].data[3].toString().trim().replace(/"/g, "");
        fndata.status = data[i].data[4].toString().trim().replace(/"/g, "");
        fndata.group_id = data[i].data[5].toString().trim().replace(/"/g, "");
      }
      console.log(fndata);
      fetchdata(fnurl, fndata, 'POST')
        .then(function (data3) {
          console.log(data3);
          myelement = (<div className="ui blue inverted segment"><strong>Success</strong></div>);
          ReactDOM.render(myelement, document.getElementById('errmsg'));
          setTimeout(function(){ window.location.reload(false); }, 3000);
        })
        .catch(function (error) {
          //console.error('Error:', error);
        });
    });
}

export default class CSVReader1 extends Component {
  handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point 
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  handleOnFileLoad = (data) => {
    
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')
    
    ReactDOM.render('', document.getElementById('errmsg'));

    //check to see of there is data.  If there is data, continue.
    if (data.length > 0) {
      let csvType, fnurl, fndata, myelement;

      if (data[0].data.length === 2) {
        //Groups
        //check the header row to see if it matches the format
        if (data[0].data.toString().trim().replace(/"|\s|\n/g, "") === 'id,group_name') {
          csvType = 'groups';
          fnurl = 'http://127.0.0.1:8000/api/groups';
          fndata = { group_name: '' }
          console.log(fndata);
        }
        else {
          //display error message - columns are in wrong order or incorrect names.
          myelement = (<div className="ui red inverted segment"><strong>Upload Failed: People CSV file columns are in wrong order or incorrect names.</strong></div>);
          ReactDOM.render(myelement, document.getElementById('errmsg'));
        }
      }
      else if (data[0].data.length === 6) {
        //People
        //check the header row to see if it matches the format
        if (data[0].data.toString().trim().replace(/"|\s|\n/g, "") === 'id,first_name,last_name,email_address,status,group_id') {
          csvType = 'people';
          fnurl = 'http://127.0.0.1:8000/api/people';
          fndata = { first_name: '', last_name: '', email_address: '', status: '', group_id: null };
          console.log(fndata);
        }
        else {
          //display error message - columns are in wrong order or incorrect names.
          myelement = (<div className="ui red inverted segment"><strong>Upload Failed: People CSV file columns are in wrong order or incorrect names.</strong></div>);
          ReactDOM.render(myelement, document.getElementById('errmsg'));
        }
      }
      else {
        console.log('Error: wrong number of columns.');
        //display error message - columns are in wrong number of columns
        myelement = (<div className="ui red inverted segment"><strong>Upload Failed: CSV file with wrong number of columns.</strong></div>);
        ReactDOM.render(myelement, document.getElementById('errmsg'));
        csvType = 'error';
      }


      if (csvType !== 'error') {
        for (let i = 1; i < data.length; i++) {
          runAction(fnurl,data, i, csvType, fndata, myelement);
        }
      }
    }

  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')

    ReactDOM.render('', document.getElementById('errmsg'));
  }

  handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  render() {
    return (
      <CSVReader
        ref={buttonRef}
        onFileLoad={this.handleOnFileLoad}
        onError={this.handleOnError}
        noClick
        noDrag
        onRemoveFile={this.handleOnRemoveFile}
      >
        {({ file }) => (
          <aside
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 10
            }}
          >
            <button
              id='openDialog'
              type='button'
              className="ui primary button"
              onClick={this.handleOpenDialog}
              style={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                width: '40%',
                paddingLeft: 0,
                paddingRight: 0
              }}
            >
              Browse CSV file
            </button>
            <div
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#ccc',
                lineHeight: 3.5,
                paddingLeft: 13,
                width: '60%',
                height: 55
              }}
            >
              {file && file.name}
            </div>
            <button
              id='removeFile'
              className="ui button"
              style={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 20,
                paddingRight: 20
              }}
              onClick={this.handleRemoveFile}
            >
              Clear
            </button>
          </aside>
        )}
      </CSVReader>
    )
  }
}