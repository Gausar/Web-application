/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 * @returns a Promise that should be filled with the response of the GET request
 * parsed as a JSON object and returned in the property named "data" of an
 * object. If the request has an error, the Promise should be rejected with an
 * object that contains the properties:
 * {number} status          The HTTP response status
 * {string} statusText      The statusText from the xhr request
 */

function fetchModel(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve({ data: JSON.parse(xhr.responseText) });
      } else {
        reject(new Error(xhr.statusText));
      }
    };

    xhr.onerror = function () {
      reject(new Error(xhr.statusText));
    };

    xhr.open('GET', url);

    xhr.send();
  });
}

export default fetchModel;
