import React, {Component} from 'react';
import {Row, Col, Icon, Cascader as CascaderAntd} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Select.scss";

export default class Cascader extends Component {

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
    const map = item.map || [];
    const col = this.props.col;
    const defaultValue = this.props.defaultValue;
    const className = `col${col} slice` + (this.state.errorMessage !== '' ? ' error' : '');
    const onChange = this.props.onChange;
    const onError = this.props.onError;
    return (
      <Row className="ItemCascader">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <CascaderAntd
            style={{textAlign: 'left'}}
            className={className}
            size={size}
            placeholder={I18n('pleaseChoose') + item.name}
            defaultValue={defaultValue}
            options={map}
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
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}