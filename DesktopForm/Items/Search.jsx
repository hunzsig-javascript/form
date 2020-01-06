import React, {Component} from 'react';
import {Row, Col, Icon, Input} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "basic";

import "./Search.scss";

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      value: null,
      nodeShadow: null,
    };
  }

  formatter = (evt) => {
    return evt.target.value.trim();
  };

  renderSearchRemove = () => {
    let tpl;
    if (this.state.value && this.state.value.length > 0) {
      tpl = (
        <Icon
          type="close-circle"
          theme="filled"
          onClick={
            () => {
              this.state.nodeShadow.input.input.value = '';
              this.state.value = undefined;
              this.props.onChange(this.state.values);
            }
          }
        />
      );
    }
    return tpl;
  };

  render() {
    const required = this.props.required;
    const item = this.props.item;
    const size = this.props.size;
    const col = this.props.col;
    const defaultValue = this.props.defaultValue;
    const shadowValue = this.props.shadowValue;
    const className = `col${col} slice` + (this.state.errorMessage !== '' ? ' error' : '');
    const onError = this.props.onError;
    return (
      <Row className="ItemSearch">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <span>{I18n('PLEASE_TYPE') + item.name}</span>
          <Input
            style={{position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, opacity: 0}}
            placeholder={I18n('PLEASE_TYPE') + item.name}
            value={defaultValue}
            readOnly={true}
            required={item.params && item.params.required ? item.params.required : false}
            onChange={(evt) => {
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
                errorMessage: this.state.errorMessage,
              });

              this.props.onChange(res);
              onError(this.state.errorMessage);
            }}
          />
          <div>
            <Input.Search
              className={className}
              size={size}
              placeholder={(item.params && item.params.placeholder) ? item.params.placeholder : `${I18n('PLEASE_CHOOSE_BY_CLICK')}${item.name}`}
              defaultValue={shadowValue ? shadowValue : ''}
              ref={node => this.state.nodeShadow = node}
              readOnly={true}
              allowClear={true}
              enterButton={item.nameSub}
              onSearch={() => {
                if (typeof item.onSearch === 'function') {
                  const callback = (callbackData = undefined, callbackLabel = '') => {
                    this.state.nodeShadow.input.input.value = callbackLabel;
                    this.state.value = callbackData;
                    this.formChange(this.state.values);
                  };
                  item.onSearch(this.state.values, callback);
                }
              }}
              addonAfter={this.renderSearchRemove(item)}
            />
          </div>
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}