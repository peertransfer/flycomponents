import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Radio extends Component {
  static propTypes = {
    className: PropTypes.string,
    error: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    name: PropTypes.string.isRequired,
    required: PropTypes.bool
  };

  render() {
    const {
      className,
      id,
      name,
      error,
      label,
      required,
      ...otherProps
    } = this.props;

    return (
      <label
        htmlFor={id || name}
        className={classNames('Radio', className, {
          'has-error': error
        })}
      >
        <input
          name={name}
          id={id || name}
          className="Radio-input"
          type="Radio"
          required={required}
          aria-required={required}
          {...otherProps}
        />
        <span className="Radio-label">{label}</span>
        {error && <div className="FormGroup-feedback">{error}</div>}
      </label>
    );
  }
}

export default Radio;
