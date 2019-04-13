import React from 'react';
import jquery from 'jquery';
import { Form, FormGroup, Button, Label, Input, Col, Progress, Badge } from 'reactstrap';

export default class IndexPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      "page": "begin"
    };
    const t = this;
    this.answer = this.answer.bind(this);
    this.handleChapter = this.handleChapter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.selectChapter = this.selectChapter.bind(this);
    this.answerEnter = this.answerEnter.bind(this);
    this.again = this.again.bind(this);
    jquery.ajax({
      type: "GET",
      url: "http://localhost:8082/api/chapter",
      dataType:"json",
      complete: (data) => {
        t.setState({
          "chapters": data.responseJSON
        });
        this.setState({
          "chapter": data.responseJSON[0].name
        });
      }
    });
  }

  handleChange(event) {

    event.preventDefault();

    const t = this;
    const target = event.target;
    const name = target.name;

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

  }

  handleChapter(e) {
    this.setState({
      "chapter": e.target.value
    });
  }

  selectChapter() {
    const t = this;
    jquery.ajax({
      type: "POST",
      url: "http://localhost:8082/api/selectChapter",
      data: JSON.stringify({"chapter": t.state.chapter}),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      complete: (data) => {
        t.setState(data.responseJSON)
        t.setState({
          "page": "word",
          "wylie": "",
          "tibetan": ""
        });
      }
    });
  }

  answer() {
    const t = this;
    t.setState({"tibetanAnswer": undefined});
    jquery.ajax({
      type: "POST",
      url: "http://localhost:8082/api/answer",
      data: JSON.stringify({"text": t.state.tibetan}),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      complete: (data) => {
        if (data.status < 300) {
          if (data.responseJSON === undefined) {
            t.setState({"page": "end"});
          } else {
            t.setState(data.responseJSON);
            t.setState({
              "wylie": "",
              "tibetan": ""
             });
          }
        }
      }
    });
  }

  answerEnter(event) {
    event.preventDefault();
    if (event.key === "Enter") {
      this.answer();
    }
  }

  safelyDivide(finished, total) {
    return (finished >= 0 && total > 0 ? finished / total / 0.01 : 0);
  }

  displayProgress(finished, total) {
    const f = finished >= 0 ? finished : 0;
    const t = total >= 0 ? total : 0;
    return f + "/" + t;
  }

  word() {
    return (
      <Col xs={{ offset: 4, size: 4 }}>
        <Progress value={this.safelyDivide(this.state.total - this.state.remaining, this.state.total)}>
          { this.displayProgress(this.state.total - this.state.remaining, this.state.total) }
        </Progress>
        <h1> { this.state.english } </h1>
        <Form>
          { (this.state.tibetanAnswer === undefined) ? "" :
          <h2>Correct answer: {this.state.tibetanAnswer} </h2>
          }
          <FormGroup>
            <Label for="wylie">Wylie</Label>
            <Input autoComplete="off" size="lg" type="text" name="wylie" id="wylie" placeholder="type in wylie" value={this.state.tibetan} onKeyUp={this.handleChange} onKeyPress={this.answerEnter} />
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
            {
              (this.state.chapters === undefined) ? ( <div></div> ) : (
              <Input type="select" name="chapter" id="chapter" onChange={this.handleChapter}>
              {
                this.state.chapters.map((value, index) => {
                  return <option key={value.name} value={value.name}>{value.name}</option>
                })
              }
             </Input>
              )
            }
          </FormGroup>
          <Button size="lg" name="submit" onClick={this.selectChapter}>Select</Button>
        </Form>
      </Col>
    );
  }

  again() {
    this.setState({
      "page": "begin",
      "chapter": this.state.chapters[0].name,
      "tibetan" : ""
    });
  }

  end() {
    return(
      <Col xs={{ offset: 4, size: 4}}>
        <h1>Victory!</h1>
        <Button color="primary" onClick={this.again}>Try again</Button>
      </Col>
    )
  }

  render() {
    switch (this.state.page) {
      case "begin":
        return this.begin();
      case "end":
        return this.end();
      default:
        return this.word();
    }
  }
}
