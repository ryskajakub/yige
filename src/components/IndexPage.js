import React from 'react';
import jquery from 'jquery';
import { Form, FormGroup, Button, Label, Input, Col } from 'reactstrap';

export default class IndexPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {english: '', wylie: '', chapter: '', tibetan: ''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {

    const t = this;

    const target = event.target;
    const name = target.name;
    if (name === 'submit') {
        console.log(this.state);
      const data = JSON.stringify(this.state);
      jquery.ajax({
        type: "POST",
        url: "http://localhost:8082/api/word",
        data: data,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
      });
    } else if (name === 'wylie') {
      const savedState = this.state.wylie;
      const addition = (event.key.length === 1) ? event.key : "";
      const current = (event.key === "Backspace") ? savedState.substring(0, savedState.length - 1) : savedState + addition;
      this.setState({
        "wylie": current
      });
      const data = {
        "text": current
      };
      jquery.ajax({
        type: "POST",
        url: "http://localhost:8082/api/transliterate",
        data: JSON.stringify(data),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        complete: function (data) {
          t.setState({
            "tibetan": data.responseText
          })
        }
      })
    } else {
      this.setState({
         [name]: target.value
       });
    }
  }

  render() {
    return (
        <Col xs={{ offset: 4, size: 4 }}>
            <Form>
                <FormGroup>
                    <Label for="wylie">Wylie</Label>
                    <Input size="lg" type="text" name="wylie" id="wylie" placeholder="type in wylie" value={this.state.tibetan} onKeyUp={this.handleChange}  />
                </FormGroup>
                <FormGroup>
                    <Label for="wylie">English</Label>
                    <Input size="lg" type="text" name="english" id="english" placeholder="english"  onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="wylie">Chapter</Label>
                    <Input size="lg" type="text" name="chapter" id="chapter" placeholder="chapter" onChange={this.handleChange}  />
                </FormGroup>
                <Button size="lg" name="submit" onClick={this.handleChange}>Submit</Button>
            </Form>
        </Col>
    );
  }
}