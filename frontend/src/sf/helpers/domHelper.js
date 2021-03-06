import is from 'next-is';
import ReactScroll, { animateScroll } from 'react-scroll';
import noop from 'no-op';
import { CHANGES_NOT_SAVED } from 'sf/l10n';

export function addEventListener(node, eventName, fn) {
  if (node.addEventListener) {
    node.addEventListener(eventName, fn, false);
  } else {
    node.attachEvent(`on${eventName}`, fn);
  }
}

export function removeEventListener(node, eventName, fn) {
  if (node.removeEventListener) {
    node.removeEventListener(eventName, fn, false);
  } else {
    node.detachEvent(`on${eventName}`, fn);
  }
}

export function getWindowWidth() {
  return is.browser() ?
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    : null;
}

export function getWindowHeight() {
  return is.browser() ?
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    : null;
}

export function getOffset(domElement) {
  const rect = domElement
    ? domElement.getBoundingClientRect()
    : { top: 0, left: 0 };

  return {
    top: rect.top + Math.max(
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0,
    ),
    left: rect.left + Math.max(
      window.pageXOffset ||
      document.documentElement.scrollLeft ||
      document.body.scrollLeft ||
      0,
    ),
  };
}

export function scrollTo(nodeOrPosition, duration = 250, offset = 0) {
  return new Promise((resolve, reject) => {
    // sample usage:
    //   scrollTo(domNode, 500) // scrolls to domNode element top line
    //   scrollTo([domNode1, domNode2, domNode3], 500) // scrolls to highest domNode in document
    //   scrollTo(123, 500) // scrolls to 123px
    let scrollPosition;
    if (!nodeOrPosition && nodeOrPosition !== 0) return reject();
    if (is.isNumber(nodeOrPosition)) {
      scrollPosition = nodeOrPosition;
    } else if (is.isArray(nodeOrPosition)) {
      let firstDOMElement;
      let firstDOMElementPostition;
      nodeOrPosition.forEach((DOMElement) => {
        // find the first error occourence in the document.
        const DOMElementPostion = DOMElement.getBoundingClientRect().top;
        if (!firstDOMElement || DOMElementPostion < firstDOMElementPostition) {
          firstDOMElement = DOMElement;
          firstDOMElementPostition = DOMElementPostion;
        }
      });
      scrollPosition = getOffset(firstDOMElement).top;
    } else {
      scrollPosition = getOffset(nodeOrPosition).top;
    }

    animateScroll.scrollTo(Math.max(scrollPosition - 10 + offset, 0), {
      duration: duration,
      delay: 60,
      smooth: true,
    });

    const ReactScrollEvents = ReactScroll.Events;
    ReactScrollEvents.scrollEvent.register('end', () => {
      resolve();
    });
  });
}

export function dispatchEvent(target, name, type = 'HTMLEvents') {
  const event = document.createEvent(type);
  event.initEvent(name, true, true);
  target.dispatchEvent(event);
}

export function createCustomEvent(name) {
  // HACK: using document.createEvent and CustomEvent::initCustomEvent() for IE11 support
  let event;
  if (document.createEvent) {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, false, false, null);
  } else {
    event = new CustomEvent(name);
  }
  return event;
}

export const createAnchorName = (name) => (name || '')
  .toLowerCase()
  .replace(/\W+/g, ' ')
  .trim()
  .split(' ')
  .slice(0, 7)
  .join('-');


export const createAndClickAnchor = (anchor) => {
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
  }, 100);
};

let onFullRenderPromise = false;
export const onFullRender = () => {
  // it waits until the document is fully rendered (with styles) and then executes
  // the function supplied as an argument eg:
  //   onFullRender().then(() => scrollTo(someNode));
  // which normally would fail, because on componentDidMount the offset of the
  // node would most likely be equal to zero (which it probably isn't)
  if (!onFullRenderPromise) {
    onFullRenderPromise = new Promise((resolve) => {
      const interval = setInterval(() => {
        if (document.readyState !== 'complete') return;
        clearInterval(interval);
        resolve();
      }, 100);
    });
  }
  return onFullRenderPromise;
};

export const setCaretPosition = (el, caretPos) => {
  // https://stackoverflow.com/questions/512528/set-keyboard-caret-position-in-html-textbox
  el.value = el.value;
  // ^ this is used to not only get "focus", but
  // to make sure we don't have it everything -selected-
  // (it causes an issue in chrome, and having it doesn't hurt any other browser)

  if (el === null) return false;
  if (el.createTextRange) {
    const range = el.createTextRange();
    range.move('character', caretPos);
    range.select();
  } else if (el.selectionStart || el.selectionStart === 0) {
    // (el.selectionStart === 0 added for Firefox bug)
    el.focus();
    el.setSelectionRange(caretPos, caretPos);
  } else { // fail city, fortunately this never happens (as far as I've tested) :)
    el.focus();
  }
};

export const getSetHashFunc = (title) => () => {
  location.hash = `${createAnchorName(title)}`;
};

export const getScrollToSectionFunc = (hashOrTitle) => (e) => {
  if (e) e.preventDefault();
  const hash = hashOrTitle[0] === '#' ? hashOrTitle.slice(1) : createAnchorName(hashOrTitle);
  const element = document.querySelector(`[name="${hash}"]`);
  if (element) {
    scrollTo(element, 250);
    setTimeout(getSetHashFunc(hash), 250);
  }
};

export const toggleFullScreen = (isOn = true) => {
  const doc = window.document;
  const docEl = doc.documentElement;
  /* eslint-disable max-len */
  const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen || noop;
  const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen || noop;
  const isFullScreenMode = doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement;
  /* eslint-enable max-len */

  try {
    if (isOn && !isFullScreenMode) {
      requestFullScreen.call(docEl);
    } else if (!isOn && isFullScreenMode) {
      cancelFullScreen.call(doc);
    }
  } catch (e) { /* noop */ }
};

const focusableElementSelectors = [
  'a',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabIndex]:not([disabled])',
];

export const findFirstActiveElement = (parentNode) => {
  if (!parentNode) return;
  return parentNode.querySelector(focusableElementSelectors.join(','));
};

/**
 * takeControlOverWindow disables all interactions with DOM elements outside rootNode.
 * It's useful when creating dialogs or full-screen elements, where user should not be
 * able to navigate through elements underneath.
 *
 * @param  {DOMNode} rootNode      required
 * @param  {DOMNode} activeElement
 * @return {Object}               { remove: () => ... }
 */
export const takeControlOverWindow = (
  rootNode,
  activeElement = findFirstActiveElement(rootNode)
) => {
  const activeElementBefore = document.activeElement;
  const temporaryFocusableElement = document.createElement('button');
  const focusableElements = Array.from(
    document.querySelectorAll(focusableElementSelectors.join(',')) || []
  )
    // filter is required for situation when other component took control before.
    // Possible scenario: fullScreen camera component inside a dialog.
    .filter((focusableElement) => !('controlTakenLastTabIndex' in focusableElement.dataset));

  if (activeElement) {
    if (activeElement.disabled) {
      // when element to focus is disabled, then browser returns focus to previously
      // selected element, even if tabIndex is -1. This can trigger software keyboard and
      // annoy frontend developer.
      document.body.appendChild(temporaryFocusableElement);
      temporaryFocusableElement.style.visibility = 'hidden';
      temporaryFocusableElement.style.position = 'absolute';
      temporaryFocusableElement.focus();
    } else {
      activeElement.focus();
    }
  }

  focusableElements.forEach((focusableElement) => {
    const tabIndex = focusableElement.tabIndex;
    if (tabIndex !== -1 && !rootNode.contains(focusableElement)) {
      focusableElement.dataset.controlTakenLastTabIndex = tabIndex;
      focusableElement.tabIndex = -1;
    }
  });

  return {
    remove: () => {
      temporaryFocusableElement.remove();
      focusableElements.forEach((focusableElement) => {
        if ('controlTakenLastTabIndex' in focusableElement.dataset) {
          focusableElement.tabIndex = focusableElement.dataset.controlTakenLastTabIndex;
          try {
            delete focusableElement.dataset.controlTakenLastTabIndex;
          } catch (e) {
            // Say hello to Safari
            focusableElement.removeAttribute('data-control-taken-last-tab-index');
          }
        }
      });
      if (activeElementBefore) activeElementBefore.focus();
    }
  };
};

export const isInViewPort = (node) => {
  if (!node || !node.getBoundingClientRect) return false;
  const { bottom, left, right, top } = node.getBoundingClientRect();
  return bottom >= 0 &&
    top <= getWindowHeight() &&
    right >= 0 &&
    left <= getWindowWidth();
};

const getScriptCache = {};
export const getScript = (source, cache = false) => {
  if (!cache || !getScriptCache[source]) {
    getScriptCache[source] = new Promise((resolve, reject) => {
      let script = document.createElement('script');
      const prior = document.getElementsByTagName('script')[0];
      script.async = 1;
      const cb = (_, isAbort) => {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
          script.onload = null;
          script.onreadystatechange = null;
          script = undefined;

          if (isAbort) {
            reject();
          } else {
            resolve();
          }
        }
      };

      script.onload = cb;
      script.onreadystatechange = cb;

      script.src = source;
      prior.parentNode.insertBefore(script, prior);
    });
  }

  return getScriptCache[source];
};

const isInputSupported = (inputType, invalidInputValue) => {
  if (!is.browser()) return;

  const input = document.createElement('input');
  input.setAttribute('type', inputType);
  input.setAttribute('value', invalidInputValue);
  const result = input.value !== invalidInputValue;
  input.remove();

  return result;
};

export const isColorInputSupported = () => isInputSupported('color', 'test');

/**
 * Get real pixel ratio. Page zoom is included in calculation of real pixel ratio,
 * so it's valid solution for desktops.
 *
 * @return {Object}
 */
export const getPixelRatio = () => {
  const STEP = 0.05;
  const MAX = 5;
  const MIN = 0.5;
  const mediaQuery = (v) => `(-webkit-min-device-pixel-ratio: ${v}),
  (min--moz-device-pixel-ratio: ${v}),
  (min-resolution: ${v}dppx)`;

  // * 100 is added to each constants because of JS's float handling and
  // numbers such as `4.9-0.05 = 4.8500000000000005`
  let maximumMatchingSize;
  for (let i = MAX * 100; i >= MIN * 100; i -= STEP * 100) {
    if (window.matchMedia(mediaQuery(i / 100)).matches) {
      maximumMatchingSize = i / 100;
      break;
    }
  }

  return {
    isZoomed: window.devicePixelRatio !== maximumMatchingSize,
    devicePixelRatio: window.devicePixelRatio || 1,
    realPixelRatio: Math.max(maximumMatchingSize, window.devicePixelRatio, 1),
  };
};

/**
 * blockPageInTransition: while transition like navigation between pages
 * or fullScreen element is closed, user might unintentionally trigger some action
 * by double-tapping instead of single tapping.
 * This function is about to fix the issue
 *
 * @param  {Number} timeMs How long overlay should least
 */
export const blockPageInTransition = (timeMs = 500) => {
  if (!is.browser()) return;

  const element = document.createElement('div');
  element.style.position = 'fixed';
  element.style.top = 0;
  element.style.left = 0;
  element.style.width = '100%';
  element.style.height = '100%';
  element.style.zIndex = 2147483647;
  document.body.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, timeMs);
};

const handleBeforeunload = (e) => {
  e.preventDefault();
  e.returnValue = CHANGES_NOT_SAVED;
  return e.returnValue;
};

let isPageUnloadLocked = false;
export const lockPageUnload = () => {
  if (isPageUnloadLocked) return;

  isPageUnloadLocked = true;
  window.addEventListener('beforeunload', handleBeforeunload);
};

export const unlockPageUnload = () => {
  if (!isPageUnloadLocked) return;

  isPageUnloadLocked = false;
  window.removeEventListener('beforeunload', handleBeforeunload);
};

export const getCSSVariable = (variableName) => {
  if (!is.isString(variableName) || variableName.substr(0, 2) !== '--') {
    throw new Error('CSS variable name must start with "--"');
  }
  if (is.browser()) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }
  return '';
};
