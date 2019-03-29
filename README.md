# localize-services
Wrapper for Localize public API's

Installation
------------

Install via [npm](http://npmjs.org/)

    npm install localize-services --save


Initialize with your localize keys. 

    var localizeServices = require('localize-services')(key);


Endpoints
----------
  
- All callbacks are passed an error and response: `callback(err, res)`.
- Supports camelCase and underscore naming conventions (Gengo uses the underscore convention).
- Please refer to Localize's [API Docs](https://help.localizejs.com/reference#api-overview) for endpoint details.

