import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse';

const buttonRef = React.createRef()

async function fetchdata(url = '', data = {}, mtd = 'GET'){
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
  return response.json(); // parses JSON response into native JavaScript objects
}

async function GETdataNoBody(url = ''){
 
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

export default class CSVReader1 extends Component {
  handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point 
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }
  
  handleOnFileLoad = (data) => {
    console.log('---------------------------')
    console.log(data[1])
    console.log(data[1].data.length)
    console.log(data[1].data[1])
    console.log('---------------------------')
    
    if(data.length > 0) {
      let csvType;
      let fnurl;
      let fndata;

      if (data[0].data.length === 2){
        //Groups
        if( data[0].data.toString() === 'id,group_name'){
          csvType = 'groups';
          fnurl = 'http://127.0.0.1:8000/api/groups';
          fndata = {group_name:''}
          console.log(fndata);
        }
      }
      else if (data[0].data.length === 6){
        //People
        csvType = 'people';
        fnurl = 'http://127.0.0.1:8000/api/people';
        fndata = {first_name:'',last_name:'',email_address:'',status:'',group_id: null};
        console.log(fndata);
      }
      else {
        console.log('Error: wrong number of columns.');
        //throw new Error('Error: wrong number of columns.');
        csvType = 'error';
      }

      if(csvType !== 'error') {
        for(let i=1; i < data.length; i++ ){

          GETdataNoBody(fnurl + '/' + data[i].data[0].toString())
          .then(function(data2) {
            console.log(data2);
            //Has ID, update data
            if(csvType === 'groups'){
              fndata.group_name = data[i].data[1].toString();
            } else if (csvType === 'people'){
              fndata.first_name = data[i].data[1].toString();
              fndata.last_name = data[i].data[2].toString();
              fndata.email_address = data[i].data[3].toString();
              fndata.status = data[i].data[4].toString();
              fndata.group_id = data[i].data[5].toString();
            }
            fetchdata(fnurl + '/' + data[i].data[0].toString(),fndata,'PUT')
            .then(function(data3) {
              console.log(data3);
              window.location.reload(false);
            })
            .catch(function(error) {
              //console.error('Error:', error);
            });
          })
          .catch(function(error) {
            //console.error('Error:', error);
            //Has not ID, insert data
            if(csvType === 'groups'){
              fndata.group_name = data[i].data[1].toString();
            } else if (csvType === 'people'){
              fndata.first_name = data[i].data[1].toString();
              fndata.last_name = data[i].data[2].toString();
              fndata.email_address = data[i].data[3].toString();
              fndata.status = data[i].data[4].toString();
              fndata.group_id = data[i].data[5].toString();
            }
            fetchdata(fnurl,fndata,'POST')
            .then(function(data3) {
              console.log(data3);
              window.location.reload(false);
            })
            .catch(function(error) {
              //console.error('Error:', error);
            });
          });
        }
      }

      /*if(csvType !== 'error') {
        for(let i=1; i < data.length; i++ ){

          GETdataNoBody(fnurl + '/' + data[i].data[0].toString())
          .then(data2 => {
            console.log(data2);
            //Has ID, update data
            if(csvType === 'groups'){
              fndata.group_name = data[i].data[1].toString();
            } else if (csvType === 'people'){
              fndata.first_name = data[i].data[1].toString();
              fndata.last_name = data[i].data[2].toString();
              fndata.email_address = data[i].data[3].toString();
              fndata.status = data[i].data[4].toString();
            }
            fetchdata(fnurl + '/' + data[i].data[0].toString(),fndata,'PUT')
            .then(data3 => {
              console.log(data3);
            })
            .catch((error) => {
              //console.error('Error:', error);
            });
          })
          .catch((error) => {
            //console.error('Error:', error);
            //Has not ID, insert data
            if(csvType === 'groups'){
              fndata.group_name = data[i].data[1].toString();
            } else if (csvType === 'people'){
              fndata.first_name = data[i].data[1].toString();
              fndata.last_name = data[i].data[2].toString();
              fndata.email_address = data[i].data[3].toString();
              fndata.status = data[i].data[4].toString();
            }
            fetchdata(fnurl,fndata,'POST')
            .then(data3 => {
              console.log(data3);
            })
            .catch((error) => {
              //console.error('Error:', error);
            });
          });
        }
      }*/
    }

    /*fetchdata('http://127.0.0.1:8000/api/groups', { group_name: data[1].data[1] },'POST')
    .then(data => {
      console.log(data); // JSON data parsed by `data.json()` call
    })
    .catch((error) => {
      console.error('Error:', error);
    });*/

   /* fetch('http://127.0.0.1:8000/api/groups',{
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({group_name: data[1].data[1]})
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });*/
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')
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
              type='button'
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
              Browse file
            </button>
            <div
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#ccc',
                height: 45,
                lineHeight: 2.5,
                marginTop: 5,
                marginBottom: 5,
                paddingLeft: 13,
                paddingTop: 3,
                width: '60%'
              }}
            >
              {file && file.name}
            </div>
            <button
              style={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 20,
                paddingRight: 20
              }}
              onClick={this.handleRemoveFile}
            >
              Remove
            </button>
          </aside>
        )}
      </CSVReader>
    )
  }
}