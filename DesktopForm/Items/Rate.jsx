import React, {Component} from 'react';
import {Row, Col, Icon, Rate as RateAntd} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Select.scss";

export default class Rate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  formatter = (evt) => {
    return evt;
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
      <Row className="ItemRate">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <RateAntd
            className={className}
            size={size}
            defaultValue={defaultValue}
            onChange={(value) => {
              const res = this.formatter(value);
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
          />
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}