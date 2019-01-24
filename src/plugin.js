import _ from 'lodash';
import Sentiment from 'sentiment';
var sentiment = new Sentiment();

const plugin = editor => {
  editor.on('init', function() {
    tinymce.DOM.loadCSS('./src/plugin.css');
    let statusbar =
      editor.theme.panel && editor.theme.panel.find('#statusbar')[0];
    if (statusbar) {
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
                      text: showAnalysis()
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
      console.log('sentiment', data)
      editor.theme.panel
        .find('#sentimony')[0]
        .innerHtml(`<a id="emotion" href="#">${getComparativeEmotion(data.comparative)}</a>`)
    });
  });

  return {
    getMetadata: function () {
      return  {
        name: "Sentimony",
        url: "https://github.com/thedannywahl/sentimony/"
      }
    }
  }
};

function getComparativeEmotion(comparative) {
  if (comparative > 0) return '😀';
  if (comparative < 0) return '😟'
  return '';
}

function showAnalysis() {
  return "blah blah blah";
}


export default plugin;
