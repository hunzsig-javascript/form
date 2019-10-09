import React, {Component} from 'react';
import {Row, Col, Icon, Select as SelectAntd} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Select.scss";

export default class Select extends Component {

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
    const map = item.map || [];
    const col = this.props.col;
    const defaultValue = this.props.defaultValue;
    const className = `col${col} slice` + (this.state.errorMessage !== '' ? ' error' : '');
    const onChange = this.props.onChange;
    const onError = this.props.onError;
    return (
      <Row className="ItemSelect">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <SelectAntd
            allowClear={!required}
            className={className}
            size={size}
            placeholder={I18n.tr('pleaseChoose') + item.name}
            defaultValue={defaultValue}
            showSearch={map.length > 8}
            filterOption={(input, option) => {
              if (option.props.disabled === true) return false;
              else if (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0) return true;
              else if (`${option.props.value}`.indexOf(input) >= 0) return true;
              return false;
            }}
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
          >
            {map.map((m) => {
              return (
                <SelectAntd.Option
                  key={m.value}
                  value={m.value}
                  disabled={m.disabled || false}>
                  {m.label}
                </SelectAntd.Option>
              );
            })}
          </SelectAntd>
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}