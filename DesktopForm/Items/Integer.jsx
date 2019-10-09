import React, {Component} from 'react';
import {Row, Col, Icon, Input} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./ItemInteger.scss";

export default class String extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  formatter = (evt, min, max) => {
    let value = evt.target.value.trim();
    if (value === '-') {
      return value;
    }
    if (value === '' || value === null || !value) {
      return value;
    }
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    value = parseInt(value, 10);
    if (isNaN(value) || value === Infinity) {
      value = '';
    }
    return value;
  };

  render() {
    const required = this.props.required;
    const item = this.props.item;
    const size = this.props.size;
    const col = this.props.col;
    const defaultValue = this.props.defaultValue;
    const className = `col${col} slice` + (this.state.errorMessage !== '' ? ' error' : '');
    const onChange = this.props.onChange;
    const onError = this.props.onError;
    return (
      <Row className="ItemNumber">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <Input
            className={className}
            size={size}
            placeholder={I18n.tr('pleaseType') + item.name}
            allowClear={true}
            defaultValue={defaultValue}
            onChange={(evt) => {
              if (isNaN(evt.target.value)) {
                this.state.errorMessage = I18n.tr('pleaseFillRightInt');
              } else if (!Number.isInteger(evt.target.value)) {
                this.state.errorMessage = I18n.tr('pleaseFillRightInt');
              }
              const res = this.formatter(evt, item.min, item.max);
              if (item.params) {
                if (item.params.required) {
                  this.state.errorMessage = !res ? item.label + I18n.tr('isRequired') : '';
                }
              }
              this.setState({
                value: res,
                errorMessage: this.state.errorMessage,
              });
              onChange(res);
              onError(this.state.errorMessage);
            }}
            {...item.params}
          />
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}