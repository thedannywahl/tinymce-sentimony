import _ from 'lodash'
import Sentiment from 'sentiment'
let sentiment = new Sentiment()
import emotions from './modules/emotions.json'
import Sentimony from './modules/sentimony'
let sentimony = new Sentimony()
import strs from './langs/sentimony.json'
let lang = tinymce.util.I18n.getCode()
function s(st) {
  return strs[lang][st]
}
let globalData = {}

const plugin = editor => {
  if(lang == "en") {
    tinymce.DOM.loadCSS('./src/plugin.css')

    editor.on('init', function() {
      let statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0]
      if (statusbar) statusbar.insert({
        type: 'label',
        name: 'sentimony',
        html: '<a id="sentimony-emotion" href="#" role="img" aria-label="" hidden></a>',
        classes: 'sentimony',
        disabled: editor.settings.readonly,
        onclick: function() {
          editor.windowManager.open({
            title: s("title"),
            buttons: [{text: s("ok"), onClick: 'close'}],
            body: [
              {
                type : 'listbox',
                name : 'categories',
                label : s("select a category"),
                onselect: function(e) {
                  let selectedSection = this.$el[0].innerText
                  sentimony.showReport(selectedSection, globalData)
                },
                values : [
                  {text: s("overview"), value: s("overview"), selected: true},
                  {text: s("score"), value: s("score")}
                ]
              },
              {
                type: 'container',
                html: '<hr style="border-bottom:1px inset;">'
              },
              {
                type: 'container',
                layout: 'flow',
                minWidth: 400,
                minHeight: 160,
                id: 'sentimony-report',
                items: [
                  {
                    type: 'label',
                    html: sentimony.showReport(s("overview"), globalData)
                  }
                ]
              }
            ]
          })
        }
      }, 0)
    })

    editor.on('Change', function(e) {
      sentiment.analyze(editor.getContent({format:'text'}), {}, function(i,data) {
        globalData = data
        sentimony.setComparativeEmotion(globalData, emotions)
      })
    })

    return {
      getMetadata: function() {
        return  {
          name: s("title"),
          url: "https://github.com/thedannywahl/sentimony/",
          author: "Danny Wahl",
          version: "0.1"
        }
      }
    }
  }
}

export default plugin
