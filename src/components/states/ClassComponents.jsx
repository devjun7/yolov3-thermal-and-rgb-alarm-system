import React, { Component } from 'react'

export default class ClassComponents extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  
  componentDidMout() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
        date: new Date(),
    });
  }
  
    render() {
    return (
      <div>
        <h1>Hello, wolrd!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
