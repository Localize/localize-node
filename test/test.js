// const sinon = require('sinon');
const mocha = require('mocha');
var describe = mocha.describe
var it = mocha.it
let chai = require('chai');
let should = require('should');
const key = 'b1f14c23539766384d760733f94ba20e';
const Readable = require('stream').Readable;
const localizeService = require('../main')(key);

describe('Localize APIs', () => {
    let projectTestData = {
        projectId: '',
        phraseId: '',
        translationId: '',
    }

    it.skip('importContent', function (done) {
        this.timeout(10000);

        const stream = new Readable();
        stream.push(__dirname + '/phrase.xliff');
        stream.push(null);
        const data = {
            projectKey:'HnaArqQystM8D',
            language:'en',
            format:'XLIFF',
            type:'glossary',
            file:__dirname + '/phrase.xliff',
            content:stream,
        }

        localizeService.content.import(data, function(err, result){
            if(err) {
                console.log('error in importContent:' + err);
            }
            done();
            
        });
    });

    it('exportContent', function (done) {
        this.timeout(10000);
        data = {
            projectKey:'HnaArqQystM8D',
            language: 'en',
            format: 'JSON',
            context: 'An active phrase context',
        }

        localizeService.content.export(data, function(err, result){
            if(err) {
                console.log('error in exportContent:' + err);
            }
            result.should.have.property('dictionary')
            done();
        });
    });

    it('createProject', function (done) {
        this.timeout(10000);
        data = {
            projectKey:'HnaArqQystM8D',
            name: 'testing1',
            sourceLanguage: 'en',
        }

        localizeService.project.create(data, function(err, result){
            if(err) {
                console.log('error in createProject:' + err);
            }
            projectTestData.projectId = result.data.project.id;
            result.data.project.should.have.property('id');
            done();
        });
    });

    it('getProjects', function (done) {
        this.timeout(10000);

        localizeService.project.getAll(function(err, result){
            if(err) {
                console.log('error in createProject:' + err);
            }
            result.data.projects.should.be.an.Array();
            done();
        });
    });

    it('getAProject', function (done) {
        this.timeout(10000);
        data = {
            projectKey:'HnaArqQystM8D',
        }

        localizeService.project.getOne(data, function(err, result){
            if(err) {
                console.log('error in getAProject:' + err);
            }
            result.data.project.should.have.property('id');
            done();
            
        });
    });

    it('should fail to get projects', function (done) {
        this.timeout(10000);
        data = {
            projectKey:'',
        }

        localizeService.project.getOne(data, function(err, result){
            if(err) {
                console.log('error in getAProject:' + err);
                err.message.should.be.eql('Invalid input params');
            }
            done(); 
        });
    });

    it('getLanguages', function (done) {
        this.timeout(10000);
        data = {
            "projectKey" : "HnaArqQystM8D",
            "code" : "en",
        }

        localizeService.project.languages(data, function(err, result){
            if(err) {
                console.log('error in getLanguages:' + err);
            }
            result.data.languages.should.be.an.Array();
            done();
        });
    });

    it('getTeamMembers', function (done) {
        this.timeout(10000);
        const data = {
            "projectKey" : "HnaArqQystM8D",
        }
        localizeService.project.getTeam(data,function(err,result){
            if(err) {
                console.log('error in getTeamMembers:' + err);
            }
            result.data.team.should.be.an.Array();
            done();
        });
    });


    it('getlanguagesList', function (done) {
        this.timeout(20000);
        const data = {
            projectKey:'HnaArqQystM8D'
        };
        
        localizeService.project.languages(data, function(err, result){
            if(err) {
                console.log('error in languagesList :' + err);
            }
            result.data.languages.should.be.Array();
            done();
        });
    });;

    it('createAPhrase', function (done) {
        this.timeout(10000);
        data = {
            projectKey:'HnaArqQystM8D',
            phraseList:{ phrases: [{ 'phrase': 'phrase4', 'context': 'context' }] }
        }

        localizeService.phrase.create(data, function(err, result){
            if(err) {
                console.log('error in createAPhrase:' + err);
            }
            result.meta.status.should.eql(200);
            done();
        });
    });

    it('getPhrases', function (done) {
        this.timeout(10000);
        data = { 
            "projectKey" : "HnaArqQystM8D", 
            "limit":"2",
            'state':'pending', 
            "context":"context", 
        }

        localizeService.phrase.getAll(data, function(err, result){
            if(err) {
                console.log('error in getPhrases:' + err);
            }
            projectTestData.phraseId = result.data.phrases[0].id;
            result.data.phrases.should.be.an.Array();
            done();
        });
    });

    it('getAPhrase', function (done) {
        this.timeout(10000);
        data =  {
            "projectKey" : "HnaArqQystM8D",
             "id": projectTestData.phraseId, 
            }

        localizeService.phrase.getOne(data, function(err, result){
            if(err) {
                console.log('error in getAPhrase:' + err);
            }
            result.data.phrases.should.be.an.Array();
            done();
        });
    });

    it('deleteAPhrase', function (done) {
        this.timeout(10000);
        data =  { 
            "projectKey" : "HnaArqQystM8D",
             "id":projectTestData.phraseId, 
            }

        localizeService.phrase.deleteOne(data, function(err, result){
            if(err) {
                console.log('error in deleteAPhrase:' + err);
            }
            result.meta.status.should.eql(200);
            done();
        });
    });

    it('createATranslation', function (done) {
        this.timeout(10000);
        data =  { 
            "translationDetails": { 
                "phrase":"5c9c70b24696107ae33830a8",
                "value":"#Hello, world!",
                "state":"active",
                "language":"fr",
                "comment":"testing"
             }, 
             "projectKey":"HnaArqQystM8D" 
            }

        localizeService.translation.create(data, function(err, result){
            if(err) {
                console.log('error in createATranslation:' + err);
            }
            projectTestData.translationId = result.data.translation.id;
            result.data.translation.should.have.property('id');
            done();
        });
    });

    it('getTranslations', function (done) {
        this.timeout(10000);
        data =  { 
            "language":"fr",
             "projectKey":"HnaArqQystM8D" 
            }

        localizeService.translation.getAll(data, function(err, result){
            if(err) {
                console.log('error in getTranslations:' + err);
            }
            result.data.translations.should.be.an.Array();
            done();
        });
    });

    it('getATranslation', function (done) {
        this.timeout(10000);
        data =  { 
            "projectKey" : "HnaArqQystM8D",
             "language":"en" ,
             "translationId": projectTestData.translationId,
            }

        localizeService.translation.getOne(data, function(err, result){
            if(err) {
                console.log('error in getATranslation:' + err);
            }
            result.meta.status.should.be.eql(200);
            result.data.translation.should.have.property('id');
            done();
        });
    });

    it('updateATranslation', function (done) {
        this.timeout(10000);
        data = {
            "projectKey" : "HnaArqQystM8D",
             "translationId":projectTestData.translationId,
              "translationDetails" : { 
                  "value":"nieuwe zin",
                   "state":"active",
                    "comment":"testing",
                }
            }

        localizeService.translation.update(data, function(err, result){
            if(err) {
                console.log('error in updateATranslation:' + err);
            }
            result.meta.status.should.be.eql(200);
            result.data.translation.should.have.property('id');
            done();
        });
    });

    it('deleteATranslation', function (done) {
        this.timeout(10000);
        data = {
            "projectKey" : "HnaArqQystM8D",
            "translationId":projectTestData.translationId,
        }

        localizeService.translation.deleteOne(data, function(err, result){
            if(err) {
                console.log('error in deleteATranslation:' + err);
            }
            result.meta.status.should.be.eql(200);
            done();
        });
    });


    it('translatePhrase', function (done) {
        this.timeout(10000);
        const data = {
            projectKey:'HnaArqQystM8D',
            phrase:'This is a sample text',
            target:'fr',
            source:'en',
        }
        
        localizeService.machine.translate(data, function(err, result){
            if(err) {
                console.log('error in translatePhrase:' + err);
            }
            result.data.translation.should.eql('Ceci est un exemple de texte');
            done();
        });
    });

    it('detectLanguage', function (done) {
        this.timeout(10000);
        const data = {
            projectKey:'HnaArqQystM8D',
            phrase:'Ceci est un exemple de texte',
        }

        localizeService.machine.detectLanguage(data, function(err, result){
            if(err) {
                console.log('error in detectLanguage:' + err);
            }
            result.data.language.should.eql("fr");
            done();
        });
    });

});