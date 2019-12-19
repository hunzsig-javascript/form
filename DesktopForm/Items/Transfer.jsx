import React, {Component} from 'react';
import {Row, Col, Icon, Transfer as TransferAntd} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Transfer.scss";

export default class Transfer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  formatter = (evt) => {
    return evt;
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  render() {
    const required = this.props.required;
    const item = this.props.item;
    const col = this.props.col;
    const map = item.map || [];
    const targetKeys = item.targetKeys || [];
    const selectedKeys = item.selectedKeys || [];
    const className = `col${col} slice` + (this.state.errorMessage !== '' ? ' error' : '');
    const onChange = this.props.onChange;
    const onError = this.props.onError;
    return (
      <Row className="ItemSwitch">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <TransferAntd
            height={100}
            className={className}
            dataSource={map}
            titles={['Source', 'Target']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            render={item => item.label}
            onSelectChange={this.handleSelectChange}
            onScroll={this.handleScroll}
            onChange={(nextTargetKeys, direction, moveKeys) => {
              const res = this.formatter(nextTargetKeys);

              this.setState({targetKeys: nextTargetKeys});
              console.log('targetKeys: ', nextTargetKeys);
              console.log('direction: ', direction);
              console.log('moveKeys: ', moveKeys);

              if (item.params) {
                if (item.params.required) {
                  this.state.errorMessage = !res ? item.label + I18n('isRequired') : '';
                }
              }
              this.setState({
                errorMessage: this.state.errorMessage,
              });
              onChange(res);
              onError(this.state.errorMessage);
            }}
          />
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}