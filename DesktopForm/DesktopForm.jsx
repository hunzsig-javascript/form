import React, {Component} from 'react';
import {
  Row,
  Col,
  Alert,
  message,
  Icon,
  Button,
} from 'antd';
import {Xoss} from 'oss';
import './quill.css';

import {Api} from 'api';
import {I18n} from "foundation";

import ItemConst from "./Items/Const";
import ItemString from "./Items/String";
import ItemPassword from "./Items/Password";
import ItemColor from "./Items/Color";
import ItemEmail from "./Items/Email";
import ItemSearch from "./Items/Search";
import ItemSearchText from "./Items/SearchText";
import ItemTextArea from "./Items/TextArea";
import ItemNet from "./Items/Net";
import ItemNumber from "./Items/Number";
import ItemInteger from "./Items/Integer";
import ItemSwitch from "./Items/Switch";
import ItemRadio from "./Items/Radio";
import ItemCheckbox from "./Items/Checkbox";
import ItemCheckboxCol from "./Items/CheckboxCol";
import ItemSelect from "./Items/Select";
import ItemCascader from "./Items/Cascader";
import ItemRegion from "./Items/Region";
import ItemProvincial from "./Items/Provincial";
import ItemMunicipal from "./Items/Municipal";
import ItemDatetime from "./Items/Datetime";
import ItemDate from "./Items/Date";
import ItemTime from "./Items/Time";
import ItemYear from "./Items/Year";
import ItemMonth from "./Items/Month";
import ItemWeek from "./Items/Week";
import ItemDatetimeRange from "./Items/DatetimeRange";
import ItemDateRange from "./Items/DateRange";
import ItemTimeRange from "./Items/TimeRange";
import ItemTree from "./Items/Tree";
import ItemTreeSelect from "./Items/TreeSelect";
import ItemRichQuill from "./Items/RichQuill";
import DefaultCol from "./Items/DefaultCol";

import './DesktopForm.scss';

export default class DesktopForm extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    if (typeof this.props.onRef === 'function') {
      this.props.onRef(this);
    }
    this.state = {
      scope: this.props.form.scope || null,
      align: this.props.form.align || 'left',
      valueFormatter: this.props.form.valueFormatter,
      refresh: this.props.form.refresh,
      operation: this.props.form.operation,
      onChange: this.props.form.onChange,
      onSubmit: this.props.form.onSubmit,
      onSuccess: this.props.form.onSuccess,
      items: this.props.form.items || [],
      values: {},
      nodeShadow: {},
      loading: false,
      errorStatus: this.props.form.defaultErrorStatus || false,
      errorResponse: '',
    };
    this.state.items.forEach((val) => {
      if (Array.isArray(val.values) && val.values.length > 0) {
        val.values.forEach((v) => {
          if (v.value !== null && v.value !== undefined) {
            this.state.values[v.field] = v.value;
          }
          if (v.type === 'region') {
            this.state.values[v.field + '_label'] = '';
          }
        });
      }
    });
    this.state.originValues = JSON.parse(JSON.stringify(this.state.values || {}));
  }

  componentDidMount() {
  }

  formChange = (values) => {
    if (typeof this.state.onChange === 'function') {
      this.state.onChange(values);
    }
  };

  setErrorResponse = (error) => {
    this.setState({
      errorResponse: error,
    });
  };

  setErrorStatus = (errorMessage) => {
    this.setState({
      errorStatus: errorMessage !== '',
    });
  };

  setLoading = (loading) => {
    this.setState({
      loading: loading,
    });
  };

  set = (values) => {
    this.setState({
      originValues: JSON.parse(JSON.stringify(typeof values === 'object' ? values : this.state.values)),
    });
  };

  setItems = (items) => {
    const values = JSON.parse(JSON.stringify(this.state.values));
    items[0].values.forEach((v) => {
      if (values[v.field] === undefined && v.value !== undefined) {
        values[v.field] = v.value;
      }
    });
    this.setState({
      items: items,
      values: values,
    });
  };

  setValues = (values) => {
    this.setState({
      values: values,
    });
  };

  reset = () => {
    this.setState({
      values: JSON.parse(JSON.stringify(this.state.originValues)),
    });
  };

  setField = (field, value) => {
    this.state.values[field] = value;
    this.setValues(this.state.values);
  };

  /**
   * 提交
   */
  formSubmit = () => {
    if (this.state.errorStatus === false) {
      let v = JSON.parse(JSON.stringify(this.state.values));
      if (typeof this.state.valueFormatter === 'function') {
        v = this.state.valueFormatter(v);
        if (typeof v === 'string') {
          this.setErrorResponse(v);
          return;
        }
      }
      console.log('values', v);
      if (typeof this.state.onSubmit === 'function') {
        this.state.onSubmit(v);
      }
      if (this.state.scope !== null) {
        this.setErrorResponse('');
        this.setLoading(true);
        Api.query().real(this.state.scope, v, (res) => {
          this.setLoading(false);
          if (res.code === 200) {
            if (this.state.refresh === true) {
              this.reset();
            } else {
              this.set(this.state.values);
            }
            message.success(res.msg);
            if (typeof this.state.onSuccess === 'function') {
              this.state.onSuccess(res);
            }
          } else {
            this.setErrorResponse(res.msg);
          }
        });
      }
    }
  };

  renderFormItem = (c, item, idx) => {
    c = c < 1 ? 0 : c;
    c = item.col ? item.col : c;
    let tpl = null;
    const required = item.params !== undefined && item.params.required !== undefined && item.params.required === true;
    const align = 'center';
    const size = 'default';
    const col = {
      0: {xxs: 24, xs: 24, s: 24, m: 24, l: 24, xl: 24},
      1: {xxs: 24, xs: 24, s: 24, m: 24, l: 24, xl: 24},
      2: {xxs: 24, xs: 24, s: 24, m: 12, l: 12, xl: 12},
      3: {xxs: 24, xs: 24, s: 24, m: 12, l: 8, xl: 8},
      4: {xxs: 24, xs: 24, s: 24, m: 12, l: 8, xl: 6},
    };
    switch (item.type) {
      case 'hidden':
        tpl = null;
        break;
      case 'const':
      case 'label':
      case 'static':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemConst
              required={required}
              item={item}
              col={c}
              defaultValue={this.state.values[item.field]}
            />
          </Col>
        );
        break;
      case 'search':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemSearch
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              shadowValue={this.state.values[item.field + '_shadow']}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'searchText':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemSearchText
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'text':
      case 'textarea':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemTextArea
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'net':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemNet
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'email':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemEmail
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'color':
      case 'hex':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemColor
              required={required}
              item={item}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'password':
      case 'pwd':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemPassword
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'num':
      case 'number':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemNumber
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'int':
      case 'integer':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemInteger
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'switch':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemSwitch
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'radio':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemRadio
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'checkbox':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemCheckbox
              required={required}
              item={item}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'checkboxCol':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemCheckboxCol
              required={required}
              item={item}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'rating':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <Row>
              <Col {...DefaultCol[c].label} className={`myFormLabel ${required ? 'required' : ''}`}>
                {item.icon && <Icon className="myIcon" type={item.icon}/>}
                {item.name && item.name.length > 0 && <label>{item.name}：</label>}
              </Col>
              <Col {...DefaultCol[c].item} style={styles.formItem}>
                <IceFormBinder type="number" name={item.field}>
                  <Rating
                    className={`fromItemWidth${c} ${item.type}`}
                    size={size}
                    defaultValue={this.state.values[item.field]}
                    {...item.params}
                  />
                </IceFormBinder>
              </Col>
            </Row>
          </Col>
        );
        break;
      case 'select':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemSelect
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'cascader':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemCascader
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[0]);
                  this.state.values[item.field + '_label'] = result[1];
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'region':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemRegion
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[0]);
                  this.state.values[item.field + '_label'] = result[1];
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'provincial':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemProvincial
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[0]);
                  this.state.values[item.field + '_label'] = result[1];
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'municipal':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemMunicipal
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[0]);
                  this.state.values[item.field + '_label'] = result[1];
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'range':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <Row>
              <Col {...DefaultCol[c].label} className={`myFormLabel ${required ? 'required' : ''}`}>
                {item.icon && <Icon className="myIcon" type={item.icon}/>}
                {item.name && item.name.length > 0 && <label>{item.name}：</label>}
              </Col>
              <Col {...DefaultCol[c].item} style={styles.formItem}>
                <IceFormBinder type="array" name={item.field}
                               message={I18n.tr('pleaseChoose') + item.name + I18n.tr('range')}>
                  <Range
                    className={`fromItemWidth${c} ${item.type}`}
                    size={size}
                    defaultValue={this.state.values[item.field]}
                  />
                </IceFormBinder>
                <div><IceFormError name={item.field}/></div>
              </Col>
            </Row>
          </Col>
        );
        break;
      case 'datetime':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemDatetime
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[1]);
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'date':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemDate
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[1]);
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'time':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemTime
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[1]);
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'year':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemYear
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'month':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemMonth
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[1]);
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'week':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemWeek
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[1]);
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'datetimeRange':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemDatetimeRange
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[1]);
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'dateRange':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemDateRange
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[1]);
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'timeRange':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemTimeRange
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={
                (result) => {
                  this.setField(item.field, result[1]);
                }
              }
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'xoss':
      case 'xossImage':
      case 'xossCrop':
      case 'xossDrag':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <Row>
              <Col {...DefaultCol[c].label} className={`myFormLabel ${required ? 'required' : ''}`}>
                {item.icon && <Icon className="myIcon" type={item.icon}/>}
                {item.name && item.name.length > 0 && <label>{item.name}：</label>}
              </Col>
              <Col {...DefaultCol[c].item} style={styles.formItem}>
                <Hoss
                  col={c}
                  item={item}
                  className={`fromItemWidth${c} ${item.type}`}
                  defaultFileList={this.state.values[item.field]}
                  setValue={(values) => {
                    this.state.values[item.field] = values;
                    this.formChange(this.state.values);
                  }}
                />
                <div><IceFormError name={item.field}/></div>
              </Col>
            </Row>
          </Col>
        );
        break;
      /*
      case 'uploadAlioss':
      case 'uploadAliossImage':
      case 'uploadAliossCrop':
      case 'uploadAliossDrag':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <Row>
              <Col {...DefaultCol[c].label} className={`myFormLabel ${required ? 'required' : ''}`}>
                {item.icon && <Icon className="myIcon" type={item.icon} />}
                {item.name && item.name.length > 0 && <label>{item.name}：</label>}
              </Col>
              <Col {...DefaultCol[c].item} style={styles.formItem}>
                <Alioss
                  col={c}
                  item={item}
                  className={`fromItemWidth${c} ${item.type}`}
                  defaultFileList={this.state.values[item.field] || []}
                />
              </Col>
            </Row>
          </Col>
        );
        break;
        */
      case 'tree':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemTree
              required={required}
              item={item}
              col={c}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'treeSelect':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemTreeSelect
              required={required}
              item={item}
              col={c}
              size={size}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'richQuill':
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemRichQuill
              required={required}
              item={item}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
      case 'str':
      case 'string':
      default:
        tpl = (
          <Col key={idx} {...col[c]} align={align}>
            <ItemString
              required={required}
              item={item}
              size={size}
              col={c}
              defaultValue={this.state.values[item.field]}
              onChange={(result) => this.setField(item.field, result)}
              onError={(error) => this.setErrorStatus(error)}
            />
          </Col>
        );
        break;
    }
    return tpl;
  };

  render() {
    return (
      <div className="myform">
        <div>
          {
            this.state.items.map((item, idx) => {
              return (
                <div style={styles.formContent} key={idx}>
                  {item.title && <h2 style={styles.formTitle}>{item.title}</h2>}
                  <Row>
                    {
                      item.values.map((value, iidx) => {
                        return this.renderFormItem(item.col, value, iidx);
                      })
                    }
                  </Row>
                </div>
              );
            })
          }
        </div>
        {
          this.state.errorResponse.length > 0 &&
          <Row style={styles.formItem}>
            <Col {...DefaultCol[this.state.items[0].col || 0].label} className="myFormLabel">&nbsp;</Col>
            <Col {...DefaultCol[this.state.items[0].col || 0].item}>
              <Alert
                message={this.state.errorResponse}
                type="error"
                closable
                afterClose={() => {
                  this.setErrorResponse('');
                }}
                showIcon
              />
            </Col>
          </Row>
        }
        {
          this.state.operation !== undefined && this.state.operation.length > 0 &&
          <Row>
            <Col {...DefaultCol[this.state.items[0].col || 0].label} className="myFormLabel">&nbsp;</Col>
            <Col {...DefaultCol[this.state.items[0].col || 0].item} style={{textAlign: this.state.align}}>
              {
                this.state.operation.map((op, idx) => {
                  let optpl = null;
                  switch (op.type) {
                    case 'submit':
                      optpl = (
                        <Button
                          key={idx}
                          type="primary"
                          onClick={this.formSubmit}
                          disabled={this.state.loading || this.state.errorStatus === true}
                          loading={this.state.loading}
                        >
                          {op.label || I18n.tr('submit')}
                        </Button>
                      );
                      break;
                    case 'reset':
                      optpl = (
                        <Button
                          style={{marginLeft: '3px'}}
                          key={idx}
                          type="default"
                          onClick={this.reset}
                          disabled={this.state.loading}
                          loading={this.state.loading}
                        >
                          {op.label || I18n.tr('reset')}
                        </Button>
                      );
                      break;
                    case 'trigger':
                      optpl = (
                        <Button
                          style={{marginLeft: '3px'}}
                          key={idx}
                          onClick={op.onClick}
                          disabled={this.state.loading}
                          loading={this.state.loading}
                          {...op.params}
                        >
                          {op.label || I18n.tr('trigger')}
                        </Button>
                      );
                      break;
                    default:
                      break;
                  }
                  return optpl;
                })
              }
            </Col>
          </Row>
        }
      </div>
    );
  }
}

const styles = {
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formLabel: {
    minHeight: '32px',
    lineHeight: '32px',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  formItem: {
    position: 'relative',
    minHeight: '32px',
    lineHeight: '32px',
    marginBottom: 15,
  },
  formRich: {
    marginBottom: 15,
  },
  formLabelStatic: {
    minHeight: '40px',
    lineHeight: '32px',
    textAlign: 'left',
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};

