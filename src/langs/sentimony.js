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
    labelScore: function() {return "Sentiment Details"},
    containerReport: function(data) {
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
      return `<p><span>${strength.html}</span></p>
        <p>Overall, readers might see your sentiment as
          <span class="keyword">${strength.scale}</span> ${sentiment}
          because you used words like <span class="keyword">${data[sentiment][0]}</span>
          ${data[sentiment][1] ? `and <span class="keyword">${data[sentiment][1]}</span>` : ''}
        </p>`
    }
  }
}


Langs.prototype.t = function(l = 'en', s, d) {
  if(this.strings[l] === undefined) l = 'en'
  return this.strings[l][s](d)
}

Langs.prototype.comparativeToScale = function(data, emotion) {
  return emotions[emotion]["slightly"]
}

module.exports = Langs;
