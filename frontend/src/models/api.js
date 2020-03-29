import atom from 'atom-js';

import {
  extendedRequestEnd,
  get,
} from 'sf/helpers/request';

const model = atom.setup({
  parsers: {
    full_name: (input) => (input || '').trim(),
    username: (input) => (input || '').trim(),
  },

  methods: {
    get_available_sources: (resolve, reject) => {
      get('backend/get_available_sources/', 'SIGNUP')
        //.send(data)
        .end(extendedRequestEnd(resolve, reject));
    }
  }
})({});


export default model;
