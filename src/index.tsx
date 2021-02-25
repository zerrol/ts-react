import React from '../lib/react/index'
import { render } from '../lib/react-dom/index'
// import { Component } from '../lib/react/index'

// interface IState {
//   count: number
// }

// class MyComponent extends Component<any, IState> {
//   state: IState

//   constructor(props: any) {
//     super(props)  
//     this.state = {
//       count: 0
//     }
//   }

//   onClick = () => {
//     this.setState({
//       count: this.state.count + 1
//     })

//     console.log('onClick', this.state.count)
//   }

//   render = () => {
//     console.log('render', this.children)
//     return (
//       <div>
//         hello
//         <div style={{color: 'red'}}>
//           棉花糖 我是可爱的棉小花
//         </div>
//         <ChildComponent onClick={this.onClick}/>
//         { 
//           this.children
//         }
//         {
//           this.state.count
//         }

//         <button onClick={this.onClick}>add</button>
//       </div>
//     )
//   }
// }

// class ChildComponent extends Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     return (
//       <div onClick={this.props.onClick}>
//         我是child component
//       </div>
//     )
//   }
// }

render(<div>hello</div>, document.getElementById('root'))
