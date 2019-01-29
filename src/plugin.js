import _ from 'lodash'
import Sentiment from 'sentiment'
let sentiment = new Sentiment()

const plugin = editor => {
  let globalData = {}
  let sentimentModal = {
    title: 'Sentimony',
    body: [
      {
        type: 'container',
        layout: 'flow',
        items: [
          {
            type: 'label',
            text: showAnalysis(globalData)
          }
        ]
      }
    ]
  }

  let sentimentStatusbar = {
    type: 'label',
    name: 'sentimony',
    html: '<a id="emotion" href="#" role="img" aria-label="" hidden></a>',
    classes: 'sentimony',
    disabled: editor.settings.readonly,
    onclick: function() {
      editor.windowManager.open(sentimentModal)
    }
  }

  editor.on('init', function() {
    tinymce.DOM.loadCSS('./src/plugin.css')
    let statusbar =
      editor.theme.panel && editor.theme.panel.find('#statusbar')[0]
    if (statusbar) statusbar.insert(sentimentStatusbar,0)
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
        url: "https://github.com/thedannywahl/sentimony/"
      }
    }
  }
}


function setComparativeEmotion(comparative) {
  let emotion = document.getElementById("emotion")
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

function showAnalysis(data) {
  return `score: ${data.score}`;
}

export default plugin
