import _ from 'lodash';
import Sentiment from 'sentiment';
var sentiment = new Sentiment();

const plugin = editor => {
  editor.on('init', function() {
    tinymce.DOM.loadCSS('./plugin.css');
    let statusbar =
      editor.theme.panel && editor.theme.panel.find('#statusbar')[0];
    if (statusbar) {
      console.log('statusbar', statusbar);
      statusbar.insert(
        {
          type: 'label',
          name: 'sentimony',
          html: '<a id="emotion" href="#"></a>',
          classes: 'sentimony',
          disabled: editor.settings.readonly,
          onclick: function() {
            editor.windowManager.open({
              title: 'Sentimony',
              body: [
                {
                  type: 'container',
                  layout: 'flow',
                  items: [
                    {
                      type: 'label',
                      text: 'blah blah blah'
                    }
                  ]
                }
              ]
            });
          }
        },
        0
      );
    }
  });

  editor.on('Change', function(e) {
    sentiment.analyze(editor.getContent({ format: 'raw' }), {}, function(
      i,
      data
    ) {
      console.log('sentiment', data);
      let emotion = '';
      if (data.comparative > 0) emotion = '😀';
      if (data.comparative < 0) emotion = '😟';

      editor.theme.panel
        .find('#sentimony')[0]
        .innerHtml(`<a id="emotion" href="#">${emotion}</a>`);
    });
  });
};

export default plugin;
