import React, { Component } from 'react';
import axios from 'axios';

export default class AddTreasure extends Component {
  constructor() {
    super();
    this.state = {
      treasureURL: '',
    };
  }

  handleInput(e) {
    this.setState({ treasureURL: e.target.value });
  }

  addTreasure() {
    const {treasureURL} = this.state
    axios.post('/api/treasure/user', {treasureURL})
    .then(treasure => {
      this.props.addMyTreasure(treasure.data)
      this.setState({treasureURL: ''})
    })
    .catch(err => {
      alert(err.response.request.response)
    })
    // post to /api/treasure/user here
  }

  render() {
    return (
      <div className="addTreasure">
        <input
          type="text"
          placeholder="Add image URL"
          onChange={e => this.handleInput(e)}
          value={this.state.treasureURL}
        />
        <button onClick={() => this.addTreasure()}>Add</button>
      </div>
    );
  }
}
