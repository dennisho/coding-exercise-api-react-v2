import './css/jquery.dataTables.css'
import React, { Component } from 'react'

const $ = require('jquery')
$.DataTable = require('datatables.net')

class Tbl extends Component {

  componentDidMount() {
    //console.log(this.el)
    this.$el = $(this.el)
    let table = this.$el.DataTable(
      {
        ajax: {
          url: 'http://localhost:8000/api/peoplegroups'
        },
        columns: [
          {
            className: 'details-control',
            orderable: false,
            data: null,
            defaultContent: ''
          },
          { data: "group_name" }
        ],
        order: [[1, 'asc']]
      }

    )

    function format(d) {
      // `d` is the original data object for the row
      console.log(d.people.length);

      let tablebody;

      if (d.people.length > 0){
        tablebody = '<thead><tr><td>First Name</td><td>Last Name</td><td>Email Address</td></tr></thead>';
        for(let i = 0; i < d.people.length; i++){
          tablebody += '<tr><td>' + d.people[i].first_name + '</td><td>' + d.people[i].last_name + '</td><td>' + d.people[i].email_address + '</td></tr>';
        }
      }
      else {
        tablebody = '<tr><td>No people in this group</td></tr>';
      }

      let retTable = '<h4>Active Group Member(s)</h4><br><table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
      tablebody +
      '</table>';

      return retTable;
    }

    $('#grouptable tbody').on('click', 'td.details-control', function () {
      let tr = $(this).closest('tr');
      let row = table.row( tr );

      if ( row.child.isShown() ) {
          // This row is already open - close it
          row.child.hide();
          tr.removeClass('shown');
      }
      else {
          // Open this row
          row.child( format(row.data()) ).show();
          tr.addClass('shown');
      }
  } );


  }

  componentWillUnmount() {

  }

  render() {
    return <div>
      <table id="grouptable" className="display" width="100%" ref={el => this.el = el}>
        <thead>
          <tr>
            <th></th>
            <th>Group Name</th>
          </tr>
        </thead>
      </table>

    </div>
  }

}

export default Tbl