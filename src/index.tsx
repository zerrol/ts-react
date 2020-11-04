import React from '../lib/react/index'
import { render } from '../lib/reactDom/index'
import { Component } from '../lib/react/index'

// const jsxElement = <div onClick={() => console.log('click')}>
//   <div style={{color: 'red'}}>
//     hello toy react
//   </div>

//   <div>
//     <div>hello</div>
//     棉花糖
//   </div>
// </div>

interface IState {
  name: string
}

class MyComponent extends Component<any, IState> {
  constructor(props: any) {
    super(props)  
  }

  render() {
    console.log('render', this.children)
    return (
      <div>
        hello
        <div style={{color: 'red'}}>
          棉花糖 我是可爱的棉小花
        </div>
        <ChildComponent />
        { 
          this.children
        }
      </div>
    )
  }
}

class ChildComponent extends Component {
  render() {
    return (
      <div>
        我是child component
      </div>
    )
  }
}

render(<MyComponent>
    <div>
      child
      <div>
        child2
      </div>
      <div>
        child3
      </div>
    </div>
  </MyComponent>, document.getElementById('root'))
