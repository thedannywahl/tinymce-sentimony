# sentimony TinyMCE Plugin

![sentimony](/sentimony.png?raw=true)

Welcome stranger! This is a repo containing the sentimony TinyMCE plugin.

## Test it out

[demo](https://iyware.com/sentimony)

## The development server

By running the `npm start` command you start the development server and open a browser window with an instance of TinyMCE with your plugin added to it. This window will reload automatically whenever a change is detected in the `index.html` file in the `static` folder or in one of the JavaScript files in the `src` directory.

## The production build

By running the `npm run build` command Webpack will create a `dist` directory with a child directory with the name of your plugin (sentimony) containing three files:

* `plugin.js` - the bundled plugin
* `plugin.min.js` - the bundles, uglified and minified plugin
* `LICENSE` - a file explaining the license of your plugin (copied over from `src/LICENSE`)

## Just download it

Visit the [releases](https://www.google.com) page.


## Using Sentimony

```tinymce.init({
  selector:'textarea',
  plugins: 'sentimony'
});```
