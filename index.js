const axios = require('axios');
const {
  chunkPromise,
  PromiseFlavor,
  ChunkPromiseCallbackForceStopError
} = require('chunk-promise');

// Define an array of API endpoints
const apiUrlArr = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3',
  'https://jsonplaceholder.typicode.com/posts/4',
  'https://jsonplaceholder.typicode.com/posts/5'
];

// Define a function that retrieves data from a single API endpoint
const fetchData = async (apiUrl) => {
  const response = await axios.get(apiUrl);
  return response.data;
};

// Define a callback function that logs the results of each chunk
const promiseAllSettledCallback = async (chunkResults, index, allResults) => {
  console.log(`chunk (${index}): ${chunkResults.length} results`);
};

// Use chunkPromise to retrieve data from the API
chunkPromise(apiUrlArr.map(apiUrl => () => fetchData(apiUrl)), {
  concurrent: 3,
  sleepMs: 1000,
  callback: promiseAllSettledCallback,
  promiseFlavor: PromiseFlavor.PromiseAllSettled,
})
  .then(res => {
    console.log('success');
    console.log(res , 'ii');
  })
  .catch(err => {
    if (err instanceof ChunkPromiseCallbackForceStopError) {
      console.log('Force stop');
    } else {
      console.log('failed');
      console.log(err);
    }
  });
