import React from 'react'
import ReactDOM from 'react-dom'
import Title from './title'

export default class AdminMain extends React.PureComponent {
  static propTypes = {
  }

  render() {
    return <Title text="fudisturnaus.com - ADMIN" loading={false}/>
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <AdminMain/>,
    document.getElementById('admin-app'),
  )
})
