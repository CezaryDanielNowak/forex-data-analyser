import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Button from 'sf/components/Button';
import Dialog from 'sf/components/Dialog';

export default class DialogInButton extends BaseComponent {
  className = 'ts-DialogInButton';

  static propTypes = {
    buttonProps: PropTypes.shape(Button.propTypes).isRequired,
    dialogProps: PropTypes.shape(Dialog.propTypes).isRequired,
    children: PropTypes.node.isRequired,
    beforeDialogOpen: PropTypes.func,
  };

  static defaultProps = {
    beforeDialogOpen: () => Promise.resolve(),
  };

  closeDialog = () => this.dialogInstance.toggle(false); // public

  handleClick = () => this.props.beforeDialogOpen()
    .then(() => this.dialogInstance.toggle(true));

  render() {
    return (
      <div
        className={ this.rootcn() }
      >
        <Button
          { ...this.props.buttonProps }
          className={ this.cn({
            '__button': true,
            [this.props.buttonProps.className]: this.props.buttonProps.className,
          }) }
          onClick={ this.handleClick }
        />
        <Dialog
          { ...this.props.dialogProps }
          className={ this.cn({
            '__dialog': true,
            [this.props.dialogProps.className]: this.props.dialogProps.className,
          }) }
          ref={ (dialog) => { this.dialogInstance = dialog; } }
        >
          { this.props.children }
        </Dialog>
      </div>
    );
  }
}
