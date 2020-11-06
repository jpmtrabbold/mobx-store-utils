import { Observer } from 'mobx-react-lite';
import React from 'react';
import useStore from '../src/useStore'

export const UseStoreStory = () => {
  
  const store = useStore(() => ({
    data1: "test",
    click: () => store.data1 = "clicked"
  }))

  // check InputWithErrorField implementation out on InputProps.stories.tsx 
  return <Observer>
    {() => <>
      <br />
      <button onClick={store.click}>Validate</button>
      <br />
      <h3>{store.data1}</h3>
    </>}
  </Observer>
};

export default {
  title: 'useStore',
  component: useStore,
};
