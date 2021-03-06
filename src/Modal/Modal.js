import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from './Portal';
import FocusTrap from 'focus-trap-react';
import { ESC, TAB } from '../utils/keycodes';

class Modal extends Component {
  state = {
    isOpen: this.props.defaultIsOpen,
    isTrapActive: false
  };

  componentDidMount() {
    const { onOpen } = this.props;
    if (this.isOpen) {
      onOpen();
    }

    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    const { isOpen, onOpen } = this.props;

    if (prevProps.isOpen !== isOpen && isOpen) {
      onOpen();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  modalDialogRef = React.createRef();

  close = () => {
    const { allowClosing, onClose } = this.props;
    if (!allowClosing) return;

    this.setState({ ...this.state, isOpen: false }, () => {
      if (this.state.activeElement) this.state.activeElement.focus();
      onClose();
    });
  };

  handleMouseDown = evt => {
    if (
      this.modalDialogRef.current &&
      this.modalDialogRef.current.contains(evt.target)
    )
      return;

    this.close();
  };

  handleKeyDown = event => {
    const keyCode = event.keyCode;

    if (keyCode === ESC) this.close();
    if (keyCode === TAB) this.setState({ isTrapActive: true });
  };

  get isClosed() {
    return !this.isOpen;
  }

  get isOpen() {
    return this.isUncontrolled ? this.state.isOpen : this.props.isOpen;
  }

  get isUncontrolled() {
    const { isOpen } = this.props;

    return typeof isOpen === 'undefined';
  }

  open = () => {
    const { onOpen } = this.props;
    this.setState({ ...this.state, isOpen: true }, onOpen);
  };

  handleClick = () => this.close();

  render() {
    const { allowClosing, children, className, size } = this.props;
    const { isTrapActive } = this.state;
    const modalClassName = `Modal Modal--${size} ${className}`;
    const closeButton = (
      <button
        className="Modal-closeButton"
        type="button"
        onClick={this.handleClick}
        aria-label="Close"
      >
        <span className="Icon Icon--close Icon--xs margin-0" />
      </button>
    );

    if (this.isClosed) {
      return null;
    }

    return (
      <Portal>
        <FocusTrap
          active={isTrapActive}
          focusTrapOptions={{
            onActivate: () =>
              this.setState({ activeElement: document.activeElement })
          }}
        >
          <div
            aria-modal
            className={modalClassName}
            data-testid="Modal"
            onMouseDown={this.handleMouseDown}
            role="dialog"
            tabIndex="-1"
          >
            <div className="Modal-dialog" ref={this.modalDialogRef}>
              {allowClosing && closeButton}
              <div className="Modal-content" role="document">
                {children}
              </div>
            </div>
          </div>
        </FocusTrap>
      </Portal>
    );
  }
}

Modal.propTypes = {
  allowClosing: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  defaultIsOpen: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  size: PropTypes.string
};

Modal.defaultProps = {
  allowClosing: true,
  className: '',
  defaultIsOpen: true,
  onClose: () => {},
  onOpen: () => {},
  size: 'small'
};

export default Modal;
