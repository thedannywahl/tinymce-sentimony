import _ from 'lodash'
import Sentiment from 'sentiment'
let sentiment = new Sentiment()
import emotions from './modules/emotions.json'

const plugin = editor => {
  let globalData = {}
  let sentimonyUI = {
    type: 'label',
    name: 'sentimony',
    html: '<a id="sentimony-emotion" href="#" role="img" aria-label="" hidden></a>',
    classes: 'sentimony',
    disabled: editor.settings.readonly,
    onclick: function() {
      editor.windowManager.open({
        title: 'Sentimony',
        buttons: [
          {
            text: 'OK',
            onClick: 'close'
          }
        ],
        body: [
          {
            type : 'listbox',
            name : 'categories',
            label : 'Select a category',
            onselect: function(e) {
              let selectedSection = this.$el[0].innerText
              showReport(selectedSection, globalData)
            },
            values : [
              { text: 'Overview', value: 'overview', selected: true },
              { text: 'Score', value: 'Score'}
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
                text: showReport("Overview", globalData)
              }
            ]
          }
        ]
      })
    }
  }

  editor.on('init', function() {
    tinymce.DOM.loadCSS('./src/plugin.css')
    let statusbar =
      editor.theme.panel && editor.theme.panel.find('#statusbar')[0]
    if (statusbar) statusbar.insert(sentimonyUI, 0)
  })

  editor.on('Change', function(e) {
    sentiment.analyze(editor.getContent({ format:'text'}),{},function(i,data) {
      globalData = data
      console.log('sentiment:', globalData)
      setComparativeEmotion(globalData, emotions)
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

function setComparativeEmotion(data, emotions) {

  let emotion = document.getElementById("sentimony-emotion")
  if (data.comparative > 0) {
    emotion.setAttribute("aria-label", emotions.joy.moderately.name)
    emotion.innerHTML = emotions.joy.moderately.html
    emotion.hidden = false
  } else if (data.comparative < 0) {
    emotion.setAttribute("aria-label", emotions.sadness.moderately.name)
    emotion.innerHTML = emotions.sadness.moderately.html
    emotion.hidden = false
  } else if ((data.comparative == 0) && (data.tokens.length > 2)) {
    emotion.setAttribute("aria-label", emotions.neutral.moderately.name)
    emotion.innerHTML = emotions.neutral.moderately.html
    emotion.hidden = false
  } else { // data.comparative == 0  && data.tokens.length <=2 ["",""]
    emotion.setAttribute("aria-label", "")
    emotion.innerHTML = ''
    emotion.hidden = true
  }
}

function showReport(section, data) {
  let reportBody = document.getElementById("sentimony-report-body")
  let report = "This is the overview"
  if (reportBody) {
    if (section == "Score") {
      report = `Score: ${data.score}`
    }
    reportBody.innerHTML = report
  } else {
    return report
  }
}

export default plugin
