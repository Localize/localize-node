// const sinon = require('sinon');
const mocha = require('mocha');
var describe = mocha.describe
var it = mocha.it
let chai = require('chai');
let should = require('should');
const key = 'b1f14c23539766384d760733f94ba20e';
const localizeservice = require('../main')(key);

describe('Localize APIs', () => {

    it('getlanguagesList', function (done) {
        const data = {
            projectKey:'HnaArqQystM8D'
        };
        
        localizeservice.languagesList(data, function(err, result){
            if(err) {
                console.log('error in languagesList');
                done();
            }
            result.data.languages.should.be.Array();
        });
    }).timeout(10000);;

    it('translatePhrase', function (done) {
        const data = {
            projectKey:'HnaArqQystM8D',
            phrase:'This is a sample text',
            targetLanguage:'fr',
            sourceLanguage:'en',
        }
        
        localizeservice.translatePhrase(data, function(err, result){
            if(err) {
                console.log('error in translatePhrase');
                done();
            }
            result.data.translation.should.eql('Ceci est un exemple de texte');
            done();
        });
    }).timeout(5000);

    it('detectLanguage', function (done) {
        const data = {
            projectKey:'HnaArqQystM8D',
            phrase:['Ceci est un exemple de texte'],
        }

        localizeservice.detectLanguage(data, function(err, result){
            if(err) {
                console.log('error in detectLanguage');
                done();
            }
            console.log('call :' + JSON.stringify(result));
            result.data.language.should.eql("fr");
        });
    }).timeout(10000);

    it('importContent', function (done) {
        const data = {
            projectKey:'HnaArqQystM8D',
            language:'en',
            format:'XLIFF',
            type:'glossary',
            content:"application/x-xliff;name=glossary-import-test-file.xliff;base64,PD94bWwgdmVyc2lvbiA9ICIxLjAiIGVuY29kaW5nPSJVVEYtOCI/Pgo8eGxpZmYgdmVyc2lvbj0iMS4yIj4KPGZpbGUgb3JpZ2luYWw9Im1haW4iIHNvdXJjZS1sYW5ndWFnZT0iZGUiIHRhcmdldC1sYW5ndWFnZT0iZW4iPgo8aGVhZD48L2hlYWQ+Cjxib2R5PgogIDx0cmFucy11bml0PgogICAgPHNvdXJjZSB4bWw6bGFuZz0iZGUiPldlbm4gU2llIGRpZXNlIFphaGx1bmdzd2Vpc2UgbnVyIGF1ZiBiZXN0aW1tdGUgTMOkbmRlciBiZXNjaHLDpG5rZW4gd29sbGVuLCBrw7ZubmVuIFNpZSBkaWVzZSBoaWVyIGF1c3fDpGhsZW4uJmx0Oy9zb3VyYyZndDs8L3NvdXJjZT4KICAgIDx0YXJ…dD4KICAgIDxzb3VyY2UgeG1sOmxhbmc9ImRlIj5EaWVzZSAlYW56YWhsJSBTcGVuZGVucXVpdHR1bmdlbiB3ZXJkZW4gaW4gZWluZW0gUERGIHp1c2FtbWVuZ2VmYXNzZW4gdW5kIElobmVuIGFscyBEb3dubG9hZCBhbmdlYm90ZW4uIERlciBWb3JnYW5nIGthbm4gZXR3YXMgWmVpdCBiZWFuc3BydWNoZW4uPC9zb3VyY2U+CiAgICA8dGFyZ2V0IHhtbDpsYW5nPSJlbiI+VGhlc2UgJWFuemFobCUgZG9uYXRpb24gcmVjZWlwdHMgd2lsbCBiZSBtZXJnZWQsIHB1dCBpbnRvIGEgUERGIGFuZCBvZmZlcmVkIGFzIGEgZG93bmxvYWQuIFRoZSBwcm9jZXNzIG1heSB0YWtlIHNvbWUgdGltZS48L3RhcmdldD4KICA8L3RyYW5zLXVuaXQ+CjwvYm9keT4KPC9maWxlPgo8L3hsaWZmPgo=",
        }

        localizeservice.importContent(data, function(err, result){
            if(err) {
                console.log('error in importContent');
                done();
            }
            console.log('call importContent:' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('exportContent', function (done) {
        data = {
            projectKey:'HnaArqQystM8D',
            language: 'en',
            format: 'JSON',
            context: 'An active phrase context',
        }

        localizeservice.exportContent(data, function(err, result){
            if(err) {
                console.log('error in exportContent');
                done();
            }
            console.log('call exportContent :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('createProject', function (done) {
        data = {
            projectKey:'HnaArqQystM8D',
            name: 'testing1',
            sourceLanguage: 'en',
        }

        localizeservice.createProject(data, function(err, result){
            if(err) {
                console.log('error in createProject');
                done();
            }
            console.log('call createProject :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('getAProject', function (done) {
        data = {
            projectKey:'HnaArqQystM8D',
        }

        localizeservice.getAProject(data, function(err, result){
            if(err) {
                console.log('error in getAProject');
                done();
            }
            console.log('call getAProject :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });


    it('createAPhrase', function (done) {
        data = {
            projectKey:'HnaArqQystM8D',
            phraseList:{ "phrases": [ { "phrase": "My new phrase", "context":"this phrase has context"} ] }
        }

        localizeservice.createAPhrase(data, function(err, result){
            if(err) {
                console.log('error in createAPhrase');
                done();
            }
            console.log('call createAPhrase :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('getPhrases', function (done) {
        data = { 
            "projectKey" : "HnaArqQystM8D", 
            "limit":"2", 
            "skip":"1", 
            "labels":"['sad']", 
            "context":"" 
        }

        localizeservice.getPhrases(data, function(err, result){
            if(err) {
                console.log('error in getPhrases');
                done();
            }
            console.log('call getPhrases :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('getAPhrase', function (done) {
        data =  { 
            "projectKey" : "HnaArqQystM8D",
             "id":"5c9c70b24696107ae33830a7" 
            }

        localizeservice.getAPhrase(data, function(err, result){
            if(err) {
                console.log('error in getAPhrase');
                done();
            }
            console.log('call getAPhrase :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('deleteAPhrase', function (done) {
        data =  { 
            "projectKey" : "HnaArqQystM8D",
             "id":"5c9c70b24696107ae33830a7" 
            }

        localizeservice.deleteAPhrase(data, function(err, result){
            if(err) {
                console.log('error in deleteAPhrase');
                done();
            }
            console.log('call deleteAPhrase :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('createATranslation', function (done) {
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

        localizeservice.createATranslation(data, function(err, result){
            if(err) {
                console.log('error in createATranslation');
                done();
            }
            console.log('call createATranslation :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('getTranslations', function (done) {
        data =  { 
            "language":"fr",
             "projectKey":"HnaArqQystM8D" 
            }

        localizeservice.getTranslations(data, function(err, result){
            if(err) {
                console.log('error in getTranslations');
                done();
            }
            console.log('call getTranslations :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('getATranslation', function (done) {
        data =  { 
            "projectKey" : "HnaArqQystM8D",
             "language":"en" ,
             "translationId":"5c9c711145963b0fb655575f"
            }

        localizeservice.getATranslation(data, function(err, result){
            if(err) {
                console.log('error in getATranslation');
                done();
            }
            console.log('call getATranslation :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('updateATranslation', function (done) {
        data = {
            "projectKey" : "HnaArqQystM8D",
             "translationId":"5c9c711145963b0fb655575f",
              "translationDetails" : { 
                  "value":"nieuwe zin",
                   "state":"active",
                    "comment":"testing",
                }
            }

        localizeservice.updateATranslation(data, function(err, result){
            if(err) {
                console.log('error in updateATranslation');
                done();
            }
            console.log('call updateATranslation :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('deleteATranslation', function (done) {
        data = {
            "projectKey" : "HnaArqQystM8D",
            "translationId":"5c9c711145963b0fb655575f",
        }

        localizeservice.deleteATranslation(data, function(err, result){
            if(err) {
                console.log('error in deleteATranslation');
                done();
            }
            console.log('call deleteATranslation :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });


    it('getLanguages', function (done) {
        data = {
            "projectKey" : "HnaArqQystM8D",
            "code" : "en",
        }

        localizeservice.getLanguages(data, function(err, result){
            if(err) {
                console.log('error in getLanguages');
                done();
            }
            console.log('call getLanguages :' + JSON.stringify(result));
            done();
            //result.data.language.should.eql("fr");
        });
    });

    it('getTeamMembers', function (done) {
        const data = {
            "projectKey" : "HnaArqQystM8D",
        }
        localizeservice.getTeamMembers(data,function(err,result){
            if(err) {
                console.log('error in getTeamMembers');
                done();
            }
            //console.log('call :' + JSON.stringify(result));
            result.data.team.should.be.an.Array();
            done();
        });
    });

});