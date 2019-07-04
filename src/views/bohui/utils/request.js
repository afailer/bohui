import axios from 'axios'
const getBaseUrl = () => {
  return ''
};

// axios.defaults.baseURL = getBaseUrl();

axios.interceptors.request.use((config) => {
  //
  return config
}, (err) => {
  //
  return Promise.reject(err)
});

axios.interceptors.response.use(
  resp => resp,
  error => {
    // dsfs
    return Promise.reject(error)
  }
);

const get = (url, params) => {
  if (params === undefined) {
    params = {}
  }
  return axios.get(url, params)
};

const post = (url, params) => {
  if (params === undefined) {
    params = {}
  }
  return axios.post(url, params)
};

const del = (url, params) => {
  if (params === undefined) {
    params = {}
  }
  return axios.delete(url, params)
};

export default {
  get,
  post,
  del
}
