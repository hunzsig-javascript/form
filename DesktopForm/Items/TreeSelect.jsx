import React, {Component} from 'react';
import {Row, Col, Icon, TreeSelect as TreeSelectAntd} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./TreeSelect.scss";

const TreeRoot = 'TREE_ROOT';

export default class TreeSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  renderTreeSelect = (data, prevKey) => {
    const tpl = [];
    data.forEach((d) => {
      prevKey = prevKey || [];
      const pk = (prevKey.length > 0) ? (prevKey.join('-') + '-' + d.value) : d.value + '';
      if (Array.isArray(d.children)) {
        tpl.push(
          (
            <TreeSelectAntd.TreeNode
              key={pk}
              value={pk}
              title={`${d.label}`}
            >
              {this.renderTreeSelect(d.children, pk.split('-'))}
            </TreeSelectAntd.TreeNode>
          )
        );
      } else {
        tpl.push(
          (
            <TreeSelectAntd.TreeNode
              key={pk}
              value={pk}
              title={`${d.label}`}
              isLeaf
            />
          )
        );
      }
    });
    return tpl.map((t) => {
      return t;
    });
  };


  render() {
    const required = this.props.required;
    const item = this.props.item;
    const col = this.props.col;
    const size = this.props.size;
    const className = `col${col} slice` + (this.state.errorMessage !== '' ? ' error' : '');
    const onChange = this.props.onChange;
    const onError = this.props.onError;
    // 如果是tree，整个根
    let map = [{
      value: TreeRoot,
      label: I18n('CHOOSE_ALL'),
      children: JSON.parse(JSON.stringify(map)),
    }];
    let temp = null;
    if (Array.isArray(item.value)) {
      temp = JSON.parse(JSON.stringify(item.value));
      temp.forEach((v, idx) => {
        temp[idx] = TreeRoot + '-' + v;
      });
    } else {
      temp = [];
    }
    return (
      <Row className="ItemTreeSelect">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <TreeSelectAntd
            showSearch
            allowClear
            treeDefaultExpandAll
            defaultValue={item.value}
            treeCheckable={item.treeCheckable === undefined}
            showCheckedStrategy={TreeSelectAntd.SHOW_PARENT}
            className={className}
            size={size}
            placeholder={I18n('PLEASE_CHOOSE') + item.name}
            searchPlaceholder={I18n('PLEASE_CHOOSE') + item.name}
            multiple
            defaultCheckedKeys={item.value || []}
            onChange={(checkKeys) => {
              const ckData = JSON.parse(JSON.stringify(checkKeys));
              const nckData = [];
              ckData.forEach((ck) => {
                const nck = ck.replace(TreeRoot + '-', '').replace(TreeRoot, '');
                if (nck.length > 0) {
                  nckData.push(nck);
                }
              });
              if (item.params) {
                if (item.params.required) {
                  this.state.errorMessage = !nckData ? item.label + I18n('IS_REQUIRED') : '';
                }
              }
              this.setState({
                errorMessage: this.state.errorMessage,
              });
              onChange(nckData);
              onError(this.state.errorMessage);
            }}
            {...item.params}
          >
            {this.renderTreeSelect(map)}
          </TreeSelectAntd>
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}