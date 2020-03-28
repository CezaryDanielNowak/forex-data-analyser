import atom from 'atom-js';
import { get, errorHandler } from 'sf/helpers/request';

const model = atom({
  captchaUrl: 'backend/contactus/',
  language: 'en',
  showLoading: true,
});

model.provide('sitekey', (done) => {
  const endOptions = { disableMediator: !model.get('showLoading') };

  get(model.get('captchaUrl'))
    .end((err, res) => {
      if (err) {
        return errorHandler(err, res);
      }

      done(res.body.data.recaptcha_sitekey);
    }, endOptions);
});

model.resetCaptcha = () => {
  if (global.grecaptcha) {
    global.grecaptcha.reset();
  }
};

export default model;
