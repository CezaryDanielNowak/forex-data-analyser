

## Installation
- install `git`
- [install `NodeJS LTS 10`](https://nodejs.org/en/download/package-manager/)
- [Install `Yarn`](https://yarnpkg.com/lang/en/docs/install/)
- Install global nodejs dependencies (sudo):
```
npm install -g node-gyp
npm install -g gulp-cli
```
- Init shared-frontend submodule:
```
git submodule update --init
```
- Install local dependencies (no-sudo):
```
make install
```

## Installation Check
```
git --version // any
node --version // LTS 10
yarn --version // any
yarn list --check-files // no errors
```

## Commands
Available commands with switches should be called as in example:
`make build ENV=dev BRAND=syf PORT=3003`

### $ `make start`
File serving + building SCSS, babel etc. Local use only!

### $ `make build`
Build website into `dist/` directory.  css, js files are combined and compressed.

### $ `make server`
Server is started. No watch/rebuild is performed.


## Commands - Switches
`--env=`: `prod`, `dev`, `staging` or `local` (default)
`--brand=`: `default`


#### Automated component creation:
to add new component:
$ `make init-component`

to add new page:
$ `make init-page`

## File structure
```
assets: files to be copied into dist without any changes.
dist: temporary directory with computed files.
gulp-tasks: filed used by gulp task runner.
src: source files
src/layout/*: React components with page layouts.
src/components/{CompnentName}: All components used in the app.
                               Any component-related file can be stored in
                               Component directory:
                               scss, images, React components etc
src/pages/{PageName}: Pages definitions for router

----

app.js: here application starts
app.scss: main entry for scss. Include all dependencies in this file.
config.js: main config file
routes.js: all routes used in application, handled by react-router
```

## Server-side rendering
Server-side rendering is working when `server` or `start` task is running.
Please references to `window` or `document` only in `componentDidMount`. Global object in webpack is called `global`, feel free to use it instead of `window`.

## Configs
There are two config files:
- `frontend/config.js` (for server anside)
Which can be extended by local config if needed:
- `frontend/config.local.js`

# Architecture:
Our architecture is based on three major areas:
- (M) atom.js + superagent for models and data handling
- (V) React for views and UI interactions.
- (C) react-router for routing and server-side rendering.

# Styles
We are using BEM in following convention
```css
/* React component */
.ts-SomeComponent

/* React component with modifier */
.ts-SomeComponent--ultra-wide

/* Element in component */
.ts-SomeComponent__element

/* Element with modifier */
.ts-SomeComponent__element--blue

/* element, that is not a part of React component (lower case, not recommended but easy to use for frequently used classNames like ts-container or ts-or) */
.ts-some-element__button--modifier
```

## Styles in React components:
```js
class Xyz extends BaseComponent {
  className = "ts-Xyz";

  render() {
    return <div className={...}>
  }
}

/* className: */
this.cn('some-classname')  // "ts-Xyz some-classname"

this.cn('--some-modifier') // "ts-Xyz ts-Xyz--some-modifier"

this.cn('__element')       // "ts-Xyz ts-Xyz__element"

this.cn`__element`       // "ts-Xyz ts-Xyz__element"

this.cn({
  '__element': true,
  '--modifier': true,
  'bootstrap-class': true
})                         // "ts-Xyz ts-Xyz__element ts-Xyz--modifier bootstrap-class"

```

## Mandatory fields in input elements:
- setValid(true|false|null, [invalidMessage])
- stateLink prop

## Mediator events:
- XHR(xhrCount: number)
- error(message: string)
- warning(message: string)
- info(message: string)
- success(message: string)
- GlobalLoader--toggle
- showFloatingText
