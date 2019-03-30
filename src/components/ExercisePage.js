import React from 'react';
import jquery from 'jquery';
import { Form, FormGroup, Button, Label, Input, Col } from 'reactstrap';

export default class IndexPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = "begin";
    this.handleChange = this.handleChange.bind(this);
    this.answer = this.answer.bind(this);
  }

  answer(result) {
    const t = this;
    jquery.ajax({
      type: "POST",
      url: "http://localhost:8082/api/answer",
      data: JSON.stringify(t.answer),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      complete: (data) => {
        t.setState(data)
      }
    });
  }

  selectChapter() {
    jquery.ajax({
      type: "POST",
      url: "http://localhost:8082/api/answer",
      data: JSON.stringify({"chapter": event.}),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      complete: (data) => {
        t.setState(data)
      }
    });
  }

  word() {
    return (
      <Col xs={{ offset: 4, size: 4 }}>
        <h1>{{ word }}</h1>
        <Form>
          <FormGroup>
            <Label for="wylie">Wylie</Label>
            <Input size="lg" type="text" name="wylie" id="wylie" placeholder="type in wylie" value={this.state.tibetan} onKeyUp={this.handleChange}  />
          </FormGroup>
          <FormGroup>
            <Label for="wylie">English</Label>
            <Input size="lg" type="text" name="english" id="english" placeholder="english"  onChange={this.handleChange} />
          </FormGroup>
          <Button size="lg" name="submit" onClick={this.answer}>Answer</Button>
        </Form>
      </Col>
    );
  }

  begin() {
    return (
      <Col xs={{ offset: 4, size: 4}}>
        <h1>Select chapter</h1>
        <Form>
          <FormGroup>
            <Label for="chapter">Chapter</Label>
            <Input size="lg" type="text" name="chapter" id="chapter" placeholder="select chapter" onChange={this.selectChapter}  />
          </FormGroup>
          <Button size="lg" name="submit" onClick={this.answer}>Answer</Button>
        </Form>
      </Col>
    );
  }

  end() {
    return(
      <Col xs={{ offset: 4, size: 4}}>
        <h1>Victory!</h1>
      </Col>
    )
  }

  render() {
    switch (this.state) {
      case "begin":
        return begin();
      case "end":
        return end();
      default:
        return word();
    }
  }
}
