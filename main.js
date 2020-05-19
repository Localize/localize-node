const _ = require('underscore');
const request = require('request');
const fs = require('fs');

// Globals
const apibase = 'https://api.localizejs.com/v2.0/';

// Create api signature
const createApiSignature = (apiKey) => {
  return {
    'Authorization': 'Bearer ' + apiKey,
    'tracking-id': Date.now(),
    'content-type': 'application/json',
  };
};

const createMethod = (method, apiKey) => {
  return (uri, data, cb) => {
    const isFormData = method === 'POST' && data.file;
    const signature = createApiSignature(apiKey);
    const requestUri = apibase + uri;
    const options = {
      method: method,
      uri: requestUri,
      headers: signature,
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
      options.formData = {
        content: fs.createReadStream(data.file),
        language: data.language.toString() || "",
        format: data.format.toString() || "",
      };
    }
    return request(options, cb ? globalResponseHandler(options, cb) : undefined);
  };
};

const globalResponseHandler = (requestOptions, cb) => {
  return function (err, res, body) {
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
      return cb(err, res.body);
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

module.exports = function (apiKey) {
  const get = createMethod('GET', apiKey),
    post = createMethod('POST', apiKey),
    put = createMethod('PUT', apiKey),
    deleteCall = createMethod('DELETE', apiKey),
    api = {};

  return {


    project: {
      // Create a project
      create: (data, done) => {
        if (!data.name || !data.sourceLanguage) return done(new Error('Invalid input params'));
        const endPoint = 'projects';
        post(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Get all projects
      getAll: (done) => {
        const endPoint = 'projects';
        get(endPoint, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Get a project
      getOne: (data, done) => {
        if (!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey;
        get(endPoint, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
    },
    phrase: {
      // Create a phrase
      create: (data, done) => {
        if (!data.projectKey || !data.phrases) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/phrases';
        post(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Get all phrases
      getAll: (data, done) => {
        if (!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/phrases';
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Get a single phrase
      getOne: (data, done) => {
        if (!data.projectKey || !data.id) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/phrases/' + data.id;
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Delete a phrase
      deleteOne: (data, done) => {
        if (!data.projectKey || !data.id) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/phrases/' + data.id;
        deleteCall(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
    },
    label: {
      // Create a label
      create: (data, done) => {
        if (!data.projectKey || !data.name) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/labels';
        post(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Get all labels
      getAll: (data, done) => {
        if (!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/labels';
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Get a label
      getOne: (data, done) => {
        if (!data.projectKey || !data.labelId) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/labels/' + data.labelId;
        get(endPoint, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Update a label
      update: (data, done) => {
        if (!data.projectKey || !data.labelId) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/labels/' + data.labelId;
        put(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Delete a label
      deleteOne: (data, done) => {
        if (!data.projectKey || !data.labelId) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/labels/' + data.labelId;
        deleteCall(endPoint, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
    },
    translation: {
      // Create a translation
      create: (data, done) => {
        if (!data.projectKey || !data.value || !data.language || !data.state) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations';
        post(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Get all translations
      getAll: (data, done) => {
        if (!data.projectKey || !data.language) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations';
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Get a translation
      getOne: (data, done) => {
        if (!data.projectKey || !data.translationId) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations/' + data.translationId;
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Update a translation
      update: (data, done) => {
        if (!data.projectKey || !data.translationId) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations/' + data.translationId;
        put(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Delete a translation
      deleteOne: (data, done) => {
        if (!data.projectKey || !data.translationId) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/translations/' + data.translationId;
        deleteCall(endPoint, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },

    },
    content: {
      // Import contents
      import: (data, done) => {
        if (!data.projectKey || !data.language || !data.format || !data.type || !data.file) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/resources';
        post(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
      // Export contents
      export: (data, done) => {
        if (!data.projectKey || !data.language || !data.format) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/resources';
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        })
      },
    },

    machine: {
      // Translate a phrase
      translate: (data, done) => {
        if (!data.projectKey || !data.targetLanguage || !data.phrase) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/machine-translations/translate';
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        });
      },
      // Detect language of a phrase
      detectLanguage: (data, done) => {
        if (!data.projectKey || !data.phrase) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/machine-translations/detect';
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        });
      },
      // Get supported languages list
      supportedLanguages: (data, done) => {
        if (!data.projectKey) return done(new Error('Invalid input params'));
        const endPoint = 'projects/' + data.projectKey + '/machine-translations/languages';
        get(endPoint, data, function (err, result) {
          if (err) return done(err);
          done(null, result);
        });
      },
    },
    // Get team members
    getTeam: (data, done) => {
      if (!data.projectKey) return done(new Error('Invalid input params'));
      const endPoint = 'projects/' + data.projectKey + '/team-members';
      get(endPoint, function (err, result) {
        if (err) return done(err);
        done(null, result);
      })
    },
    // Languages in a project
    languages: (data, done) => {
      const endPoint = 'languages';
      get(endPoint, data, function (err, result) {
        if (err) return done(err);
        done(null, result);
      })
    },
  }
}
