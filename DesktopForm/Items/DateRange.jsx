import React, {Component} from 'react';
import {Row, Col, Icon, DatePicker} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./DateRange.scss";

const {RangePicker} = DatePicker;

export default class DateRange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

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
      <Row className="ItemDateRange">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <RangePicker
            className={className}
            style={{backgroundColor: 'transparent', border: '1px solid #E0E0E0'}}
            size={size}
            defaultValue={defaultValue}
            formater={['YYYY-MM-DD']}
            onChange={(dates, dateStrings) => {
              if (item.params) {
                if (item.params.required) {
                  this.state.errorMessage = !dateStrings ? item.label + I18n('isRequired') : '';
                }
              }
              this.setState({
                errorMessage: this.state.errorMessage,
              });
              onChange([dates, dateStrings]);
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