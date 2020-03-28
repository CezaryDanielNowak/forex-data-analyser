import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import PageTitle from 'sf/components/PageTitle';
import TableOfContents from 'sf/components/TableOfContents';
import {
  createAnchorName,
  getSetHashFunc,
  onFullRender,
  scrollTo,
} from 'sf/helpers/domHelper';
import device from 'sf/models/device';

export default class ListWithTableOfContents extends BaseComponent {
  className = 'ts-ListWithTableOfContents';

  static propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.node,
        content: PropTypes.node,
      }),
    ).isRequired,
    mainIntro: PropTypes.node,
    secondaryIntro: PropTypes.node,
    tableTitle: PropTypes.node,
    title: PropTypes.node.isRequired,
  };

  static defaultProps = {
    mainIntro: null,
    secondaryIntro: null,
    tableTitle: null,
  };

  state = {};

  componentDidMount() {
    this.syncStateWithModel(device, ['mdUp']);
    onFullRender()
      .then(this.getScrollToSectionFunc(location.hash));
  }

  getScrollToSectionFunc = (hashOrTitle) => (e) => {
    if (e) e.preventDefault();
    const hash = hashOrTitle[0] === '#' ? hashOrTitle.slice(1) : createAnchorName(hashOrTitle);
    const doesHashMatch = this.props.list
      .map(({ title }) => createAnchorName(title))
      .includes(hash);
    if (doesHashMatch) {
      scrollTo(document.querySelector(`[name="${hash}"]`), 250);
      setTimeout(getSetHashFunc(hash), 250);
    }
  };

  renderSections = () => this.props.list
    .map(({ content, title }, index) => (
      <section
        className={ this.cn`__section` }
        key={ title }
      >
        <h2 className={ this.cn`__section-header` }>
          <a
            className={ this.cn`__section-header-link` }
            href={ `#${createAnchorName(title)}` }
            name={ createAnchorName(title) }
            onClick={ this.getScrollToSectionFunc(title) }
          >
            { !this.state.mdUp && `${index + 1}. ` }
            { title }
          </a>
        </h2>
        <div className={ this.cn`__section-content` }>
          { content }
        </div>
      </section>
    ));

  render() {
    return (
      <div className={ this.rootcn`ts-container ts-container--narrow` }>
        <PageTitle
          className={ this.cn`__title` }
          hr={ true }
          title={ this.props.title }
        />
        { this.props.mainIntro &&
          <section className={ this.cn`__intro` }>
            <span className={ this.cn`__p` }>
              { this.props.mainIntro }
            </span>
          </section>
        }
        <TableOfContents
          className={ this.cn`__table-of-contents` }
          contents={ this.props.list.map(({ title }) => title) }
          title={ this.props.tableTitle }
          onItemClick={ this.getScrollToSectionFunc }
        />
        { this.props.secondaryIntro &&
          <section className={ this.cn`__intro-secondary` }>
            <span className={ this.cn`__p` }>
              { this.props.secondaryIntro }
            </span>
          </section>
        }
        { this.renderSections() }
      </div>
    );
  }
}
