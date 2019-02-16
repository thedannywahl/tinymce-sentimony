import { Pipeline, Logger, GeneralSteps } from '@ephox/agar';
import { TinyLoader, TinyApis, TinyUi } from '@ephox/mcagar';
import { UnitTest } from '@ephox/bedrock';
import Plugin from '../../../main/ts/Plugin';

// This an example of a browser test of the editor.
UnitTest.asynctest('browser.PluginTest', (success, failure) => {
  Plugin();

  TinyLoader.setup((editor, onSuccess, onFailure) => {
    const tinyUi = TinyUi(editor);
    const tinyApis = TinyApis(editor);

    Pipeline.async({}, [
      Logger.t('test click on button', GeneralSteps.sequence([
        tinyUi.sClickOnToolbar('click sentimony button', 'button:contains("sentimony button")'),
        tinyApis.sAssertContent('<p>content added from sentimony</p>')
      ]))
    ], onSuccess, onFailure);
  }, {
    plugins: 'sentimony',
    toolbar: 'sentimony'
  }, success, failure);
});
