import _ from 'lodash'
import Sentiment from 'sentiment'
let sentiment = new Sentiment()
import emotions from './modules/emotions.json'
import Sentimony from './modules/sentimony'
let sentimony = new Sentimony()
let globalData = {}

const plugin = editor => {
  editor.on('init', function() {
    tinymce.DOM.loadCSS('./src/plugin.css')
    let statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0]
    if (statusbar) statusbar.insert({
      type: 'label',
      name: 'sentimony',
      html: '<a id="sentimony-emotion" href="#" role="img" aria-label="" hidden></a>',
      classes: 'sentimony',
      disabled: editor.settings.readonly,
      onclick: function() {
        editor.windowManager.open({
          title: 'Sentimony',
          buttons: [{text: 'OK', onClick: 'close'}],
          body: [
            {
              type : 'listbox',
              name : 'categories',
              label : 'Select a category',
              onselect: function(e) {
                let selectedSection = this.$el[0].innerText
                sentimony.showReport(selectedSection, globalData)
              },
              values : [
                {text: 'Overview', value: 'overview', selected: true},
                {text: 'Score', value: 'Score'}
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
                  html: sentimony.showReport("Overview", globalData)
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
        name: "Sentimony",
        url: "https://github.com/thedannywahl/sentimony/",
        author: "Danny Wahl",
        version: "0.1"
      }
    }
  }
}

export default plugin
