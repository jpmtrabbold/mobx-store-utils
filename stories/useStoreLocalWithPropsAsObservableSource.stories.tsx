import React from 'react';
import useStore from '../src/useStore'
import { Observer } from 'mobx-react-lite'

const Template = (props: { sentence: string }) => {

  const store = useStore((sp) => ({
    get wordCountDescription() {
      const sentence = sp.sentence.trim()
      const length = sentence.split(" ").filter(e => e.trim() !== "").length
      return `The sentence '${sentence}' contains ${length} words.`
    },
  }), props)

  return <Observer>
    {() => <>
      <h4>
        This is an example of a store inside a component with props. The props are passed as the second parameters of useStore
        and they are turned into observables. When the props change, the inner observables are changed automatically, causing
        all the desired reactions. In this case, the computed property 'wordCountDescription' will cause a re-render every time
        you change the 'sentence' prop, in the Controls section below.
      </h4>
      <br />
      <h3>{store.wordCountDescription}</h3>
    </>}
  </Observer>
};

export const Example = Template.bind({})
Example.args = {
  sentence: "Write your own sentence here"
};

export default {
  title: 'useStore (Local store with props as observable source)',
  component: useStore,
  argTypes: {
    // creates a specific argType based on the iconMap object
    sentence: {
      control: {
        type: 'text',
      },
    },
  },
};
