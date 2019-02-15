import _ from 'lodash'
import Sentiment from 'sentiment'
let sentiment = new Sentiment()
import emotions from './modules/emotions'
import Sentimony from './modules/sentimony'
let sentimony = new Sentimony()
import Langs from './langs/sentimony'
let s = new Langs()
let l = tinymce.util.I18n.getCode()
let globalData = {}

const plugin = editor => {
  if(l == "en") {
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
            title: s.t(l, "title"),
            buttons: [{text: s.t(l, "ok"), onClick: 'close'}],
            width: 425,
            height: 250,
            layout: 'flex',
            body: [
              {
                type : 'listbox',
                name : 'categories',
                label : s.t(l, "selectCategory"),
                onselect: function(e) {
                  let selectedSection = this.$el[0].innerText
                  sentimony.showReport(selectedSection, globalData)
                },
                values : [
                  {text: s.t(l, "overview"), value: s.t(l, "overview"), selected: true},
                  {text: s.t(l, "score"), value: s.t(l, "score")}
                ]
              },
              {
                type: 'container',
                html: '<hr style="border-bottom:1px inset;">'
              },
              {
                type: 'container',
                id: 'sentimony-report',
                html: sentimony.showReport(s.t(l, "overview"), globalData),
              }
            ]
          },)
        }
      }, 0)
    })

    editor.on('Change', function(e) {
      sentiment.analyze(editor.getContent({format:'text'}), {}, function(i,data) {
        globalData = data
        sentimony.setComparativeEmotion(globalData, emotions)
        console.log(globalData)
      })
    })

    return {
      getMetadata: function() {
        return  {
          name: s.t(l, "title"),
          url: "https://github.com/thedannywahl/sentimony/",
          author: "Danny Wahl",
          version: "0.1"
        }
      }
    }
  }
}

export default plugin
