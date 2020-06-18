import React from 'react';
import BaseComponent from 'components/BaseComponent';
import IconButton from 'sf/components/IconButton';
import MenuHamburger from 'components/MenuHamburger';
import { ROUTES } from 'constants';

export default class PageHeader extends BaseComponent {
  className = 'ts-PageHeader';
  state = {
    title: '',
  };

  componentDidMount() {
    this.subscribe('titleUpdate', (title) => {
      this.setState({
        title
      });
    });
  }

  handleButtonClick = () => {
    this.navigate(ROUTES.INDEX);
  }

  render() {
    return (
      <div className={ this.rootcn`` }>
        <IconButton
          className={ this.cn`__home-button` }
          onClick={ this.handleButtonClick }
          set="fa"
          type="home"
        />
        <p className={ this.cn`__text` }>{ this.state.title }</p>

        <MenuHamburger />
      </div>
    );
  }
}
