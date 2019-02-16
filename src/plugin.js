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
          buttons: [{text: s.t(l, "buttonOk"), onClick: 'close'}],
          width: 425,
          height: 250,
          layout: 'flex',
          body: [
            {
              type : 'listbox',
              name : 'categories',
              label : s.t(l, "labelSelectCategory"),
              onselect: function(e) {
                let selectedSection = this.$el[0].innerText
                sentimony.showReport(selectedSection, globalData)
              },
              values : [
                {text: s.t(l, "labelOverview"), value: s.t(l, "labelOverview"), selected: true},
                {text: s.t(l, "labelDetail"), value: s.t(l, "labelDetail")}
              ]
            },
            {
              type: 'container',
              html: '<hr style="border-bottom:1px inset;">'
            },
            {
              type: 'container',
              id: 'sentimony-report',
              role: 'region',
              html: sentimony.showReport(s.t(l, "labelOverview"), globalData),
              onPostRender: function(){
                this.getEl().setAttribute("aria-live", "polite")
              }
            }
          ]
        },)
      }
    }, 0)
  })

  editor.on('Change', function(e) {
    sentiment.analyze(editor.getContent({format:'text'}), {}, function(i,data) {
      globalData = data
      globalData.tokens = globalData.tokens.filter(n => n)
      sentimony.setComparativeSentiment(globalData, emotions)
    })
  })

  return {
    getMetadata: function() {
      return  {
        name: s.t(l, "title"),
        url: "https://github.com/thedannywahl/sentimony/",
        author: "Danny Wahl",
        version: "1.0.0"
      }
    }
  }
}

export default plugin
