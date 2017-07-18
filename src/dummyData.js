var randomName = faker.name.findName(); // Caitlyn Kerluke
var randomEmail = faker.internet.email(); // Rusty@arne.info
var randomCompany = faker.company.companyName();
var randomPhoneNumber = faker.phone.phoneNumberFormat();
var randomPosition = faker.name.title();
console.log(randomName);



(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define([], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.myPlugin = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

  var dummyData = {
    rows: [],
  };

  for (var i = 0; i < 100; i++) {
    dummyData.rows.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      compnay: faker.company.companyName(),
      phoneNumber: faker.phone.phoneNumberFormat(),
      position: faker.name.title(),
    });
  }

  return dummyData;

});
