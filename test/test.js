const mocha = require('mocha');
var describe = mocha.describe
var it = mocha.it
let should = require('should');

// In order to run tests you will need to include
// an API key and a project key below
const API_key = '4e94c062c09b495b86c805c8d6657da6';
const project_key = 'FmQk9Ed2LNQ2B';

const localizeService = require('../main')(API_key);

describe('Localize APIs', () => {
    let projectTestData = {
        projectId: '',
        phraseId: '',
        translationId: '',
        labelId: '',
        documentId: ''
    };

    describe('PROJECTS', () => {
        it('Should create a new project', function (done) {
            const data = {
                name: 'testing1' + new Date().getTime(),
                sourceLanguage: 'en',
                activeLanguages: ['fr'],
                type: 'web'
            };
            localizeService.project.create(data, function (err, result) {
                if (err) {
                    console.log('error in createProject:' + err);
                }
                projectTestData.projectId = result.data.project.id;
                result.data.project.should.have.property('id');
                done();
            });
        });

        it('Should fail to create a new project', function (done) {
            const data = {
                name: 'testing1',
                sourceLanguage: '',
            };
            localizeService.project.create(data, function (err, result) {
                err.should.not.be.eql(null);
                done();
            });
        });

        it('Should get list of projects', function (done) {
            localizeService.project.getAll(function (err, result) {
                if (err) {
                    console.log('error in get Project:' + err);
                }
                result.data.projects.should.be.an.Array();
                done();
            });
        });

        it('Should get a single Project', function (done) {
            const data = {
                projectKey: project_key,
            };
            localizeService.project.getOne(data, function (err, result) {
                if (err) {
                    console.log('error in getAProject:' + err);
                }
                result.data.project.should.have.property('id');
                done();
            });
        });

        it('Should fail to get projects', function (done) {
            const data = {
                projectKey: '',
            };
            localizeService.project.getOne(data, function (err, result) {
                if (err) {
                    err.message.should.be.eql('Invalid input params');
                }
                done();
            });
        });
    });


    describe('PHRASES', () => {
        it('Should create a phrase', function (done) {
            const timestamp = new Date().getTime();
            const data = {
                projectKey: project_key,
                phrases: [{ 'phrase': 'phrase1' + timestamp, 'context': 'context' }, { 'phrase': 'phrase2' + timestamp, 'context': 'context' }],
            };

            localizeService.phrase.create(data, function (err, result) {
                if (err) {
                    console.log('error in createAPhrase:' + err);
                }
                result.meta.status.should.eql(200);
                done();
            });
        });

        it('Should fail to create phrase', function (done) {
            const data = {
                projectKey: project_key,
                phrases: [{}],
            };

            localizeService.phrase.create(data, function (err, result) {
                result.data.errors.length.should.eql(1);
                done();
            });
        });

        it('Should get list of phrases', function (done) {
            const data = {
                projectKey: project_key,
                limit: '2',
            };

            localizeService.phrase.getAll(data, function (err, result) {
                if (err) {
                    console.log('error in getPhrases:' + err);
                }
                projectTestData.phrase1Id = result.data.phrases[0].id;
                projectTestData.phrase2Id = result.data.phrases[1].id;
                result.data.phrases.should.be.an.Array();
                done();
            });
        });

        it('Should fail to get list of phrases', function (done) {
            const data = {
                projectKey: project_key,
                limit: '2',
                state: 'nothing',
                context: 'context',
            };

            localizeService.phrase.getAll(data, function (err, result) {
                err.should.not.be.eql(null);
                done();
            });
        });

        it('Should delete a phrase based on id', function (done) {
            const data = {
                projectKey: project_key,
                id: projectTestData.phrase1Id,
            };

            localizeService.phrase.deleteOne(data, function (err, result) {
                if (err) {
                    console.log('error in deleteAPhrase:' + err);
                }
                result.meta.status.should.eql(200);
                done();
            });
        });

        it('Should fail to delete a phrase based on id', function (done) {
            const data = {
                projectKey: project_key,
                id: '',
            };

            localizeService.phrase.deleteOne(data, function (err, result) {
                if (err) {
                    err.message.should.eql('Invalid input params');
                }
                done();
            });
        });

        it('Should update a phrase based on id', function (done) {
            const timestamp = new Date().getTime();
            const data = {
                projectKey: project_key,
                phrases: [{
                  id: projectTestData.phrase2Id,
                  phrase: 'a test phrase - localize services' + timestamp,
                }]
            };
            localizeService.phrase.update(data, function (err, result) {
                if (err) {
                    console.log('error in updatePhrases:' + err);
                }
                result.data.phrasesUpdated.should.eql(1);
                done();
            });
        });

        it('Should fail to update a phrase based on phrases', function (done) {
            const data = {
                projectKey: project_key,
                phrases: [{}],
            };
            localizeService.phrase.update(data, function (err, result) {
                if (err) {
                    err.message.should.eql('Invalid input params');
                }
                done();
            });
        });
    });

    describe('LABELS', () => {
        it('Should create a label', function (done) {
            const data = {
                projectKey: project_key,
                name: 'a test label - localize services' + new Date().getTime(),
                description: 'test description',
                rules: ['autoapprove', 'neverdeprecate', 'excludeOrderTranslation', 'excludeMachineTranslation'],
                showInMenu: true,
            };
            localizeService.label.create(data, function (err, result) {
                if (err) {
                    console.log('error in createLabel:' + err);
                }
                result.meta.status.should.eql(200);
                done();
            });
        });

        it('Should fail to create label', function (done) {
            const data = {
                projectKey: project_key,
                name: ""
            };
            localizeService.label.create(data, function (err, result) {
                err.should.not.be.eql(null);
                done();
            });
        });

        it('Should get list of labels', function (done) {
            const data = {
                projectKey: project_key,
            };
            localizeService.label.getAll(data, function (err, result) {
                if (err) {
                    console.log('error in getPhrases:' + err);
                }
                projectTestData.labelId = result.data[0]._id;
                result.data.should.be.an.Array();
                done();
            });
        });

        it('Should fail to get list of labels', function (done) {
            const data = {
                projectKey: '',
            };
            localizeService.label.getAll(data, function (err, result) {
                err.should.not.be.eql(null);
                done();
            });
        });

        it('Should get a label based on id', function (done) {
            const data = {
                projectKey: project_key,
                labelId: projectTestData.labelId,
            };
            localizeService.label.getOne(data, function (err, result) {
                if (err) {
                    console.log('error in getALabel:' + err);
                }
                result.data.label.should.have.property('_id');
                done();
            });
        });

        it('Should fail to get a label based on id', function (done) {
            const data = {
                projectKey: project_key,
                labelId: '',
            };
            localizeService.label.getOne(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });

        it('Should update a label based on id', function (done) {
            const data = {
                projectKey: project_key,
                name: 'a test label - localize services' + new Date().getTime(),
                description: 'test description',
                rules: ['autoapprove', 'neverdeprecate', 'excludeOrderTranslation', 'excludeMachineTranslation'],
                showInMenu: true,
                labelId: projectTestData.labelId,
            };
            localizeService.label.update(data, function (err, result) {
                if (err) {
                    console.log('error in updateATranslation:' + err);
                }
                result.should.have.property('_id');
                done();
            });
        });

        it('Should fail to update a label based on id', function (done) {
            const data = {
                projectKey: project_key,
                name: 'a test label - localize services' + new Date().getTime(),
                description: 'test description',
                rules: ['autoapprove', 'neverdeprecate', 'excludeOrderTranslation', 'excludeMachineTranslation'],
                labelId: '',
            };
            localizeService.label.update(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });

        it('Should delete a label based on id', function (done) {
            const data = {
                projectKey: project_key,
                labelId: projectTestData.labelId,
            };
            localizeService.label.deleteOne(data, function (err, result) {
                if (err) {
                    console.log('error in deleteALabel:' + err);
                }
                result.meta.status.should.eql(200);
                done();
            });
        });

        it('Should fail to delete a label based on id', function (done) {
            const data = {
                projectKey: project_key,
                labelId: '',
            };
            localizeService.label.deleteOne(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });
    });
    describe('TRANSLATION', () => {
        it('Should create a translation', function (done) {
            const data = {
                phrase: projectTestData.phrase2Id,
                value: '#Hello, world!',
                state: 'active',
                language: 'zh',
                comment: 'testing',
                projectKey: project_key,
            };
            localizeService.translation.create(data, function (err, result) {
                if (err) {
                    console.log('error in createATranslation:' + err);
                }
                projectTestData.translationId = result.data.translation.id;
                result.data.translation.should.have.property('id');
                done();
            });
        });

        it('Should fail to create a translation', function (done) {
            const data = {
                phrase: projectTestData.phrase2Id,
                value: '#Hello, world!',
                state: 'active',
                language: '',
                comment: 'testing',
                projectKey: project_key,
            };
            localizeService.translation.create(data, function (err, result) {
                err.should.not.eql(null);
                done();
            });
        });

        it('Should get list of translations', function (done) {
            const data = {
                language: 'zh',
                projectKey: project_key,
            };

            localizeService.translation.getAll(data, function (err, result) {
                if (err) {
                    console.log('error in getTranslations:' + err);
                }
                result.data.translations.should.be.an.Array();
                done();
            });
        });

        it('Should fail to get list of translations', function (done) {
            const data = {
                language: '',
                projectKey: project_key,
            };
            localizeService.translation.getAll(data, function (err, result) {
                err.message.should.eql('Invalid input params')
                done();
            });
        });

        it('Should get a translation based on id', function (done) {
            const data = {
                projectKey: project_key,
                translationId: projectTestData.translationId,
            };
            localizeService.translation.getOne(data, function (err, result) {
                if (err) {
                    console.log('error in getATranslation:' + err);
                }
                result.meta.status.should.be.eql(200);
                result.data.translation.should.have.property('id');
                done();
            });
        });

        it('Should fail to get a translation based on id', function (done) {
            const data = {
                projectKey: project_key,
                translationId: '',
            };
            localizeService.translation.getOne(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });

        it('Should update a translation based on id', function (done) {
            const data = {
                projectKey: project_key,
                translationId: projectTestData.translationId,
                state: 'active',
                comment: 'testing',
            };
            localizeService.translation.update(data, function (err, result) {
                if (err) {
                    console.log('error in updateATranslation:' + err);
                }
                result.meta.status.should.be.eql(200);
                result.data.translation.should.have.property('_id');
                done();
            });
        });

        it('Should fail to update a translation based on id', function (done) {
            const data = {
                projectKey: project_key,
                translationId: '',
                state: 'active',
                comment: 'testing',
            };
            localizeService.translation.update(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });

        it('Should delete a translation based on id', function (done) {
            const data = {
                projectKey: project_key,
                translationId: projectTestData.translationId,
            };
            localizeService.translation.deleteOne(data, function (err, result) {
                if (err) {
                    console.log('error in deleteATranslation:' + err);
                }
                result.meta.status.should.be.eql(200);
                done();
            });
        });

        it('Should fail to delete a translation based on id', function (done) {
            const data = {
                projectKey: project_key,
                translationId: '',
            };
            localizeService.translation.deleteOne(data, function (err, result) {
                if (err) {
                    err.message.should.eql('Invalid input params');
                }
                done();
            });
        });
    });
    describe('IMPORT/ EXPORT', () => {
        it('Should import contents from CSV file', function (done) {
            const data = {
                projectKey: project_key,
                type: 'phrase',
                language: 'zh',
                format: 'CSV',
                content: __dirname + '/to-translte.csv',
            };
            localizeService.content.import(data, function (err, result) {
                if (err) {
                    console.log('error in importContent:' + err);
                }
                result.meta.status.should.eql(200);
                done();

            });
        });

        it('Should fail to import contents from CSV file', function (done) {
            const data = {
                projectKey: project_key,
                language: 'zh',
                format: '',
                type: 'glossary',
                content: __dirname + '/to-translte.csv',
            };
            localizeService.content.import(data, function (err, result) {
                err.should.not.be.eql(null);
                done();
            });
        });

        it('Should export contents as JSON', function (done) {
            const data = {
                projectKey: project_key,
                language: 'zh',
                format: 'JSON',
            };
            localizeService.content.export(data, function (err, result) {
                if (err) {
                    console.log('error in exportContent:' + err);
                }
                result.should.have.property('dictionary')
                done();
            });
        });

        it('Should fail to export contents as JSON', function (done) {
            const data = {
                projectKey: project_key,
                language: 'en',
                format: '',
                context: 'An active phrase context',
            };
            localizeService.content.export(data, function (err, result) {
                err.should.not.be.eql(null);
                done();
            });
        });
    });
    describe('DOCUMENTS', () => {
        it('Should upload source documents', function (done) {
            const data = {
                projectKey: project_key,
                fileName: 'to-translte.csv',
                language: 'zh',
                content: __dirname + '/to-translte.csv',
            };
            localizeService.documents.createDocument(data, function (err, result) {
                if (err) {
                    console.log('error in upload Document:' + err);
                }
                result.meta.status.should.eql(200);
                done();
            });
        });

        it('Should fail to upload documents from CSV file', function (done) {
            const data = {
                projectKey: project_key,
                language: '',
                content: __dirname + '/to-translte.csv',
            };
            localizeService.documents.createDocument(data, function (err, result) {
                err.should.not.be.eql(null);
                done();
            });
        });

        it('Should Upload a translated document', function (done) {
            const data = {
                projectKey: project_key,
                documentId: projectTestData.documentId,
                fileName: 'uploadDoc',
                language: 'zh',
                content: __dirname + '/to-translte.csv',
            };
            localizeService.documents.createTranslation(data, function (err, result) {
                if (err) {
                    console.log('error in upload Document:' + err);
                }
                result.meta.status.should.eql(200);
                done();
            });
        });
        it('Should Upload fail a translated document', function (done) {
            const data = {
                projectKey: project_key,
                documentId: projectTestData.documentId,
                fileName: 'uploadDoc',
                language: '',
                content: __dirname + '/to-translte.csv',

            };
            localizeService.documents.createTranslation(data, function (err, result) {
                err.should.not.be.eql(null);
                done();
            });
        });
        it('Should Get a list of documents', function (done) {
            const data = {
                projectKey: project_key,
            };
            localizeService.documents.getDocuments(data, function (err, result) {
                if (err) {
                    console.log('error in get Documents:' + err);
                }
                result.data.should.be.an.Array();
                done();
            });
        });
        it('Should fail to get Get a list of documents without mandatory fields', function (done) {
            const data = {
                projectKey: '',
            };
            localizeService.documents.getDocuments(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });

        it('Should fail to get a translation based on id', function (done) {
            const data = {
                projectKey: project_key,
                documentId: '',
            };
            localizeService.documents.downloadDocument(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });
        it('Should get a Source document based on id', function (done) {
            const data = {
                projectKey: project_key,
                documentId: projectTestData.documentId,
            };
            localizeService.documents.downloadDocument(data, function (err, result) {
                if (err) {
                    console.log('error in Source document:' + err);
                }
                result.should.not.be.empty;
                done();
            });
        });
        it('Should Get a translated document', function (done) {
            const data = {
                language: 'zh',
                projectKey: project_key,
                documentId: projectTestData.documentId,
            };
            localizeService.documents.downloadTranslation(data, function (err, result) {
                if (err) {
                    console.log('error in get a Translated documents:' + err);
                }
                result.should.not.be.empty;
                done();
            });
        });
        it('Should fail get a translated document', function (done) {
            const data = {
                language: '',
                projectKey: project_key,
                documentId: projectTestData.documentId,
            };
            localizeService.documents.downloadTranslation(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });
        it('Should delete a Document based on id', function (done) {
            const data = {
                projectKey: project_key,
                documentId: projectTestData.documentId,
            };
            localizeService.documents.deleteOne(data, function (err, result) {
                if (err) {
                    console.log('error in delete a documents:' + err);
                }
                result.meta.status.should.eql(200);
                done();
            });
        });

        it('Should fail to delete a documents based on id', function (done) {
            const data = {
                projectKey: project_key,
                documentId: '',
            };
            localizeService.documents.deleteOne(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });  
    });

    describe('MACHINE TRANSLATION', () => {
        it('Should translate a given phrase', function (done) {
            const data = {
                projectKey: project_key,
                phrase: 'This is a sample text',
                targetLanguage: 'zh',
                sourceLanguage: 'en',
            };
            localizeService.machine.translate(data, function (err, result) {
                if (err) {
                    console.log('error in translatePhrase:' + err);
                }
                result.data.translation.should.eql('这是一个示例文本');
                done();
            });
        });

        it('Should fail to translate a given phrase', function (done) {
            const data = {
                projectKey: project_key,
                phrase: 'This is a sample text',
                targetLanguage: '',
                sourceLanguage: 'en',
            };

            localizeService.machine.translate(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });

        it('Should detect language of a given phrase', function (done) {
            const data = {
                projectKey: project_key,
                phrase: 'Ceci est un exemple de texte',
            };

            localizeService.machine.detectLanguage(data, function (err, result) {
                if (err) {
                    console.log('error in detectLanguage:' + err);
                }
                result.data.language.should.eql('fr');
                done();
            });
        });

        it('Should fail to detect language of a given phrase', function (done) {
            const data = {
                projectKey: project_key,
                phrase: '',
            };
            localizeService.machine.detectLanguage(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });

        it('Should list supported languages', function (done) {
            const data = {
                projectKey: project_key,
            };
            localizeService.machine.supportedLanguages(data, function (err, result) {
                if (err) {
                    console.log('error in supportedLanguages:' + err);
                }
                result.meta.status.should.be.eql(200);
                result.data.languages.should.be.an.Array();
                done();
            });
        });

        it('Should list supported languages', function (done) {
            const data = {
                projectKey: project_key,
                target: 'es'
            };
            localizeService.machine.supportedLanguages(data, function (err, result) {
                if (err) {
                    console.log('error in supportedLanguages:' + err);
                }
                result.meta.status.should.be.eql(200);
                result.data.languages.should.be.an.Array();
                result.data.target.should.eql('es');
                done();
            });
        });

        it('Should fail to list supported languages', function (done) {
            const data = {
                projectKey: '',
            };
            localizeService.machine.supportedLanguages(data, function (err, result) {
                err.message.should.eql('Invalid input params');
                done();
            });
        });

        describe('ORGANIZATION TEAM', () => {
            it('Should get team members of a project', function (done) {
                const data = {
                    projectKey: project_key,
                };
                localizeService.getTeam(data, function (err, result) {
                    if (err) {
                        console.log('error in getTeamMembers:' + err);
                    }
                    result.data.team.should.be.an.Array();
                    done();
                });
            });
            it('Should fail to get team members of a project without mandatory fields', function (done) {
                const data = {
                    projectKey: '',
                };
                localizeService.getTeam(data, function (err, result) {
                    if (err) {
                        err.message.should.eql('Invalid input params');
                    }
                    done();
                });
            });
        });
        describe('SYSTEM', () => {
            it('Should get list of languages', function (done) {
                const data = {
                };
                localizeService.languages(data, function (err, result) {
                    if (err) {
                        console.log('error in getLanguages:' + err);
                    }
                    result.data.languages.should.be.an.Array();
                    done();
                });
            });
            it('Should get list of languages for a valid language code', function (done) {
                const data = {
                    code: 'en',
                };
                localizeService.languages(data, function (err, result) {
                    if (err) {
                        console.log('error in getLanguages:' + err);
                    }
                    result.data.languages.length.should.eql(1);
                    done();
                });
            });
            it('Should not get list of languages for a invalid language code', function (done) {
                const data = {
                    code: 'xxx',
                };
                localizeService.languages(data, function (err, result) {
                    if (err) {
                        console.log('error in getLanguages:' + err);
                    }
                    should.not.exist(result);
                    done();
                });
            });
        });
    });
});
