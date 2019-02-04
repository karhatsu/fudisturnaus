import React from 'react'
import ReactDOM from 'react-dom'

export default class OfficialMain extends React.PureComponent {
  render() {
    return (
      <div>
        TODO
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <OfficialMain/>,
    document.getElementById('official-app'),
  )
})
