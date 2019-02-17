import ComponentLoader from 'component-loader-js';

import ChoiceButton from '../../components/choice-button/choice-button';
import Replica from '../../components/replica/replica';

const componentLoader = new ComponentLoader({
  ChoiceButton,
  Replica
});

componentLoader.scan();