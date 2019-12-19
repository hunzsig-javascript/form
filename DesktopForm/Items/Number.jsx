import React, {Component} from 'react';
import {Row, Col, Icon, Input} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Number.scss";

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
    let last = value.substr(value.length - 1, 1);
    if (last === '。' || last === '.') {
      last = '.';
      value = parseFloat(value) + last;
    } else if (value.toString().indexOf('.') === -1) {
      value = parseFloat(value);
    }
    const vsp = value.toString().split('.');
    if (vsp.length >= 2) {
      if (vsp[0].length >= 0 && vsp[1].length > 0) {
        vsp[1] = (parseInt(vsp[1], 10) + 10 ** vsp[1].length).toString();
        vsp[1] = vsp[1].substring(1, vsp[1].length);
        value = parseInt(vsp[0], 10) + '.' + vsp[1];
      }
    }
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
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
            placeholder={I18n('PLEASE_TYPE') + item.name}
            allowClear={true}
            defaultValue={defaultValue}
            onChange={(evt) => {
              if (isNaN(evt.target.value)) {
                this.state.errorMessage = I18n('PLEASE_FILL_RIGHT_NUM');
              }
              const res = this.formatter(evt, item.min, item.max);
              if (item.params) {
                if (item.params.required) {
                  this.state.errorMessage = !res ? item.label + I18n('IS_REQUIRED') : '';
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