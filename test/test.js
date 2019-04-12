// const sinon = require('sinon');
const mocha = require('mocha');
var describe = mocha.describe
var it = mocha.it
let chai = require('chai');
let should = require('should');
const fs = require('fs');
const API_key = 'bdf2f149187f5a48c2ac2515041f6f91';
const project_key = 'GKmjp5I2kObFE';
const localizeService = require('../main')(API_key);

describe('Localize APIs', () => {
    let projectTestData = {
            projectId: '',
            phraseId: '',
            translationId: '',
        };

    it('Should import contents from CSV file', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            language: 'fr',
            format: 'CSV',
            type: 'glossary',
            filename: 'to-translte.csv',
            file: __dirname + '/to-translte.csv',
            contentType: 'text/csv',
        };

        localizeService.content.import(data, function(err, result){
            if(err) {
                console.log('error in importContent:' + err);
            }
            result.meta.status.should.eql(200);
            done();
            
        });
    });

    it('Should fail to import contents from CSV file', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            language: 'fr',
            format: '',
            type: 'glossary',
            filename: 'to-translte.csv',
            file: __dirname + '/to-translte.csv',
            contentType: 'text/csv',
        };

        localizeService.content.import(data, function(err, result){
            if(err) {
                err.should.not.be.eql(null);
            }
            done();
            
        });
    });

    it('Should export contents as JSON', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            language: 'en',
            format: 'JSON',
            context: 'An active phrase context',
        };

        localizeService.content.export(data, function(err, result){
            if(err) {
                console.log('error in exportContent:' + err);
            }
            result.should.have.property('dictionary')
            done();
        });
    });

    it('Should fail to export contents as JSON', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            language: 'en',
            format: '',
            context: 'An active phrase context',
        };

        localizeService.content.export(data, function(err, result){
            if(err) {
                err.should.not.be.eql(null);
            }
            done();
        });
    });

    it('Should create a new project', function (done) {
        this.timeout(10000);
        const data = {
            name: 'testing1',
            sourceLanguage: 'en',
        };

        localizeService.project.create(data, function(err, result){
            if(err) {
                console.log('error in createProject:' + err);
            }
            projectTestData.projectId = result.data.project.id;
            result.data.project.should.have.property('id');
            done();
        });
    });

    it('Should fail to create a new project', function (done) {
        this.timeout(10000);
        const data = {
            name: 'testing1',
            sourceLanguage: '',
        };

        localizeService.project.create(data, function(err, result){
            if(err) {
                err.should.not.be.eql(null);
            }
            done();
        });
    });

    it('Should get list of projects', function (done) {
        this.timeout(10000);

        localizeService.project.getAll(function(err, result){
            if(err) {
                console.log('error in get Project:' + err);
            }
            result.data.projects.should.be.an.Array();
            done();
        });
    });

    it('Should get a single Project', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
        };

        localizeService.project.getOne(data, function(err, result){
            if(err) {
                console.log('error in getAProject:' + err);
            }
            result.data.project.should.have.property('id');
            done();
            
        });
    });

    it('Should fail to get projects', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: '',
        };

        localizeService.project.getOne(data, function(err, result){
            if(err) {
                err.message.should.be.eql('Invalid input params');
            }
            done(); 
        });
    });

    it('Should get list of languages', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            code: 'en',
        };

        localizeService.project.languages(data, function(err, result){
            if(err) {
                console.log('error in getLanguages:' + err);
            }
            result.data.languages.should.be.an.Array();
            done();
        });
    });

    it('Should get team members of a project', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
        };

        localizeService.project.getTeam(data,function(err,result){
            if(err) {
                console.log('error in getTeamMembers:' + err);
            }
            result.data.team.should.be.an.Array();
            done();
        });
    });

    it('Should create a phrase', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            phraseList: { phrases: [{ 'phrase': 'phrase4', 'context': 'context' }] }
        };

        localizeService.phrase.create(data, function(err, result){
            if(err) {
                console.log('error in createAPhrase:' + err);
            }
            result.meta.status.should.eql(200);
            done();
        });
    });

    it('Should fail to create phrase', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            phraseList: { phrases: [{}] }
        };

        localizeService.phrase.create(data, function(err, result){
            if(err) {
                err.should.not.be.eql(null);
            }
            done();
        });
    });

    it('Should get list of phrases', function (done) {
        this.timeout(10000);
        const data = { 
            projectKey: project_key, 
            limit: '2',
            state: 'pending', 
            context: 'context', 
        };

        localizeService.phrase.getAll(data, function(err, result){
            if(err) {
                console.log('error in getPhrases:' + err);
            }
            projectTestData.phraseId = result.data.phrases[0].id;
            result.data.phrases.should.be.an.Array();
            done();
        });
    });

    it('Should fail to get list of phrases', function (done) {
        this.timeout(10000);
        const data = { 
            projectKey: project_key, 
            limit: '2',
            state: 'nothing', 
            context: 'context', 
        };

        localizeService.phrase.getAll(data, function(err, result){
            if(err) {
                err.should.not.be.eql(null);
            }
            done();
        });
    });

    it('Should get a phrase based on id', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            id: projectTestData.phraseId, 
        };

        localizeService.phrase.getOne(data, function(err, result){
            if(err) {
                console.log('error in getAPhrase:' + err);
            }
            result.data.phrases.should.be.an.Array();
            done();
        });
    });

    it('Should fail to get a phrase based on id', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            id: '', 
        };

        localizeService.phrase.getOne(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params');
            }
            done();
        });
    });

    it('Should delete a phrase based on id', function (done) {
        this.timeout(10000);
        const data = { 
            projectKey: project_key,
            id: projectTestData.phraseId, 
        };

        localizeService.phrase.deleteOne(data, function(err, result){
            if(err) {
                console.log('error in deleteAPhrase:' + err);
            }
            result.meta.status.should.eql(200);
            done();
        });
    });

    it('Should fail to delete a phrase based on id', function (done) {
        this.timeout(10000);
        const data = { 
            projectKey: project_key,
            id: '', 
        };

        localizeService.phrase.deleteOne(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params');
            }
            done();
        });
    });

    it('Should create a translation', function (done) {
        this.timeout(10000);
        const data = { 
            translationDetails: { 
                phrase: projectTestData.phraseId,
                value: '#Hello, world!',
                state: 'active',
                language: 'fr',
                comment: 'testing',
            }, 
             projectKey: project_key, 
        };

        localizeService.translation.create(data, function(err, result){
            if(err) {
                console.log('error in createATranslation:' + err);
            }
            projectTestData.translationId = result.data.translation.id;
            result.data.translation.should.have.property('id');
            done();
        });
    });

    it('Should fail to create a translation', function (done) {
        this.timeout(10000);
        const data = { 
            translationDetails: { 
                phrase: projectTestData.phraseId,
                value: '#Hello, world!',
                state: 'active',
                language: '',
                comment: 'testing',
            }, 
             projectKey: project_key, 
        };

        localizeService.translation.create(data, function(err, result){
            if(err) {
                err.should.not.eql(null);
            }
            done();
        });
    });

    it('Should get list of translations', function (done) {
        this.timeout(10000);
        const data = { 
            language: 'fr',
            projectKey: project_key 
        };

        localizeService.translation.getAll(data, function(err, result){
            if(err) {
                console.log('error in getTranslations:' + err);
            }
            result.data.translations.should.be.an.Array();
            done();
        });
    });

    it('Should fail to get list of translations', function (done) {
        this.timeout(10000);
        const data = { 
            language: '',
            projectKey: project_key 
        };

        localizeService.translation.getAll(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params')
            }
            done();
        });
    });

    it('Should get a translation based on id', function (done) {
        this.timeout(10000);
        const data = { 
            projectKey: project_key,
            language: 'en' ,
            translationId: projectTestData.translationId,
        };

        localizeService.translation.getOne(data, function(err, result){
            if(err) {
                console.log('error in getATranslation:' + err);
            }
            result.meta.status.should.be.eql(200);
            result.data.translation.should.have.property('id');
            done();
        });
    });

    it('Should fail to get a translation based on id', function (done) {
        this.timeout(10000);
        const data = { 
            projectKey: project_key,
            language: '' ,
            translationId: projectTestData.translationId,
        };

        localizeService.translation.getOne(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params');
            }
            done();
        });
    });

    it('Should update a translation based on id', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            translationId: projectTestData.translationId,
            translationDetails: { 
                value: 'nieuwe zin',
                state: 'active',
                comment: 'testing',
            },
        };

        localizeService.translation.update(data, function(err, result){
            if(err) {
                console.log('error in updateATranslation:' + err);
            }
            result.meta.status.should.be.eql(200);
            result.data.translation.should.have.property('id');
            done();
        });
    });

    it('Should fail to update a translation based on id', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            translationId:'',
            translationDetails: { 
                value: 'nieuwe zin',
                state: 'active',
                comment: 'testing',
            },
        };

        localizeService.translation.update(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params');
            }
            done();
        });
    });

    it('Should delete a translation based on id', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            translationId: projectTestData.translationId,
        };

        localizeService.translation.deleteOne(data, function(err, result){
            if(err) {
                console.log('error in deleteATranslation:' + err);
            }
            result.meta.status.should.be.eql(200);
            done();
        });
    });

    it('Should fail to delete a translation based on id', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            translationId: '',
        };

        localizeService.translation.deleteOne(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params');
            }
            done();
        });
    });


    it('Should translate a given phrase', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            phrase: 'This is a sample text',
            target: 'fr',
            source: 'en',
        };
        
        localizeService.machine.translate(data, function(err, result){
            if(err) {
                console.log('error in translatePhrase:' + err);
            }
            result.data.translation.should.eql('Ceci est un exemple de texte');
            done();
        });
    });

    it('Should fail to translate a given phrase', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            phrase: 'This is a sample text',
            target: '',
            source: 'en',
        };
        
        localizeService.machine.translate(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params');
            }
            done();
        });
    });

    it('Should detect language of a given phrase', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            phrase: 'Ceci est un exemple de texte',
        };

        localizeService.machine.detectLanguage(data, function(err, result){
            if(err) {
                console.log('error in detectLanguage:' + err);
            }
            result.data.language.should.eql('fr');
            done();
        });
    });

    it('Should fail to detect language of a given phrase', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
            phrase: '',
        };

        localizeService.machine.detectLanguage(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params');
            }
            done();
        });
    });

    it('Should list supported languages', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: project_key,
        };

        localizeService.machine.supportedLanguages(data, function(err, result){
            if(err) {
                console.log('error in supportedLanguages:' + err);
            }
            result.meta.status.should.be.eql(200);
            result.data.languages.should.be.an.Array();
            done();
        });
    });

    it('Should fail to list supported languages', function (done) {
        this.timeout(10000);
        const data = {
            projectKey: '',
        };

        localizeService.machine.supportedLanguages(data, function(err, result){
            if(err) {
                err.message.should.eql('Invalid input params');
            }
            done();
        });
    });

});