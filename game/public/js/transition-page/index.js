import ComponentLoader from 'component-loader-js';

import ChoiceButton from '../../components/interface/choice-button/choice-button';
import Replica from '../../components/interface/replica/replica';

const componentLoader = new ComponentLoader({
  ChoiceButton,
  Replica
});

componentLoader.scan();