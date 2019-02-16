import emotions from '../modules/emotions'

var Langs = function(options) {
    this.options = options;
};

Langs.prototype.strings = {
  en: {
    title: function() {return "Sentimony"},
    buttonOk: function () {return "OK"},
    sentimentPositive: "positive",
    sentimentPegative: "negative",
    labelSelectCategory: function() {return "Select a category"},
    labelOverview: function() {return "Sentiment Overview"},
    labelDetail: function() {return "Sentiment Details"},
    containerDetail: function(data) {
      return `<pre id="sentimony-report-details">${JSON.stringify(data, null, 2)}</pre>`
    },
    containerOverview: function(data) {
      let sentiment = "neutral"
      let emotion = "neutral"
      if (data.comparative > 0) {
        sentiment = "positive"
        emotion = "joy"
      }
      if (data.comparative < 0) {
        sentiment = "negative"
        emotion = "sadness"
      }
      let strength = Langs.prototype.comparativeToScale(data, emotion)

      if (data.comparative == 0) {
        return `<p>Overall, readers might have a hard time understanding your
          sentiment because none of your words seem to have a feeling or
          emotion associated wiith them`
      }
      return `<p id="report-emoji"><span class="emoji" role="img" aria-label="">${strength.html}</span></p>
        <p>Overall, readers might see your sentiment as
          <span class="report-keyword">${strength.scale}</span>
          <span class="report-keyword">${sentiment}</span>
          because you used words like <span class="report-keyword">${data[sentiment][0]}</span>
          ${data[sentiment][1] ? `and <span class="report-keyword">${data[sentiment][1]}</span>` : ''}.
        </p>`
    }
  }
}


Langs.prototype.t = function(l = 'en', s, d) {
  if(this.strings[l] === undefined) l = 'en'
  return this.strings[l][s](d)
}

Langs.prototype.comparativeToScale = function(data, emotion) {
  if(data.comparative > 0) {
    emotion = "joy"
  }
  if(data.comparative < 0) {
    emotion = "sadness"
  }
  let scale = data.score / data.words.length
  if (scale < 0) scale = scale * -1
  scale = Math.ceil(scale)
  scale = Object.keys(emotions[emotion])[scale]
  return emotions[emotion][scale]
}

module.exports = Langs;
