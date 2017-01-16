
'use strict';

module.exports = {
  hello: function (req, res) {

    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var name = req.swagger.params.name.value || 'stranger';
    var hello = `Hello, ${name}`;

    // this sends back a JSON response which is a single string
    res.json(hello);
  }
};

