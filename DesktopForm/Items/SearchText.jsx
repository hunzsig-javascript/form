import React, {Component} from 'react';
import {Row, Col, Icon, Input, Button} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./SearchText.scss";

export default class SearchText extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      value: null,
    };
  }

  formatter = (evt) => {
    return evt.target.value;
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
      <Row className="ItemSearchText">
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
              onError(this.state.errorMessage);
            }}
            {...item.params}
          />
          <div style={{position: 'absolute', right: '5px', top: '5px'}}>
            <Button
              type="dashed"
              size="small"
              onClick={() => {
                if (typeof item.onSearch === 'function') {
                  const callback = (callbackData = undefined) => {
                    this.state.value = callbackData;
                    this.setState({
                      value: this.state.value,
                    });
                    onChange(this.state.value)
                  };
                  item.onSearch(this.state.value, callback);
                }
              }}
            >
              {item.nameSub}
            </Button>
          </div>
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}