import React from 'react';
import * as ReactDOM from 'react-dom';
import { UseStoreStory } from '../stories/useStore.stories';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UseStoreStory />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
