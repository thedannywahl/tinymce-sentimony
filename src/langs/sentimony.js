var Langs = function(options) {
    this.options = options;
};

Langs.prototype.strings = {
  en: {
    title: function() {return "Sentimony"},
    ok: function () {return "OK"},
    selectCategory: function() {return "Select a category"},
    overview: function() {return "Sentiment Overview"},
    score: function() {return "Sentiment Details"},
    report: function(data) {
      let sentiment = "neutral"
      if (data.score > 0) sentiment = "positive"
      if (data.score < 0) sentiment = "negative"
      return `<p>Overall, readers might see your sentiment as ${sentiment}
        because you used words like <span class="keyword">${data.negative[0]}</span>
        ${data.negative[1] ? `and <span class="keyword">${data.negative[1]}</span>` : ''}.</p>`
    }
  }
}

Langs.prototype.t = function(l = 'en', s, d) {
  if(this.strings[l] === undefined) l = 'en'
  return this.strings[l][s](d)
}

module.exports = Langs;
