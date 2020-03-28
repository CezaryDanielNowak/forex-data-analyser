import { sentryLog, sleep } from 'sf/helpers';
import { unlockPageUnload } from 'sf/helpers/domHelper';
import { UNEXPECTED_ERROR_TITLE, UNEXPECTED_ERROR_CONTENT } from 'sf/l10n';

export const getBlobFromURL = (blobURL) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', blobURL, true);
    xhr.responseType = 'blob';
    xhr.onerror = reject;
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response);
      }
    };
    xhr.send();
  });
};

/**
 * Takes encoded image, and returns format acceptable by superagent.attach
 *
 * @param  {string} dataURI or blob URL
 * @return {Promise(Object)}          sample: { data: [object Blob], extension: 'png' }
 */
export const dataURItoImage = async (dataURI, retry = 0) => {
  if (dataURI.substr(0, 5) === 'blob:') {
    let blob;
    try {
      blob = await getBlobFromURL(dataURI);
    } catch (e) {
      if (retry < 1) {
        await sleep(1000); // one retry attempt
        return dataURItoImage(dataURI, retry + 1);
      }

      /**
       * This error might happen in case of a full memory. Page reload should fix the problem,
       * at least temporarily.
       */
      sentryLog(new Error('Can\'t reach BLOB in dataURItoImage'), e);

      // eslint-disable-next-line no-alert
      alert(`${UNEXPECTED_ERROR_TITLE}. ${UNEXPECTED_ERROR_CONTENT}.`);

      unlockPageUnload();
      window.location.reload();
      return {};
    }

    const ext = /^image\/(.*)/.exec(blob.type);
    if (!ext) {
      sentryLog(`"${blob.type}" is not valid type for dataURItoImage`);
    }

    return {
      data: blob,
      extension: ext && ext[1],
    };
  }

  const dataURLtoBlob = require('blueimp-canvas-to-blob');
  const extension = /^data:image\/(.*);/.exec(dataURI); // hopefully data is correct.
  if (!extension) {
    sentryLog(`"Invalid dataURI provided to: ${dataURI && dataURI.substr(0, 30)}...`);
  }

  return {
    data: dataURLtoBlob(dataURI),
    extension: extension && extension[1],
  };
};

export const imageToCanvas = (image, canvas = document.createElement('canvas')) => {
  canvas.height = image.height;
  canvas.width = image.width;
  canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

  return canvas;
};

/**
 * This function creates an image from a URL, canvas or dataURI.
 * It's also the easiest way to put image on canvas, when
 * image is loaded.
 *
 * @param  {string or Canvas} input
 * @param  {Canvas element} canvasRef (optional)
 * @param  {bool} allowBlob (optional) allowBlob. Disable it
 *                          if you need shareable image.
 * @return {Promise}
 */
export const getImage = (input, canvasRef, allowBlob = true) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let cleanup = () => {};

    img.onload = () => {
      if (canvasRef) {
        imageToCanvas(img, canvasRef);
      }

      resolve(img);
      cleanup();
    };
    img.onerror = reject;

    if (typeof input === 'string') {
      // Data URI or URL
      img.src = input;
    } else if (input instanceof HTMLCanvasElement) {
      if (allowBlob && input.toBlob) {
        // every browser but Edge
        input.toBlob((blob) => {
          cleanup = () => URL.revokeObjectURL(img.src);
          img.src = URL.createObjectURL(blob);
        }, 'image/png');
      } else {
        img.src = input.toDataURL('image/png');
      }
    } else if (input instanceof Image) {
      img.src = input.src;
    } else {
      throw new Error('Input passed to getImage is not string or canvas.');
    }
  });
};

/**
 * getCanvas converts input to canvas.
 * It accepts Image, data URI and image URL
 *
 * @param  {Image or string} input
 * @return {Promise}
 */
export const getCanvas = (input) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');

    if (input instanceof Image) {
      return resolve(imageToCanvas(input));
    }

    getImage(input, canvas)
      .then(() => {
        resolve(canvas);
      })
      .catch(reject);
  });
};

/**
 * logImage logs image to console.
 * This function was created because 'console-image' npm module prints image twice.
 *
 * As it consumes memory, that we need on low-end devices, this function is enabled
 * only on LOCAL and DEV.
 *
 * examples:
 *    logImage(img); // img = new Image();
 *    logImage('data:image/gif;base64,R0lGODlhyAAiALM...DfD0QAADs');
 *    logImage(canvas); // canvas = document.createElement('canvas');
 *
 * @param  {...mixed} images Canvas, Image, blob URL or URI
 */
export const logImage = (...images) => {
  if (ENV === 'local') {
    images.forEach((imgSrc) => {
      // NOTE: It's impossible to log blob in a console. Convert blob to canvas first.
      if (
        typeof imgSrc === 'string' && imgSrc.substr(0, 5) === 'blob:'
        || imgSrc instanceof Image && imgSrc.src.substr(0, 5) === 'blob:'
      ) {
        return getCanvas(imgSrc).then(logImage);
      }

      getImage(imgSrc, null, false)
        .then((img) => {
          const { width, height, src } = img;
          // eslint-disable-next-line no-console
          console.log(
            '%c+',
            `font-size: 0;
padding: ${Math.ceil(height / 2)}px ${Math.ceil(width / 2)}px;
line-height: 0;
background: url(${src.replace(/\(/g, '%28').replace(/\)/g, '%29')});
background-size: ${width}px ${height}px;
color: transparent;
background-repeat: no-repeat;`
          );
        });
    });
  }
};
