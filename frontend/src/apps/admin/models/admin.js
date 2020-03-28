import atom from 'atom-js';
import is from 'next-is';
import _omit from 'lodash/omit';
import { generateToken } from 'sf/helpers';
import {
  post,
  asyncExtendedRequestEnd,
} from 'sf/helpers/request';

import store from 'sf/helpers/store';

const modelName = 'adminModel';
const model = atom.setup({
  // prevent fields to be stored in the model and localstorage
  // for ex. of security reasons
  onChange: () => {
    if (model) {
      store.set(modelName, _omit(
        model.get(),
        [
          'password',
        ]
      ));
    }
  },
  validation: {
    isSignedIn: {
      'You must be signed in': is.isBoolean,
    },
    username: {
      string: is.isString,
    },
    current_password: {
      'Please provide current password': (input) => !!input,
      // NOTE: More complex password validation is performed on a backend side
    },
  },
  methods: {
    logIn: (resolve, reject, username, password) => {
      post('backend/agent/login/')
        .send({
          username,
          password
        })
        .end(async (_err, _res) => {
          const { data, err, error_code, res } = await asyncExtendedRequestEnd(_err, _res);

          model.setExpirationTime(res);

          if (err) {
            return reject(error_code || err);
          }

          const { token, role } = data;
          model.set({
            'isSignedIn': true,
            'username': username,
            'role': role,
            'token': token,
          });
          resolve();
        });
    },
    logOut(resolve) {
      post('/backend/agent/logout/')
        .set('Authorization', `Token ${model.get('token')}`)
        .end(() => {
          model.clear().then(() => {
            model
              .set({
                isSignedIn: false,
                token: generateToken(TOKEN_LENGTH),
              })
              .then(() => {
                resolve();
              });
          });
        });
    },
    changePassword: (resolve, reject, {
      password_old,
      password_new,
      password_new_repeat
    }) => {
      post('backend/agent/change_password/')
        .set('Authorization', `Token ${model.get('token')}`)
        .send({
          password_old,
          password_new,
          password_new_repeat
        })
        .end(async (_err, _res) => {
          const { err, res, data } = await asyncExtendedRequestEnd(_err, _res);
          model.setExpirationTime(res);

          if (err) {
            if (res && res.statusCode === 401) {
              model.logOut();
            }
            reject(res);
          } else {
            resolve(data);
          }
        });
    },

  },
})(store.get(modelName) || {});

export default model;
