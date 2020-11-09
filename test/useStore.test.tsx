import React from 'react';
import * as ReactDOM from 'react-dom';


describe('Example', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<input />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
