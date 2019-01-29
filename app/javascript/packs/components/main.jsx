import React from 'react'
import ReactDOM from 'react-dom'

export default class Main extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>fudisturnaus.com</h1>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Main/>,
    document.body.appendChild(document.createElement('div')),
  )
})
