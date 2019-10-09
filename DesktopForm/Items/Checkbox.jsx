import React, {Component} from 'react';
import {Row, Col, Icon, Checkbox as CheckboxAntd} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Checkbox.scss";

export default class Checkbox extends Component {

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
    const col = this.props.col;
    const map = item.map || [];
    const defaultValue = this.props.defaultValue;
    const className = `col${col} slice` + (this.state.errorMessage !== '' ? ' error' : '');
    const onChange = this.props.onChange;
    const onError = this.props.onError;
    return (
      <Row className="ItemCheckbox">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <CheckboxAntd.Group
            className={className}
            defaultValue={defaultValue}
            dataSource={map}
            onChange={(evt) => {
              const res = this.formatter(evt);
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