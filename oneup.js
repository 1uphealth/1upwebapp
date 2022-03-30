// utilities to interface with the 1uphealth api servers side
const request = require('request');
const async = require('async');
const { availableResources } = require('./resourcesConfig');

let accessTokenCache = {};
const ROOT_API_URL = `https://api.1up.health`;
const USER_API_URL = `https://api.1up.health`;
const FHIR_API_URL = `https://api.1up.health/fhir`;

function getTokenFromAuthCode(code, callback) {
  var postUrl = `${ROOT_API_URL}/fhir/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&grant_type=authorization_code`;

  request.post(postUrl, function (error, response, body) {
    if (error) {
      console.log('error', error);
    }
    try {
      console.log('body', response.statusCode, body, '----');
      var jsbody = JSON.parse(body);
      console.log('createOneUpUser', body);
      // never send the body.refrsh_token client side
      // this access token must be refreshed after 2 hours
      callback(jsbody.access_token);
    } catch (error) {
      // the auth code may take a second to register, so we can try again
      console.log('error parsing getTokenFromAuthCode', body, error);
    }
  });
}

// get the Auth code for existing user
function getAuthCodeForExistingUser(email, callback) {
  request.post(
    {
      url: `${ROOT_API_URL}/user-management/v1/user/auth-code?app_user_id=${email}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
    },
    (error, response, body) => {
      const jsbody = JSON.parse(body);
      let oneupUserId = jsbody.oneup_user_id;

      getTokenFromAuthCode(jsbody.code, function (access_token) {
        accessTokenCache[email] = access_token;
        callback(oneupUserId);
      });
    },
  );
}

// create new 1uphealth user
function createOneUpUser(email, callback) {
  let url = `${USER_API_URL}/user-management/v1/user?app_user_id=${email}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;
  request.post(url, function (error, response, body) {
    if (error) {
      console.log('Error POSTing to 1up user-management: ', error);
      callback();
    } else {
      console.log('body', response.statusCode, body, '----', url);
      let jsbody = JSON.parse(body);
      let oneupUserId = jsbody.oneup_user_id;
      if (jsbody.error === 'this user already exists') {
        getAuthCodeForExistingUser(email, callback);
      } else {
        getTokenFromAuthCode(jsbody.code, function (access_token) {
          accessTokenCache[email] = access_token;
          callback(oneupUserId);
        });
      }
    }
  });
}

// check for 1upehealth user
function getOneUpUserId(email, callback) {
  let getUrl = `${USER_API_URL}/user-management/v1/user?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&app_user_id=${email}`;
  console.log(getUrl);
  request.get(getUrl, function (error, response, body) {
    console.log('body', response.statusCode, body, '----', getUrl);
    let jsbody = JSON.parse(body);
    callback(jsbody.oneup_user_id);
  });
}

// gets the 1uphealth user id from the user email address
function getOrMakeOneUpUserId(email, callback) {
  getOneUpUserId(email, function (oneupUserId) {
    if (
      typeof oneupUserId === 'undefined' ||
      typeof accessTokenCache[email] === 'undefined'
    ) {
      createOneUpUser(email, function (oneupUserId) {
        console.log('createOneUpUser oneupUserId', oneupUserId);
        callback(oneupUserId);
      });
    } else {
      console.log('getOneUpUserId oneupUserId', oneupUserId);
      callback(oneupUserId);
    }
  });
}

// gets a fhir resource list for a user
function getFhirResourceBundle(
  apiVersion,
  resourceType,
  oneupAccessToken,
  callback,
) {
  let url = `${FHIR_API_URL}/${apiVersion}/${resourceType}`;
  let options = {
    url: url,
    headers: {
      Authorization: `Bearer ${oneupAccessToken}`,
    },
  };
  request.get(options, function (error, response, body) {
    console.log('error', error);
    console.log('url', url);
    console.log('body', body);
    if (error) {
    } else {
      console.log('body', response.statusCode, body, '----', url);
      try {
        // TODO do refactor of this block
        // eslint-disable-next-line no-unused-vars
        let jsbody = JSON.parse(body);
      } catch (e) {
        console.log('error***********', new Date(), url, options);
      }
    }
    callback(error, body);
  });
}

const endpointsToQuery = availableResources.reduce((data, item) => {
  item.resourceVersions.forEach((el) => {
    data.push({ apiVersion: el, resourceType: item.resourceType });
  });
  return data;
}, []);

const resourceDTO = (fhirVersion) => (data) => ({
  ...data,
  fhirVersion: fhirVersion,
});

function getAllFhirResourceBundles(oneupAccessToken, callback) {
  let responseData = {};
  async.map(
    endpointsToQuery,
    function (params, callback) {
      getFhirResourceBundle(
        params.apiVersion,
        params.resourceType,
        oneupAccessToken,
        function (error, body) {
          if (error) {
            callback(error);
          } else {
            try {
              let jsbody = JSON.parse(body);
              if (typeof responseData[params.resourceType] === 'undefined') {
                responseData[params.resourceType] = jsbody;
                responseData[params.resourceType].entry = responseData[
                  params.resourceType
                ].entry.map(resourceDTO(params.apiVersion));
              } else {
                responseData[params.resourceType].entry = responseData[
                  params.resourceType
                ].entry.concat(
                  jsbody.entry.map(resourceDTO(params.apiVersion)),
                );
              }
              callback(null, jsbody);
            } catch (e) {
              console.log('error in getFhirResourceBundle', e);
            }
          }
        },
      );
    },
    function (error, body) {
      if (error) {
        callback(error);
      } else {
        callback(responseData);
      }
    },
  );
}

exports.accessTokenCache = accessTokenCache;
exports.getOrMakeOneUpUserId = getOrMakeOneUpUserId;
exports.getFhirResourceBundle = getFhirResourceBundle;
exports.getAllFhirResourceBundles = getAllFhirResourceBundles;
