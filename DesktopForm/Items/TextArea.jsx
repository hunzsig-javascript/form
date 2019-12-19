import React, {Component} from 'react';
import {Row, Col, Icon, Input} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./TextArea.scss";

export default class TextArea extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      value: null,
      nodeShadow: null,
    };
  }

  formatter = (evt) => {
    return evt.target.value;
  };

  renderSuffix = (val) => {
    if (this.state.valuesShadow) {
      return (
        <div>
          {
            val.params && val.params.maxLength > 0 &&
            <span style={{color: '#777777'}}>
              <span
                style={{color: this.state.valuesShadow.length >= val.params.maxLength ? '#e04240' : null}}>
                {this.state.valuesShadow ? (this.state.valuesShadow + '').length : 0}
              </span>
              <span>/</span>
              <span>{val.params.maxLength}</span>&nbsp;
            </span>
          }
          <Icon
            style={{color: '#aaaaaa', cursor: 'pointer'}}
            type="close-circle"
            theme="filled"
            onClick={
              () => {
                this.state.value = undefined;
                this.state.valuesShadow = undefined;
                this.setState({
                  values: this.state.values,
                  valuesShadow: this.state.valuesShadow,
                });
                if (this.state.nodeShadow) {
                  this.state.nodeShadow.focus();
                }
              }
            }
          />
        </div>
      );
    }
    return null;
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
      <Row className="ItemTextArea">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <Input.TextArea
            className={className}
            size={size}
            placeholder={I18n('PLEASE_TYPE') + item.name}
            defaultValue={defaultValue}
            ref={node => this.state.nodeShadow = node}
            onChange={(evt) => {
              this.renderEmail(evt);
              const res = this.formatter(evt);
              if (item.params) {
                if (item.params.required) {
                  this.state.errorMessage = !res ? item.label + I18n('IS_REQUIRED') : '';
                }
                if (item.params.minLength && res.length < item.params.minLength) {
                  this.state.errorMessage = item.label + ' ' + I18n('TOO_SHORT');
                }
                if (item.params.maxLength && res.length > item.params.maxLength) {
                  this.state.errorMessage = item.label + ' ' + I18n('TOO_LONG');
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
          <div style={{position: 'absolute', right: '15px', bottom: '-5px'}}>
            {this.renderSuffix(item)}
          </div>
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}