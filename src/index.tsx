import React from '../lib/react/index'
import { render } from '../lib/react-dom/index'

render(
  <div>
    <div>
      <span>hello</span>
      <span>span</span>
    </div>
    <hr/>
    <h1>
      <div>
        <div>
          原生元素已完成
        </div>
      </div>
    </h1>
  </div>
, document.getElementById('root'))
