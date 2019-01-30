import _ from 'lodash'
import Sentiment from 'sentiment'
let sentiment = new Sentiment()

const plugin = editor => {
  let globalData = {}

  let emotions = {
    "neutral": {
      "slightly": {
        "scale": "",
        "name": "Face without Mouth",
        "html": "&#x1F636;",
        "emoji": "😶",
        "expression": "neutral"
      },
      "somewhat": {
        "scale": "",
        "name": "Face without Mouth",
        "html": "&#x1F636;",
        "emoji": "😶",
        "expression": "neutral"
      },
      "moderately": {
        "scale": "",
        "name": "Face without Mouth",
        "html": "&#x1F636;",
        "emoji": "😶",
        "expression": "neutral"
      },
      "very": {
        "scale": "",
        "name": "Face without Mouth",
        "html": "&#x1F636;",
        "emoji": "😶",
        "expression": "neutral"
      },
      "extremely": {
        "scale": "",
        "name": "Face without Mouth",
        "html": "&#x1F636;",
        "emoji": "😶",
        "expression": "neutral"
      }
    },
    "joy": {
      "slightly": {
        "scale": "slightly",
        "name": "Slightly Smiling Face",
        "html": "&#x1f642;",
        "emoji": "🙂",
        "expression": "joyful"
      },
      "somewhat": {
        "scale": "somewhat",
        "name": "Smiling Face with Smiling Eyes",
        "html": "&#x1f60a;",
        "emoji": "😊",
        "expression": "joyful"
      },
      "moderately": {
        "scale": "moderately",
        "name": "Grinning Face",
        "html": "&#x1F600;",
        "emoji": "😀",
        "expression": "joyful"
      },
      "very": {
        "scale": "very",
        "name": "Grinning Face with Big Eyes",
        "html": "&#x1F603;",
        "emoji": "😃",
        "expression": "joyful"
      },
      "extremely": {
        "scale": "extremely",
        "name": "Grinning Face with Smiling Eyes",
        "html": "&#x1F601;",
        "emoji": "😁",
        "expression": "joyful"
      }
    },
    "sadness": {
      "slightly": {
        "scale": "slightly",
        "name": "Slightly Frowning Face",
        "html": "&#x1f641;",
        "emoji": "🙁",
        "expression": "sad"
      },
      "somewhat": {
        "scale": "somewhat",
        "name": "Disappointed Face",
        "html": "&#x1F61E",
        "emoji": "😞",
        "expression": "sad"
      },
      "moderately": {
        "scale": "moderately",
        "name": "Frowning Face with Open Mouth",
        "html": "&#x1f626;",
        "emoji": "😦",
        "expression": "sad"
      },
      "very": {
        "scale": "very",
        "name": "Crying Face",
        "html": "&#x1F622",
        "emoji": "😢",
        "expression": "sad"
      },
      "extremely": {
        "scale": "extremely",
        "name": "Loudly Crying Face",
        "html": "&#x1F62D;",
        "emoji": "😭",
        "expression": "sad"
      }
    },
    "anger": {
      "slightly": {
        "scale": "slightly",
        "name": "Grimacing Face",
        "html": "&#x1F62C;",
        "emoji": "😬",
        "expression": "angry"
      },
      "somewhat": {
        "scale": "somewhat",
        "name": "Angry Face",
        "html": "&#x1f620;",
        "emoji": "😠",
        "expression": "angry"
      },
      "moderately": {
        "scale": "moderately",
        "name": "Pouting Face",
        "html": "&#x1f621;",
        "emoji": "😡",
        "expression": "angry"
      },
      "very": {
        "scale": "very",
        "name": "Face with Steam from Nose",
        "html": "&#x1F624;",
        "emoji": "😤",
        "expression": "angry"
      },
      "extremely": {
        "scale": "extremely",
        "name": "Serious Face with Symbols on Mouth",
        "html": "&#x1F92C;",
        "emoji": "🤬",
        "expression": "angry"
      }
    },
    "fear": {
      "slightly": {
        "scale": "slightly",
        "name": "Worried Face",
        "html": "&#x1f61f;",
        "emoji": "😟",
        "expression": "fearful"
      },
      "somewhat": {
        "scale": "somewhat",
        "name": "Anguished Face",
        "html": "&#x1F627;",
        "emoji": "😧",
        "expression": "fearful"
      },
      "moderately": {
        "scale": "moderately",
        "name": "Fearful Face",
        "html": "&#x1F628;",
        "emoji": "😨",
        "expression": "fearful"
      },
      "very": {
        "scale": "very",
        "name": "Anxious Face with Sweat",
        "html": "&#x1f605;",
        "emoji": "😰",
        "expression": "fearful"
      },
      "extremely": {
        "scale": "extremely",
        "name": "Face Screaming in Fear",
        "html": "&#x1f631;",
        "emoji": "😱",
        "expression": "fearful"
      }
    }
  }

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
    return report
  }
}

export default plugin
