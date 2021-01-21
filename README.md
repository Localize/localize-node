# @localize/node
Wrapper for Localize public API's

Installation
------------

Install via [npm](http://npmjs.org/):

    npm install @localize/node --save

Test command:

    Checkout the project and in the root folder run 'npm run test'

Initialize with your Localize API key

    let localizeService = require('@localize/node')(key);

Endpoints
----------

- All callbacks are passed an error and response: `callback(err, res)`.
- Please refer to Localize's [API Docs](https://help.localizejs.com/reference#api-overview) for endpoint details.

**localizeServices.project**

    localizeService.project.create({
            name: 'project1',
            sourceLanguage: 'en',
        }, callback);

    Required fields:  name, sourceLanguage       

    ---

    localizeService.project.getAll(callback);

    ---

    localizeService.project.getOne({
            projectKey: <your projectkey>,
        }, callback);

    Required fields:  projectKey    

    ---        

**localizeServices.phrase**

    localizeService.phrase.create({
            projectKey: <your projectkey>,
            phrases: [{ 'phrase': 'phrase1', 'context': 'context1' }],
        }, callback):

    Required fields:  projectKey, phrases   

    ---

    localizeService.phrase.getAll({
            projectKey: <your projectkey>,
            limit: '2',
            state: 'pending',
            context: 'context',
        }, callback);

    Required fields:  projectKey   

    ---

    localizeService.phrase.update({
            projectKey: <your projectkey>,
            phrases: [{ 'phrase': 'phrase1', 'id': <phraseId>, 'context': 'context', 'labels': [] }]
        }, callback);

    Required fields:  projectKey, phrases    

    ---

    localizeService.phrase.deleteOne({
            projectKey: <your projectkey>,
            id: <phraseId>,
        }, callback);

    Required fields:  projectKey, id        

    ---

**localizeServices.labels**

    localizeService.label.create({
            projectKey: <your projectkey>,
            name: 'label1',
            description: 'test description',
            rules: ['autoapprove', 'neverdeprecate', 'excludeOrderTranslation', 'excludeMachineTranslation'],
            showInMenu: true,
        }, callback);

    Required fields:  projectKey, name     

    ---

    localizeService.label.getAll({
            projectKey: <your projectkey>,
        }, callback);

    Required fields:  projectKey      

    ---

    localizeService.label.getOne({
            projectKey: <your projectkey>,
            labelId: <labelId>,
        }, callback);

    Required fields:  projectKey, labelId         

    ---

    localizeService.label.update({
            projectKey: <your projectkey>,
            labelId: <labelId>,
            name: 'label1',
            description: 'test description',
            rules: ['autoapprove', 'neverdeprecate', 'excludeOrderTranslation', 'excludeMachineTranslation'],
            showInMenu: true,
        },
    }, callback);

    Required fields:  projectKey, labelId        

    ---

    localizeService.label.deleteOne({
            projectKey: <your projectkey>,
            labelId: <labelId>,
        }, callback);

    Required fields:  projectKey, labelId       

    ---

**localizeServices.translation**

    localizeService.translation.create({
            phrase: <phraseId>,
            value: '#Hello, world!',
            state: 'active',
            language: 'fr',
            comment: 'testing',
            projectKey: <your projectkey>,
        }, callback);

    Required fields: projectKey, value, state, language       

    ---

    localizeService.translation.getAll({
            language: 'fr',
            projectKey: <your projectkey>,
        }, callback);

    Required fields:  projectKey, language     

    ---

    localizeService.translation.getOne({
            projectKey: <your projectkey>,
            translationId: <translationId>,
        }, callback);

    Required fields: projectKey, translationId      

    ---

    localizeService.translation.update({
            projectKey: <your projectkey>,
            translationId: <translationId>,
            value: 'nieuwe zin',
            state: 'active',
            comment: 'testing',
        },
    }, callback);

    Required fields:  projectKey, translationId         

    ---

    localizeService.translation.deleteOne({
            projectKey: <your projectkey>,
            translationId: <translationId>,
        }, callback);

    Required fields: projectKey, translationId       

    ---

**localizeServices.content**

    localizeService.content.import({
            projectKey: <your projectkey>,
            language: 'fr',
            format: 'CSV',
            type: 'phrase',
            content: __dirname + '/to-translte.csv',
        }, callback);

    Required fields: projectKey, language, format, type, content        

    ---

    localizeService.content.export({
            projectKey: <your projectkey>,
            language: 'en',
            format: 'JSON',
            context: 'An active phrase context',
        }, callback);

    Required fields: projectKey, language, format        

    ---

**localizeServices.machine**

    localizeService.machine.translate({
            projectKey: <your projectkey>,
            phrase: 'This is a sample text',
            targetLanguage: 'fr',
            sourceLanguage: 'en',
        }, callback);

    Required fields:  projectKey, phrase, targetLanguage        

    ---
    localizeService.machine.detectLanguage({
            projectKey: <your projectkey>,
            phrase: 'Ceci est un exemple de texte',
        }, callback);

    Required fields:  projectKey, phrase        

    ---

    localizeService.machine.supportedLanguages({
            projectKey: <your projectkey>,
        }, callback);

    Required fields:  projectKey      

    ---

**localizeServices.getTeam**

    localizeService.getTeam({
            projectKey: <your projectkey>,
        }, callback);

    Required fields:  projectKey       

    ---
**localizeServices.languages**

    localizeService.languages({
            code: 'en',
        }, callback);

    ---

Contribute
----------

Forks and pull requests welcome!

Author
----------

Supported and maintained by [Localize](https://localizejs.com/).
