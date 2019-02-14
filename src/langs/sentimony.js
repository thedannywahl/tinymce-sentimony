var Langs = function(options) {
    this.options = options;
};

Langs.prototype.strings = {
  "en": {
    "title": "Sentimony",
    "ok": "OK",
    "select a category": "Select a category",
    "overview": "Overview",
    "score": "Score",
    "overview report": "Overall, readers might see your sentiment as"
  }
}

Langs.prototype.t = function(l, s) {
  return this.strings[l][s]
}

module.exports = Langs;
