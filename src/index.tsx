import React from "../lib/react/index"
import { render } from "../lib/react-dom/index"

function Hello() {
  return (
    <div>
      hello
    </div>
  )
}

function App () {
  return (
    <p>
      <Hello/>
      <div>
        wo shi 
      </div>
      <div>
        giao
      </div>
    </p>
  )
}

render(<App/> , document.getElementById("root"))
