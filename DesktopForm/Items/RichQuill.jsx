import React, {Component} from 'react';
import {Row, Col, Icon} from 'antd';
import ReactQuill from 'react-quill';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import './RichQuill.d.css';
import "./RichQuill.scss";

export default class RichQuill extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  render() {
    const required = this.props.required;
    const item = this.props.item;
    const col = this.props.col;
    const defaultValue = this.props.defaultValue;
    const onChange = this.props.onChange;
    const onError = this.props.onError;
    return (
      <Row className="ItemRichQuill">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <ReactQuill
            readOnly={false}
            defaultValue={defaultValue}
            modules={{
              toolbar: [
                ['clean'],

                [{font: []}],
                [{header: [1, 2, 3, 4, 5, 6]}],
                [{size: []}],

                ['bold', 'italic', 'underline', 'strike'],
                [{color: []}, {background: []}],
                ['link', 'image', 'video'],
                [{align: []}],

                [{list: 'ordered'}, {list: 'bullet'}],
                [{indent: '-1'}, {indent: '+1'}],
                [{script: 'sub'}, {script: 'super'}],
                ['blockquote', 'code-block'],
                [{direction: 'rtl'}],
              ],
            }}
            onChange={(string) => {
              if (item.params) {
                if (item.params.required) {
                  this.state.errorMessage = !string ? item.label + I18n('isRequired') : '';
                }
              }
              this.setState({
                errorMessage: this.state.errorMessage,
              });
              onChange(string);
              onError(this.state.errorMessage);
            }}
          />
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}