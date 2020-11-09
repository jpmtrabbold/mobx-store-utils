import React from 'react';
import * as ReactDOM from 'react-dom';
import { Example } from '../stories/useStoreLocalWithPropsAsObservableSource.stories';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Example />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
