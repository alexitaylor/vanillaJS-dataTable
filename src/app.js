(function (root, factory) {

  if ( typeof define === 'function' && define.amd ) {
    define([], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.myPlugin = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

  'use strict';

  //
  // Variables
  //
  var window = root; // Map window to root to avoid confusion
  var dataTable = {}; // Placeholder for public methods

  var options = {
    perPage: 10,
    currentPaginationIndex: 0,
    perPagination: 10,
    flag: {
      name: true,
      email: true,
      company: true,
      phoneNumber: true,
      position: true,
    },
    searchedValue: '',
  };

  var dummyData = {
    rows: [],
  };
  var searchedData = {
    rows: [],
  };

  /**
   * Helpers
   * @type {Object}
   */

  var util = {
    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    forEach: function (collection, callback, scope) {
      if (Object.prototype.toString.call(collection) === '[object Object]') {
        for (var prop in collection) {
          if (Object.prototype.hasOwnProperty.call(collection, prop)) {
            callback.call(scope, collection[prop], prop, collection);
          }
        }
      } else {
        for (var i = 0, len = collection.length; i < len; i++) {
          callback.call(scope, collection[i], i, collection);
        }
      }
    },
    /**
     * Creates Fake Data using fakerJS for table
     * @private
     * @returns {Object} 100 Fake values
     */
    createData: function() {
      for (var i = 0; i < 100; i++) {
        dummyData.rows.push({
          name: faker.name.findName(),
          email: faker.internet.email(),
          company: faker.company.companyName(),
          phoneNumber: faker.phone.phoneNumberFormat(),
          position: faker.name.title(),
          number: i,
        });
      }
      return dummyData;
    },
    /**
     * Sorts data in table columns
     * @private
     * *@param String entry Entry to sort
     * @param Boolean flag Sort Ascending or Descending order
     */
    filterData: function(entry, flag) {
      var data = searchedData.rows.length > 0 ? searchedData : dummyData;
      if (flag) {
        data.sort(function(a, b){
          var nameA = a[entry].toUpperCase(); // ignore upper and lowercase
          var nameB = b[entry].toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
      } else {
        data.sort(function(a, b){
          var nameA = a[entry].toUpperCase(); // ignore upper and lowercase
          var nameB = b[entry].toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          // names must be equal
          return 0;
        });
      }
    },
    /**
     * Edit focused Cell and update in-memory data
     * @private
     * *@param String className Unique class of cell to edit
     * @param String editedText Changed text that will update old value
     */
    editCell: function(className, editedText) {
      var data = searchedData.rows.length > 0 ? searchedData : dummyData;
      var index = className.indexOf('@');
      var uniqueNumber = className.slice(0, index);
      var key = className.slice(index + 1);
      data.forEach(function(row){
        if (row.phoneNumber === uniqueNumber) {
          row[key] = editedText;
        }
      });
    },
    // TODO: finish Search
    searchData: function(inputValue, data) {
      var input = inputValue.toUpperCase();
      searchedData.rows = data.filter(function(row){
        console.log('testing123');
        for (var key in row) {
          var item = row[key].toString().toUpperCase();
          if (item.includes(input)){
            return true;
          }
        }
      });
    }
  };


  /**
   * A public method
   */
  util.createData();

  dataTable.init = function (options) {
    var data = searchedData.rows.length > 0 ? searchedData : dummyData;
    var tableRef = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    // Clear table data before populating, needed when changing # of entries per page
    tableRef.innerHTML = "";

    // Fake data to insert to table
    for (var i = options.currentPaginationIndex; i < options.perPagination; i++) {
      // Insert a row in the table at new row index
      var newRow = tableRef.insertRow(tableRef.rows.length);
      var idx = 0;

      for (var item in data.rows[i]) {
        var newCell  = newRow.insertCell(idx);
        // Add Editable attribute to cells
        newCell.setAttribute('contenteditable', 'true');
        // Add unique class to each cell of each unique row
        newCell.setAttribute('class', `${data.rows[i]['phoneNumber']}@${item}`);
        // Add onblur function to each cell
        newCell.setAttribute('onblur', 'window.changeCellData(event)');
        // Append a text node to the cell
        var newText  = document.createTextNode(data.rows[i][item]);
        newCell.appendChild(newText);
        idx++;
      }
    }
  };

  dataTable.getTotalEntries = function () {
    var data = searchedData.rows.length > 0 ? searchedData : dummyData;
    return data.rows.length
  };

  dataTable.getPagination = function (index) {
    // render number of pagination based on selection drop down
    var idx = index || options.index || 1;
    var totalEntries = dataTable.getTotalEntries();
    var pagination = document.getElementById('pagination');
    var paginationTemplate = '<a onclick="window.goBack()">&laquo;</a>';
    var paginationLength = totalEntries / options.perPage;

    pagination.innerHTML = "";
    for (var i = 1; i <= paginationLength; i++) {
      if (i === idx) {
        paginationTemplate += `<a class="active" onclick="window.selectPagination(${i})">${i}</a>`;
      } else {
        paginationTemplate += `<a onclick="window.selectPagination(${i})">${i}</a>`;
      }

    }
    paginationTemplate += '<a onclick="window.goForward()">&raquo;</a>';
    pagination.innerHTML = paginationTemplate;
  };


  /**
   * Event Listeners
   *
   * */
  // TODO: Fix the state of this function, not window...
  // Get selected number of entries per page
  window.selectEntry = function() {
    var entryValue = document.getElementById('entry').value;
    document.getElementById('show-entry').innerHTML = "You selected: " + entryValue;
    options.perPage = parseInt(entryValue);
    dataTable.init(options);
    dataTable.getPagination();
    window.selectPagination(1);
  };

  window.goBack = function() {
    if (options.index > 1) {
      window.selectPagination(options.index - 1);
    }
  };

  window.selectPagination = function(index) {
    options.index = index;
    var totalEntries = dataTable.getTotalEntries();
    options.currentPaginationIndex = options.perPage * (index - 1);
    options.perPagination = options.currentPaginationIndex + options.perPage;
    document.getElementById('to-entry').innerHTML = `${options.currentPaginationIndex} - ${options.perPagination - 1}`;
    dataTable.getPagination(options.index);
    dataTable.init(options);
    console.log(options.index);
  };

  window.goForward = function() {
    var index = options.index || 1;
    var max = dataTable.getTotalEntries() / options.perPage;
    if (index < max) {
      window.selectPagination(index + 1);
    }
  };

  /**
   * Filter functions
   * Filters: Name, Position, Phone Number, Email and Company
   * Sorts in Ascending or Descending order
   * */
  window.filterName = function() {
    util.filterData('name', options.flag.name);
    options.flag.name = !options.flag.name;
    dataTable.init(options);
  };

  window.filterPosition = function() {
    util.filterData('position', options.flag.position);
    options.flag.position = !options.flag.position;
    dataTable.init(options);
  };

  window.filterPhoneNumber = function() {
    util.filterData('phoneNumber', options.flag.phoneNumber);
    options.flag.phoneNumber = !options.flag.phoneNumber;
    dataTable.init(options);
  };

  window.filterEmail = function() {
    util.filterData('email', options.flag.email);
    options.flag.email = !options.flag.email;
    dataTable.init(options);
  };

  window.filterCompany = function() {
    util.filterData('company', options.flag.company);
    options.flag.company = !options.flag.company;
    dataTable.init(options);
  };
  /**
   * Handle cell change
   * */
  window.changeCellData = function(e) {
    util.editCell(e.target.className, e.target.innerHTML);
    dataTable.init(options);
  };

  /**
   * Handle Search
   * */
  window.f = function(e) {
    options.currentPaginationIndex = 0;
    options.perPagination = options.currentPaginationIndex + options.perPage;
    util.searchData(e.target.value, dummyData.rows);
    dataTable.init(options);
    dataTable.getPagination();
    options.searchedValue = e.target.value;
  };

  //
  // Public APIs
  //

  return dataTable;

});