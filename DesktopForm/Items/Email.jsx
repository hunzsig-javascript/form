import React, {Component} from 'react';
import {Row, Col, Icon, AutoComplete} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Email.scss";

export default class Email extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      renderEmail: [],
    };
  }

  formatter = (evt) => {
    return evt.trim();
  };


  renderEmail = (value) => {
    let renderEmail;
    if (!value || value.indexOf('@') >= 0) {
      renderEmail = [];
    } else {
      renderEmail = ['qq.com', '163.com', '126.com', 'sina.com', 'hotmail.com', 'gmail.com'].map((domain) => {
        const email = `${value}@${domain}`;
        return <AutoComplete.Option key={email}>{email}</AutoComplete.Option>;
      });
    }
    this.setState({renderEmail: renderEmail});
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
      <Row className="ItemEmail">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <AutoComplete
            className={className}
            size={size}
            placeholder={I18n.tr('pleaseType') + item.name}
            filterOption={false}
            hasClear={true}
            defaultValue={defaultValue}
            onChange={(evt) => {
              this.renderEmail(evt);
              const res = this.formatter(evt);
              if (item.params) {
                if (item.params.required) {
                  this.state.errorMessage = !res ? item.label + I18n.tr('isRequired') : '';
                }
                if (item.params.minLength && res.length < item.params.minLength) {
                  this.state.errorMessage = item.label + ' ' + I18n.tr('tooShort');
                }
                if (item.params.maxLength && res.length > item.params.maxLength) {
                  this.state.errorMessage = item.label + ' ' + I18n.tr('tooLong');
                }
              }
              this.setState({
                errorMessage: this.state.errorMessage,
              });
              onChange(res);
              onError(this.state.errorMessage);
            }}
            {...item.params}
          >
            {this.state.renderEmail}
          </AutoComplete>
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}