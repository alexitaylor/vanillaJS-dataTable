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
  // var t = document.createElement('table');
  // tabular data

  var options = {
    perPage: 10,
    currentPaginationIndex: 0,
    perPagination: 10,
  };


  var myTable = 'something';
  root.myPlugin.init(myTable, options);
  var totalEntries = root.myPlugin.getTotalEntries();
  document.getElementById('total-entry').innerHTML = totalEntries;
  document.getElementById('to-entry').innerHTML = '1 - 10';
  root.myPlugin.getPagination();
});