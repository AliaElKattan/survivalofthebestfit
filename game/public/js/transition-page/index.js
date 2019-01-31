import ComponentLoader from 'component-loader-js';

import ChoiceButton from '../../components/choice-button/choice-button';

const componentLoader = new ComponentLoader({
  ChoiceButton
});

componentLoader.scan();

// console.log('whaddups!');