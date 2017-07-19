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
  };

  var dummyData = {
    rows: [],
  };
  //
  // Methods
  //

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
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    extend: function ( defaults, options ) {
      var extended = {};
      util.forEach(defaults, function (value, prop) {
        extended[prop] = defaults[prop];
      });
      util.forEach(options, function (value, prop) {
        extended[prop] = options[prop];
      });
      return extended;
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
    filterData: function(entry) {
      dummyData.rows.sort(function(a, b){
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
    }
  };


  /**
   * A public method
   */
  var data = util.createData();

  dataTable.init = function (table, options) {
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
        // Append a text node to the cell
        var newText  = document.createTextNode(data.rows[i][item]);
        newCell.appendChild(newText);
        idx++;
      }
    }
  };

  dataTable.getTotalEntries = function () {
    return dummyData.rows.length
  };

  dataTable.getPagination = function () {
    // render number of pagination based on selection drop down
    var totalEntries = dataTable.getTotalEntries();
    var pagination = document.getElementById('pagination');
    var paginationTemplate = '<a onclick="window.goBack()">&laquo;</a>';
    var paginationLength = totalEntries / options.perPage;

    pagination.innerHTML = "";
    for (var i = 1; i <= paginationLength; i++) {
      paginationTemplate += `<a onclick="window.selectPagination(${i})">${i}</a>`;
    }
    paginationTemplate += '<a onclick="window.goForward()">&raquo;</a>';
    pagination.innerHTML = paginationTemplate
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
    dataTable.init('table', options);
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
    dataTable.init('data', options);
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
   *
   * */

  window.filterName = function() {
    // do something
    console.log('Filter Name', dummyData.rows[1]);
    util.filterData('name');
    dataTable.init('data', options);
  };

  window.filterPosition = function() {
    // do something
    console.log('Filter Position');
    util.filterData('position');
    dataTable.init('data', options);
  };

  window.filterPhoneNumber = function() {
    // do something
    console.log('Filter Phone Number');
    util.filterData('phoneNumber');
    dataTable.init('data', options);
  };

  window.filterEmail = function() {
    // do something
    console.log('Filter Email');
    util.filterData('email');
    dataTable.init('data', options);
  };

  window.filterCompany = function() {
    // do something
    console.log('Filter Company');
    util.filterData('company');
    dataTable.init('data', options);
  };


  //
  // Public APIs
  //

  return dataTable;

});