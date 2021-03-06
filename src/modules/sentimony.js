import Langs from '../langs/sentimony'
let s = new Langs()
let l = tinymce.util.I18n.getCode()

var Sentimony = function(options) {
    this.options = options;
};

Sentimony.prototype.setComparativeSentiment = function(data, emotions) {
  let emotion = document.getElementById("sentimony-emotion")
  if (data.comparative > 0) {
    emotion.setAttribute("aria-label", emotions.joy.slightly.name)
    emotion.innerHTML = emotions.joy.slightly.html
    emotion.hidden = false
  } else if (data.comparative < 0) {
    emotion.setAttribute("aria-label", emotions.sadness.slightly.name)
    emotion.innerHTML = emotions.sadness.slightly.html
    emotion.hidden = false
  } else if ((data.comparative == 0) && (data.tokens.length > 0)) {
    emotion.setAttribute("aria-label", emotions.neutral.slightly.name)
    emotion.innerHTML = emotions.neutral.slightly.html
    emotion.hidden = false
  } else {
    emotion.setAttribute("aria-label", "")
    emotion.innerHTML = ''
    emotion.hidden = true
  }
}

Sentimony.prototype.showReport = function(section, data) {
  let overview = s.t(l, "containerOverview", data)
  let detail = s.t(l, "containerDetail", data)

  let reportBody = document.getElementById("sentimony-report-body")
  let report = overview
  if (reportBody) {
    if (section == s.t(l, "labelDetail")) report = detail
    reportBody.innerHTML = report
  } else {
    return report
  }
}

module.exports = Sentimony;
