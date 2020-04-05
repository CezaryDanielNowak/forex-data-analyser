import atom from 'atom-js';
import { dateToString } from 'atom-js';

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
      get('backend/get_available_sources/')
        //.send(data)
        .end(extendedRequestEnd(resolve, reject));
    },

    get_data: () => {

    },

    get_data_intersection: (resolve, reject, sources, dateFrom, dateTo) => {
      let dateAddon = '';
      if (dateFrom >= 0 && dateTo) {
        dateAddon = `&dateFrom=${dateToString(dateFrom)}&dateTo=${dateToString(dateTo)}`;
      }

      get(`backend/get_data_intersection/?source[]=${sources[0]}&source[]=${sources[1]}${dateAddon}`)
        //.send(data)
        .end(extendedRequestEnd(resolve, reject));
    }
  }
})({});


export default model;
