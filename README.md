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
- Please refer to Localize's [API Docs](https://help.localizejs.com/reference#api-overview) for endpoint details.

Methods
-------

-importContent
-exportContent
-getProjects
-createProject
-getAProject
-createAPhrase
-getPhrases
-getAPhrase
-deleteAPhrase
-createATranslation
-getTranslations
-getATranslation
-updateATranslation
-deleteATranslation
-getLanguages
-getTeamMembers
-translatePhrase
-detectLanguage
-languagesList