import _ from 'lodash'
import Sentiment from 'sentiment'
let sentiment = new Sentiment()
// tinymce.PluginManager.requireLangPack('sentimony', 'en_US')

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
    sentiment.analyze(editor.getContent({ format:'raw'}),{},function(i,data) {
      globalData = data
      console.log('sentiment:', globalData)
      setComparativeEmotion(globalData.comparative)
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

function setComparativeEmotion(comparative) {
  let emotion = document.getElementById("sentimony-emotion")
  if (comparative > 0) {
    emotion.setAttribute("aria-label", "Grinning Face")
    emotion.innerHTML = '&#x1F600;' //😀
    emotion.hidden = false
  }
  if (comparative < 0) {
    emotion.setAttribute("aria-label", "Slightly Frowning Face")
    emotion.innerHTML = '&#x1f641;' //🙁
    emotion.hidden = false
  }
  if (comparative == 0) {
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
    return report // Initial view of report window
  }
}

export default plugin
