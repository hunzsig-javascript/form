import React, {Component} from 'react';
import {Row, Col, Icon, Input, AutoComplete, Select} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Net.scss";

export default class Net extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      value: '',
    };
  }

  formatter = (evt) => {
    return evt.trim();
  };

  renderNet = (value) => {
    let renderNet;
    if (!value || (value.indexOf('.') >= 0 && value.indexOf('.', value.indexOf('.') + 1) >= 0)) {
      renderNet = [];
    } else {
      renderNet = ['.com', '.cn', '.com.cn', '.org', '.net', '.cc', '.gov.cn', '.xin', '.top', '.wiki'].map((domain) => {
        const net = `${value}${domain}`;
        return <AutoComplete.Option key={net}>{net}</AutoComplete.Option>;
      });
    }
    this.setState({renderNet});
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
          <Input.Group compact className={className}>
            <Select
              style={{width: '20%'}}
              defaultValue=""
              onChange={(value) => {
                this.setState({
                  value: value
                })
              }}
            >
              <Select.Option value="" disabled={true}>{I18n.tr('protocol')}</Select.Option>
              <Select.Option value="http://">http://</Select.Option>
              <Select.Option value="https://">https://</Select.Option>
            </Select>
            <AutoComplete
              style={{width: '80%'}}
              size={size}
              placeholder={I18n.tr('pleaseType') + item.name}
              filterOption={false}
              hasClear={true}
              defaultValue={defaultValue}
              onChange={(evt) => {
                this.renderNet(evt);
                const res = this.formatter(evt);
                if (this.state.value === '') {
                  this.state.errorMessage = I18n.tr('protocol') + I18n.tr('isRequired');
                }
                if (item.params) {
                  if (item.params.required) {
                    this.state.errorMessage = !res ? item.label + I18n.tr('isRequired') : '';
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
              {this.state.renderNet}
            </AutoComplete>
          </Input.Group>
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}