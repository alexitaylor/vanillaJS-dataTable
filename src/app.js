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

  // Default settings
  var defaults = {
    turkey: true,
    mayo: false,
    bread: 'wheat',
  };

  // tabular data

  var data = {
    "headings": [
      "Name",
      "Position",
      "Phone Number",
      "Email",
      "Company",
    ],
    "rows": [
      [
        "Hedwig F. Nguyen",
        "Full Stack Engineer",
        "342.678.9384",
        "hedwig@gmail.com",
        "Sales Force"
      ],
    ]
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
     * @returns {Object} 200 Fake values
     */
    createData: function() {
      var dummyData = {
        rows: [],
      };

      for (var i = 0; i < 200; i++) {
        dummyData.rows.push({
          name: faker.name.findName(),
          email: faker.internet.email(),
          compnay: faker.company.companyName(),
          phoneNumber: faker.phone.phoneNumberFormat(),
          position: faker.name.title(),
        });
      }

      return dummyData;
    },
  };

  /**
   * A private method
   * @private
   */
  var somePrivateMethod = function () {
    // Code goes here...
  };

  /**
   * A public method
   */
  dataTable.init = function (table, options) {
    var tableRef = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    // Fake data to insert to table
    var data = util.createData();
    data.rows.forEach(function(row){
      // Insert a row in the table at new row index
      var newRow   = tableRef.insertRow(tableRef.rows.length);
      var idx = 0;
      for (var data in row) {
        var newCell  = newRow.insertCell(idx);
        // Append a text node to the cell
        var newText  = document.createTextNode(row[data]);
        newCell.appendChild(newText);
        idx++;
      }
    });
  };

  /**
   * Another public method
   */
  // publicMethods.init = function ( options ) {
  //
  //   // Merge user options with defaults
  //   var settings = util.extend( defaults, options || {} );
  //
  //   // Listen for click events
  //   document.addEventListener( 'click', function (){
  //     // Do something...
  //   }, false );
  //
  //   // Listen for window resize events
  //   window.addEventListener( 'resize',  function (){
  //     // Do something...
  //   }, false );
  //
  //   // Code goes here...
  //   //
  // };


  //
  // Public APIs
  //

  return dataTable;

});