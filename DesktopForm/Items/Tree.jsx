import React, {Component} from 'react';
import {Row, Col, Icon, Tree as TreeAntd} from 'antd';
import DefaultCol from "./DefaultCol";
import Error from "./Error";
import {I18n} from "foundation";

import "./Tree.scss";

const TreeRoot = 'TREE_ROOT';

export default class Tree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  renderTree = (data, prevKey) => {
    const tpl = [];
    data.forEach((d) => {
      prevKey = prevKey || [];
      const pk = (prevKey.length > 0) ? (prevKey.join('-') + '-' + d.value) : d.value + '';
      if (Array.isArray(d.children)) {
        tpl.push(
          (
            <TreeAntd.TreeNode
              key={pk}
              value={pk}
              title={`${d.label}`}
            >
              {this.renderTree(d.children, pk.split('-'))}
            </TreeAntd.TreeNode>
          )
        );
      } else {
        tpl.push(
          (
            <TreeAntd.TreeNode
              key={pk}
              value={pk}
              title={`${d.label}`}
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
      <Row className="ItemTree">
        <Col {...DefaultCol[col].label} className={`label ${required ? 'required' : ''}`}>
          {item.icon && <Icon className="icon" type={item.icon}/>}
          {item.label && item.label.length > 0 && <label>{item.label}：</label>}
        </Col>
        <Col className="scope" {...DefaultCol[col].item}>
          <TreeAntd
            defaultExpandAll
            multiple
            checkable
            defaultCheckedKeys={temp || []}
            onCheck={(checkKeys) => {
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
          >
            {this.renderTree(map)}
          </TreeAntd>
          {this.state.errorMessage !== '' && <Error message={this.state.errorMessage}/>}
        </Col>
      </Row>
    );
  }
}