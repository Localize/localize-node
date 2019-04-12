# localize-services
Wrapper for Localize public API's

Installation
------------

Install via [npm](http://npmjs.org/):

    npm install localize-services --save

test command:

    Checkout the project and in root folder run 'npm run test'

Initialize with your localize keys 

    let localizeService = require('localize-services')(key);

Endpoints
----------
  
- All callbacks are passed an error and response: `callback(err, res)`.
- Please refer to Localize's [API Docs](https://help.localizejs.com/reference#api-overview) for endpoint details.

**localizeServices.content**

    localizeService.content.import({
            projectKey: <your projectkey>,
            language: 'fr',
            format: 'CSV',
            type: 'glossary',
            filename: 'to-translte.csv',
            file: __dirname + '/to-translte.csv',
            contentType: 'text/csv',
        }, callback);

    localizeService.content.export({
            projectKey: <your projectkey>,
            language: 'en',
            format: 'JSON',
            context: 'An active phrase context',
        }, callback);

**localizeServices.project**

    localizeService.project.create({
            name: 'project1',
            sourceLanguage: 'en',
        }, callback);

    localizeService.project.getAll(callback);

    localizeService.project.getOne({
            projectKey: <your projectkey>,
        }, callback);

    localizeService.project.languages({
            projectKey: <your projectkey>,
            code: 'en',
        }, callback);

    localizeService.project.getTeam({
            projectKey: <your projectkey>,
        }, callback);

**localizeServices.phrase**
    localizeService.phrase.create({
            projectKey: <your projectkey>,
            phraseList: { phrases: [{ 'phrase': 'phrase1', 'context': 'context1' }] },
        }, callback):

    localizeService.phrase.getAll({ 
            projectKey: <your projectkey>, 
            limit: '2',
            state: 'pending', 
            context: 'context', 
        }, callback);

    localizeService.phrase.getOne({
            projectKey: <your projectkey>,
            id: <phraseId>, 
        }, callback);

    localizeService.phrase.deleteOne({ 
            projectKey: <your projectkey>,
            id: <phraseId>, 
        }, callback);
    
**localizeServices.translation**

    localizeService.translation.create({ 
            translationDetails: { 
                phrase: <phraseId>,
                value: '#Hello, world!',
                state: 'active',
                language: 'fr',
                comment: 'testing',
            }, 
             projectKey: <your projectkey>, 
        }, callback);

    localizeService.translation.getAll({ 
            language: 'fr',
            projectKey: <your projectkey>, 
        }, callback);

    localizeService.translation.getOne({ 
            projectKey: <your projectkey>,
            language: 'en' ,
            translationId: <translationId>,
        }, callback);

    localizeService.translation.update({
            projectKey: <your projectkey>,
            translationId: <translationId>,
            translationDetails: { 
                value: 'nieuwe zin',
                state: 'active',
                comment: 'testing',
            },
        }, callback);

    localizeService.translation.deleteOne({
            projectKey: <your projectkey>,
            translationId: <translationId>,
        }, callback);

**localizeServices.machine**

    localizeService.machine.translate({
            projectKey: <your projectkey>,
            phrase: 'This is a sample text',
            target: 'fr',
            source: 'en',
        }, callback);

    localizeService.machine.detectLanguage({
            projectKey: <your projectkey>,
            phrase: 'Ceci est un exemple de texte',
        }, callback);

    localizeService.machine.supportedLanguages({
            projectKey: <your projectkey>,
        }, callback);

Contribute
----------

Forks and pull requests welcome!

Author
----------

Supported and maintained by [Localize](https://localizejs.com/).