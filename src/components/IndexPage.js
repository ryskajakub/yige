import React from 'react';
import jquery from 'jquery';
import { Form, FormGroup, Button, Label, Input, Col } from 'reactstrap';

export default class IndexPage extends React.Component {

  constructor(props) {
    super(props);
    this.defaultState = {english: '', wylie: '', tibetan: '', newChapter: ''};
    this.state = this.defaultState;
    this.handleChange = this.handleChange.bind(this);
    this.selectChapter = this.selectChapter.bind(this);
    this.select = this.select.bind(this);
    this.newChapter = this.newChapter.bind(this);
    const t = this;
    jquery.ajax({
      type: "GET",
      url: "http://localhost:8082/api/chapter",
      dataType:"json",
      complete: (data) => {
        t.setState({
          "chapters": data.responseJSON,
          "selectedChapter": data.responseJSON[0].name
        });
      }
    });
  }

  newChapter(event) {
    this.setState({
      'newChapter': event.target.value
    });
  }

  selectChapter(event) {
    this.setState({
      'selectedChapter': event.target.value
    });
  }

  select(event) {
    if (this.state.newChapter === undefined || this.state.newChapter === '') {
      this.setState({'chapter': this.state.selectedChapter});
    } else {
      this.setState({'chapter': this.state.newChapter});
    }
  }

  handleChange(event) {

    const t = this;

    const target = event.target;
    const name = target.name;
    if (name === 'submit') {
      const data = JSON.stringify(this.state);
      jquery.ajax({
        type: "POST",
        url: "http://localhost:8082/api/word",
        data: data,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        complete: (data) => {
          t.setState(t.defaultState);
        }
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
          });
        }
      });
    } else {
      this.setState({
         [name]: target.value
       });
    }
  }

  render() {
    if (this.state.chapter === undefined) {
      return (
          <Col xs={{ offset: 4, size: 4 }}>
              <Form>
                  <FormGroup>
                      <Label for="new_chapter">New Chapter</Label>
                      <Input size="lg" type="text" name="chapter" id="new_chapter" placeholder="chapter" value={this.state.newChapter} onChange={this.newChapter}  />
                  </FormGroup>
                  <FormGroup>
                      <Label for="existing_chapter">Existing Chapter</Label>
                      <Input size="lg" type="select" name="existing_chapter" id="existing_chapter" onChange={this.selectChapter}>
                          {
                            ((this.state.chapters === undefined) ? "" : (
                              this.state.chapters.map((value, index) => {
                                return <option key={value.name} value={value.name}>{value.name}</option>
                              })
                            ))
                          }
                      </Input>
                  </FormGroup>
                  <Button size="lg" name="submit" onClick={this.select}>Select</Button>
              </Form>
          </Col>
      );
    } else {
      return (
          <Col xs={{ offset: 4, size: 4 }}>
              <Form>
                  <FormGroup>
                      <Label for="chapter">Chapter</Label>
                      <Input type="text" disabled={true} value={this.state.chapter} />
                  </FormGroup>
                  <FormGroup>
                      <Label for="wylie">Wylie</Label>
                      <Input size="lg" type="text" name="wylie" id="wylie" placeholder="type in wylie" value={this.state.tibetan} onKeyUp={this.handleChange}  />
                  </FormGroup>
                  <FormGroup>
                      <Label for="english">English</Label>
                      <Input size="lg" type="text" name="english" id="english" placeholder="english" value={this.state.english} onChange={this.handleChange} />
                  </FormGroup>
                  <Button size="lg" name="submit" onClick={this.handleChange}>Submit</Button>
              </Form>
          </Col>
      );
    }
  }
}