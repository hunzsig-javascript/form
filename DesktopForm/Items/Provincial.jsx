import React, {Component} from 'react';
import {Row, Col, Icon, Cascader} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Provincial.scss";

const provincialJson = require('./../../assets/json/provincial').default;

export default class Provincial extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  formatter = (v1, v2) => {
    let label = '';
    v2.forEach((path) => {
      label += label === '' ? path.label : ' ' + path.label;
    });
    return [v1, label];
  };

  render() {
    const required = this.props.required;
    const item = this.props.item;
    const size = this.props.size;
    const col = this.props.col;
    const defaultValue = this.props.defaultValue;
    const onChange = this.props.onChange;
    const onError = this.props.onError;
    return (
      <Row className="ItemProvincial">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          {
            provincialJson &&
            <Cascader
              expandTrigger="hover"
              size={size}
              options={provincialJson}
              defaultValue={defaultValue}
              allowClear={true}
              placeholder={I18n('pleaseChoose') + item.name}
              showSearch={(inputValue, path) => {
                return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
              }}
              onChange={(evt) => {
                const res = this.formatter(evt);
                if (item.params) {
                  if (item.params.required) {
                    this.state.errorMessage = !res[0] ? item.label + I18n('isRequired') : '';
                  }
                }
                this.setState({
                  errorMessage: this.state.errorMessage,
                });
                onChange(res);
                onError(this.state.errorMessage);
              }}
              {...item.params}
            />
          }
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}