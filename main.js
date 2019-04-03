var _               = require('underscore'),
    request         = require('request');

//GLobals
var apibase = 'https://api.localizejs.com/v2.0/';


// GET request to Localize with a publicKey
var getRequestWithApi = function() {
    return function(path, headerData, done) {
        let options = {
            method: 'GET',
            url: apibase + path,
            headers: headerData,
            json: true,
        };
        request.get(options, globalResponseHandler(options, done));
    };
};


// POST request to Localize with a publicKey
var postRequestWithApi = function(){
  return function(path, headerData, data, done) {
    delete data.projectKey;
    let options = {
        method: 'POST',
        url: apibase + path,
        headers: headerData,
        body:data,
        json: true,
    };
    request.post(options, globalResponseHandler(options, done));
  };
};

// PUT request to Localize with a publicKey
var putRequestWithApi = function(){
  return function(path, headerData, data, done) {
    delete data.projectKey;
    let options = {
        method: 'PUT',
        url: apibase + path,
        headers: headerData,
        body:data,
        json: true,
    };
    request.put(options, globalResponseHandler(options, done));
  };
};

// DELETE request to Localize with a publicKey
var deleteRequestWithApi = function(){
  return function(path, headerData, done) {
    console.log("delete");
    let options = {
        method: 'DELETE',
        url: apibase + path,
        headers: headerData,
        json: true,
    };
    request.delete(options, globalResponseHandler(options, done));
  };
};
// Response handler
var globalResponseHandler = function(request, done) {
    return function(err, res, body) {
      var msg;
      console.log(JSON.stringify(body));
      if (!done || !_.isFunction(done)) return;
  
      // Catch connection errors
      if (err || !res || res.statusCode !== 200) return done({
        error: err,
        response: res,
        body: body,
        request: request,
        toString: function() {
          return err ? err.toString() : '';
        },
      }, null);
  
      // Return response
      done(null, body);
    };
  };

////
//   PUBLIC API
////

module.exports = function(apiKey) {
    var get = getRequestWithApi(),
        post = postRequestWithApi(),
        put = putRequestWithApi(),
        deleteCall = deleteRequestWithApi(),
        api = {};
        headerType1 = {
          'Authorization': 'Bearer '+apiKey,
          'Content-type': 'application/json',
        },
        headerType2 = {
          'Authorization': 'Bearer '+apiKey,
        }
    
    ////
    //  Import contents
    ////

    api.importContent = function(data, done){
      if(!data.projectKey) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/resources';
      post(endPoint, headerType1, data, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //  Export contents
    ////

    api.exportContent = function(data, done){
      if(!data.projectKey) return done(new Error('Invalid input params'));
      var queryParams = '?';
      if(data.language){
        queryParams = queryParams + "language=" + data.language + "&";
      }
      if(data.format){
        queryParams = queryParams + "format=" + data.format + "&";
      }
      if(data.type){
        queryParams = queryParams + "type=" + data.type + "&";
      }
      if(data.filter){
        queryParams = queryParams + "filter=" + data.filter + "&";
      }
      if(data.context){
        queryParams = queryParams + "context=" + data.context + "&";
      }
      const endPoint = 'projects/' + data.projectKey + '/resources' + queryParams;
      get(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Get Projects
    ////

    api.getProjects = function(done){
        get('', headerType1, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
    }

    ////
    //   Create Project
    ////

    api.createProject = function(data, done){
      const endPoint = 'projects/';
      post(endPoint, headerType1, data, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }
    
    ////
    //   Get a project
    ////

    api.getAProject = function(data, done){
      if(!data.projectKey) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/';
      get(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Create a phrase
    ////

    api.createAPhrase = function(data, done){
      if(!data.projectKey) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/phrases';
      post(endPoint, headerType1, data.phraseList ,function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Get Phrases
    ////

    api.getPhrases = function(data, done){
      if(!data.projectKey) return done(new Error('Invalid input params'));
      var queryParams = '?';
      if(data.limit){
        queryParams = queryParams + "limit=" + data.limit + "&";
      }
      if(data.skip){
        queryParams = queryParams + "skip=" + data.skip + "&";
      }
      if(data.state){
        queryParams = queryParams + "state=" + data.state + "&";
      }
      if(data.labels){
        queryParams = queryParams + "labels=" + data.labels + "&";
      }
      if(data.context){
        queryParams = queryParams + "context=" + data.context + "&";
      }
      const endPoint = 'projects/' + data.projectKey + '/phrases' + queryParams;
      get(endPoint, headerType1, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Get a phrase
    ////

    api.getAPhrase = function(data, done){
      if(!data.projectKey || !data.id ) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/phrases/' + data.id;
      get(endPoint, headerType1, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Delete a phrase
    ////

    api.deleteAPhrase = function(data, done){
      if(!data.projectKey || !data.id ) return done(new Error('Invalid input params'));
      const endPoint = 'projects/'+ data.projectKey + '/phrases/' + data.id;
      deleteCall(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Create a phrase
    ////

    api.createATranslation = function(data, done){
      if(!data.projectKey || !data.translationDetails) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/translations/';
      console.log(JSON.stringify(data.translationDetails));
      post(endPoint, headerType1, data.translationDetails ,function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Get translations
    ////

    api.getTranslations = function(data, done){
      if(!data.projectKey || !data.language ) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/translations?language=' + data.language ;
      get(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Get a translations
    ////

    api.getATranslation = function(data, done){
      if(!data.projectKey || !data.translationId || !data.language ) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/translations/' + data.translationId + '?language=' + data.language ;
      console.log(endPoint);
      get(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Update a translation
    ////

    api.updateATranslation = function(data, done){
      if(!data.projectKey || !data.translationId ) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/translations/' + data.translationId;
      put(endPoint, headerType1, data.translationDetails ,function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Delete a translation
    ////

    api.deleteATranslation = function(data, done){
      if(!data.projectKey || !data.translationId ) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/translation/' + data.translationId +'/';
      deleteCall(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Get languages
    ////

    api.getLanguages = function(data, done){
      var code = '';
      if(data.code){
        code = data.code;
      }
      const endPoint = 'languages?code=' + code;
      get(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Get team members
    ////
    
    api.getTeamMembers = function(data, done){
      if(!data.projectKey) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/team-members';
      get(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      })
    }

    ////
    //   Translate a Phrase
    ////

    api.translatePhrase = function(data, done){
      var sourceLanguage = '';
      if(!data.projectKey || !data.targetLanguage || !data.phrase ) return done(new Error('Invalid input params'));
      if(data.sourceLanguage){ 
        sourceLanguage = data.sourceLanguage;
      }
      const endPoint = 'projects/' + data.projectKey + '/machine-translations/translate?phrase=' + `${data.phrase}` + '&target=' + data.targetLanguage + '&source=' + sourceLanguage;
      get(endPoint, headerType2, function(err, result){
          if (err) return done(err);
          done(null, result);
      });
    };

    ////
    //   Detect language of a phrase
    ////

    api.detectLanguage = function(data,done){
      if(!data.projectKey || !data.phrase ) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/machine-translations/detect?phrase=' + data.phrase;
      get(endPoint, headerType2, function(err, result){
        if(err) return done(err);
        done(null, result);
      });
    };

    ////
    //  Get supported languages list
    ////

    api.languagesList = function(data,done){
      if(!data.projectKey) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/machine-translations/languages';
      get(endPoint, headerType2, function(err, result){
        if(err) return done(err);
        done(null, result);
      });
    };

    ////
    //   RETURN APIextend
    ////

    return {
        importContent:        api.importContent,   
        exportContent:        api.exportContent,
        getProjects:          api.getProjects,
        createProject:        api.createProject,
        getAProject:          api.getAProject,
        createAPhrase:        api.createAPhrase,
        getPhrases:           api.getPhrases,
        getAPhrase:           api.getAPhrase,
        deleteAPhrase:        api.deleteAPhrase,
        createATranslation:   api.createATranslation,
        getTranslations:      api.getTranslations,
        getATranslation:      api.getATranslation,
        updateATranslation:   api.updateATranslation,
        deleteATranslation:   api.deleteATranslation,
        getLanguages:         api.getLanguages,
        getTeamMembers:       api.getTeamMembers,
        translatePhrase:      api.translatePhrase,
        detectLanguage:       api.detectLanguage,
        languagesList:        api.languagesList,
      };
}