import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const emoji = '⚽'

export default class Title extends React.PureComponent {
  static propTypes = {
    children: PropTypes.element,
    club: PropTypes.shape({
      logoUrl: PropTypes.string,
    }),
    iconLink: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div className="title">
        <div>
          {this.renderEmoji()}
          <span className="title__text">{this.props.text}</span>
          {this.renderClubLogo()}
        </div>
        {this.props.children}
      </div>
    )
  }

  renderEmoji() {
    const { iconLink } = this.props
    const emojiClasses = this.resolveEmojiClasses()
    if (!iconLink) {
      return <span className={emojiClasses}>{emoji}</span>
    } else {
      return <Link to={iconLink} className={emojiClasses}>{emoji}</Link>
    }
  }

  resolveEmojiClasses = () => {
    const emojiClasses = ['title__emoji']
    if (this.props.loading) {
      emojiClasses.push('title__emoji--loading')
    }
    return emojiClasses.join(' ')
  }

  renderClubLogo() {
    const { club } = this.props
    if (club && club.logoUrl) {
      return <img src={club.logoUrl} className="title__club-logo" />
    }
  }

  componentDidMount() {
    this.changeBrowserTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.changeBrowserTitle()
    }
  }

  changeBrowserTitle() {
    const { text } = this.props
    const titleText = text.indexOf('fudisturnaus.com') !== -1 ? text : `${text} - fudisturnaus.com`
    document.title = titleText
  }
}
