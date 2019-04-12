const _               = require('underscore');
const request         = require('request');
const bugsnag         = require('bugsnag');
const fs              = require('fs');

//GLobals
var apibase = 'https://api.localizejs.com/v2.0/';

// Create api signature
const createApiSignature = function(apiKey) {
  return {
    'Authorization': 'Bearer '+apiKey,
    'tracking-id': Date.now(),
    'content-type': 'application/json',
  };
};

const createMethod = function(method,apiKey) {
  return function(uri, data, cb) {
    const isFormData = method === 'POST' && data.file;
    const signature = createApiSignature(apiKey);
    const requestUri = apibase + uri;
    const options = {
      method: method,
      uri: requestUri,
      headers:signature,
    };

    if (!isFormData) {
      if (typeof data === 'function') {
        cb = data;
        data = {};
      } else if (['string', 'number'].indexOf(typeof data) !== -1) {
        data = { id: data };
      }

      // Add data to request
      if (method === 'GET' || method === 'DELETE') {
        options.qs = data || {};
      } else {
        options.json = data || {};
      }
    } else {
      options.headers['content-type'] = 'multipart/form-data';
      options.headers['transfer-encoding'] = 'chunked';      
      options.formData = {
        content:  fs.createReadStream(data.file),
        filename: data.filename.toString() || "",
        contentType: data.contentType.toString() || "",
        language: data.language.toString() || "",
        format:data.format.toString() || "",
      };
    }
    return request(options, cb ? globalResponseHandler(options, cb) : undefined);
  };
};

const globalResponseHandler = function(requestOptions, cb) {
  return function(err, res, body) {
    if (typeof cb !== 'function') return;

    // Catch connection errors
    if (err || !res) {
      let returnErr = 'Error connecting to localize-service';
      if (err) returnErr += ': ' + err.code;
      err = returnErr;
    } else if (res.statusCode !== 200) {
      err = 'Something went wrong. localize-service responded with a ' + res.statusCode;
      err += '\n Error Body Response is ' + JSON.stringify(res.body);
    }
    if (err) {
      bugsnag.notify(new Error(err), {
        groupingHash: 'localize-service',
        metadata: {
          requestOptions,
        },
      });

      return cb(err, null);
    }

    // Try to parse response
    if (body !== Object(body)) {
      try {
        body = JSON.parse(res.toJSON().body);
      } catch (e) {
        return cb('Could not parse response from localize-service: ' + body, null);
      }
    }

    // Check for error returned in a 200 response
    if (body.opstat === 'error') {
      if (body.err) return cb(body.err);
      return cb(err);
    }

    // Make sure response is OK
    if (body['tracking-id']) body = body.response;

    // Return response
    cb(null, body);
  };
};
  

////
//   PUBLIC API
////

module.exports = function(apiKey) {
    var get = createMethod('GET', apiKey),
        post = createMethod('POST', apiKey),
        put = createMethod('PUT', apiKey),
        deleteCall = createMethod('DELETE', apiKey),
        api = {};
    
  return {

    content: {
      // Import contents
      import: (data, done) => {
        if(!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/resources';
        post(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Export contents
      export: (data, done) => {
        if(!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/resources';
        get(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
    },

    project: {
      // Create a project
      create: (data, done) => {
        const endPoint = 'projects';
        post(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Get all projects
      getAll: (done) => {
        const endPoint = 'projects';
        get(endPoint, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Get a project
      getOne:(data, done) => {
        if(!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey;
        get(endPoint, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Get team members
      getTeam:(data, done) => {
        if(!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/team-members';
        get(endPoint, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Languages in a project
      languages: (data, done) => {
        const endPoint = 'languages';
        get(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      }
    },

    phrase: {
      // Create a phrase
      create: (data, done) => {
        if(!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/phrases';
        post(endPoint, data.phraseList ,function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Get all phrases
      getAll: (data, done) => {
        if(!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/phrases';
        get(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Get a single phrase
      getOne: (data, done) => {
        if(!data.projectKey || !data.id ) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/phrases';
        get(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Delete a phrase
      deleteOne: (data, done) => {
        if(!data.projectKey || !data.id ) return done(new Error('Invalid input params'));
        const endPoint = 'projects/'+ data.projectKey + '/phrases/' + data.id;
        deleteCall(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
    },

    translation: {
      // Create a translation
      create: (data, done) => {
        if(!data.projectKey || !data.translationDetails) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations';
        post(endPoint, data.translationDetails ,function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Get all translations
      getAll: (data, done) => {
        if(!data.projectKey || !data.language ) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations';
        get(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Get a translation
      getOne: (data, done) => {
        if(!data.projectKey || !data.translationId || !data.language ) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations/' + data.translationId;
        get(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Update a translation
      update: (data, done) => {
        if(!data.projectKey || !data.translationId ) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations/' + data.translationId;
        put(endPoint, data.translationDetails ,function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      // Delete a translation
      deleteOne: (data, done) => {
        if(!data.projectKey || !data.translationId ) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations/' + data.translationId;
        deleteCall(endPoint, function(err, result){
            if (err) return done(err);
            done(null, result);
        })
      },
      
    },

    machine: {
      // Translate a phrase
      translate: (data, done) => {
        if(!data.projectKey || !data.target || !data.phrase ) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/machine-translations/translate';
        get(endPoint, data, function(err, result){
            if (err) return done(err);
            done(null, result);
        });
      },
      // Detect language of a phrase
      detectLanguage: (data,done) => {
        if(!data.projectKey || !data.phrase ) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/machine-translations/detect';
        get(endPoint, data, function(err, result){
          if(err) return done(err);
          done(null, result);
        });
      },
      // Get supported languages list
      supportedLanguages: (data,done) => {
        if(!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/machine-translations/languages';
        get(endPoint, function(err, result){
          if(err) return done(err);
          done(null, result);
        });
      },
    },

  }
}