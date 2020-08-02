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
          url: 'http://localhost:8000/api/groups'
        },
        columns: [
          {
            className: 'details-control',
            orderable: false,
            data: null,
            defaultContent: ''
          },
          { data: "id" },
          { data: "group_name" }
        ],
        order: [[1, 'asc']]
      }

    )

    function format(d) {
      // `d` is the original data object for the row
      console.log(d);
      return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td>Created At</td>' +
        '<td>' + d.created_at + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Updated At</td>' +
        '<td>' + d.updated_at + '</td>' +
        '</tr>' +
        '</table>';
    }

    $('#grouptable tbody').on('click', 'td.details-control', function () {
      var tr = $(this).closest('tr');
      var row = table.row( tr );

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
            <th>id</th>
            <th>Group Name</th>
          </tr>
        </thead>
      </table>

    </div>
  }

}

export default Tbl