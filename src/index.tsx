import React from '../lib/react'
import { render } from '../lib/reactDom'

const a = <div onClick={() => console.log('click')}>
  <div style={{color: 'red'}}>
    hello toy react
  </div>

  <div>
    <div>hello</div>
    棉花糖
  </div>
</div>

// class MyComponent {
//   render() {
//     return (
//       <div>
//         hello
//       </div>
//     )
//   }
// }

render(a, document.getElementById('root'))
