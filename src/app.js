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
  var publicMethods = {}; // Placeholder for public methods

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
  };


  function DataTable(table, options) {
    var tableRef = document.getElementById('data-table').getElementsByTagName('tbody')[0];

    // Insert a row in the table at row index 0
    var newRow   = tableRef.insertRow(tableRef.rows.length);

    for (var i = 0; i < 5; i++) {
      // Insert a cell in the row at index 0
      var newCell  = newRow.insertCell(i);
      // Append a text node to the cell
      var newText  = document.createTextNode('New row row')
      newCell.appendChild(newText);
    }
  }

  var myTable = document.getElementById('data-table');
  DataTable(myTable, {data: data});

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
  publicMethods.doSomething = function (table, options) {
    var t = document.getElementById(table);

    // create DOM element
    var elTh = document.createElement('th');
    var elTd = document.createElement('td');

    // Fill new element with HTML content
    elTh.innerHTML('testing123');
    elTd.innerHTML('testing123');

    // Element can nom be inserted in DOM tree
    t.thead.appendChild(elTh);
    t.tbody.appendChild(elTd);
  };

  /**
   * Another public method
   */
  publicMethods.init = function ( options ) {

    // Merge user options with defaults
    var settings = util.extend( defaults, options || {} );

    // Listen for click events
    document.addEventListener( 'click', function (){
      // Do something...
    }, false );

    // Listen for window resize events
    window.addEventListener( 'resize',  function (){
      // Do something...
    }, false );

    // Code goes here...
    //
  };


  //
  // Public APIs
  //

  return publicMethods;

});