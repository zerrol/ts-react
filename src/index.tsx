import React from "../lib/react/index"
import { render } from "../lib/react-dom/index"

render(
  <div>
    origin Text
    <span>hello span</span>
    <div>
      我是可爱的棉花糖
      <div>
        hello
        <span>
          giao giao2 giao3 giao4
          <hr />
        </span>
        <div>hello</div>
        aaaa
      </div>
    </div>
  </div>,
  document.getElementById("root")
)
