import React from 'react';
import * as ReactDOM from 'react-dom';
import { Example } from '../stories/useStoreLocalWithPropsAsObservableSource.stories';

describe('Example', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Example sentence='test test'/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
