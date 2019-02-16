declare const tinymce: any;

const setup = (editor, url) => {
  editor.addButton('sentimony', {
    text: 'sentimony button',
    icon: false,
    onclick: () => {
      // tslint:disable-next-line:no-console
      editor.setContent('<p>content added from sentimony</p>');
    }
  });
};

tinymce.PluginManager.add('sentimony', setup);

// tslint:disable-next-line:no-empty
export default () => {};
