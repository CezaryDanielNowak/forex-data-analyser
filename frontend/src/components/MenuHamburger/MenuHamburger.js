import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import BaseComponent from 'components/BaseComponent';
import { ROUTES } from 'constants';


export default class MenuHamburger extends BaseComponent {
  className = 'ts-MenuHamburger';

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: '',
  };

  handleNoopOnclick = (e) => {
    let aNode = null;

    if (e.target.tagName === 'A') {
      aNode = e.target;
    } else if (e.target.parentNode.tagName === 'A') {
      aNode = e.target.parentNode;
    }

    if (aNode && !aNode.href) {
      e.preventDefault();
    }
  }

  render() {
    return (
      <div
        { ...this.props }
        className={ this.rootcn() }
      >
        <nav role="navigation" onClick={ this.handleNoopOnclick }>
          <a href="" className="ic menu" tabIndex="1">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </a>
          <a href="" className="ic close"></a>
          <ul className="main-nav">
            <li className="top-level-link">
              <a className="mega-menu"><span>Tools</span></a>
              <div className="sub-menu-block">
                <div className="row">
                  <div className="col-md-4 col-lg-4 col-sm-4">
                    <h2 className="sub-menu-head">Comparision</h2>
                    <ul className="sub-menu-lists">
                      <li><Link to={ ROUTES.CORRELATION_CHART }>Correlation chart</Link></li>
                      <li><a>TODO</a></li>
                      <li><a>TODO</a></li>
                    </ul>
                  </div>
                  <div className="col-md-4 col-lg-4 col-sm-4">
                    <h2 className="sub-menu-head">Date & Time analysis</h2>
                    <ul className="sub-menu-lists">
                      <li><Link to={ ROUTES.DAY_BY_DAY }>Day by day</Link></li>
                      <li><Link to={ ROUTES.AROUND_HOLIDAYS }>Around holidays</Link></li>
                    </ul>
                  </div>
                  <div className="col-md-4 col-lg-4 col-sm-4">
                    <h2 className="sub-menu-head">Other</h2>
                    <ul className="sub-menu-lists">
                      <li><Link to={ ROUTES.MULTI_SCROLLING }>Multi scrolling</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li className="top-level-link">
              <a><span>Services</span></a>
            </li>
            <li className="top-level-link">
              <a className="mega-menu"><span>About</span></a>
              <div className="sub-menu-block">
                <div className="row">
                  <div className="col-md-4 col-lg-4 col-sm-4">
                    <h2 className="sub-menu-head">Company</h2>
                    <ul className="sub-menu-lists">
                      <li><a>About</a></li>
                      <li><a>Mission</a></li>
                      <li><a>Community</a></li>
                      <li><a>Team</a></li>
                    </ul>
                  </div>
                  <div className="col-md-4 col-lg-4 col-sm-4">
                    <h2 className="sub-menu-head">Media</h2>
                    <ul className="sub-menu-lists">
                      <li><a>News</a></li>
                      <li><a>Events</a></li>
                      <li><a>Blog</a></li>
                    </ul>
                  </div>
                  <div className="col-md-4 col-lg-4 col-sm-4">
                    <h2 className="sub-menu-head">Careers</h2>
                    <ul className="sub-menu-lists">
                      <li><a>New Opportunities</a></li>
                      <li><a>Life @ Company</a></li>
                      <li><a>Why Join Us?</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li className="top-level-link">
              <Link to={ ROUTES.CONTACT }><span>Contact</span></Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
