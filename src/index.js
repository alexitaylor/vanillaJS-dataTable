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


  var myTable = document.getElementById('data-table');
  root.myPlugin.init(myTable, {data: data});

})();