import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Meteor } from 'meteor/meteor';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }
  handleSubmit(event){
    event.preventDefault();
    // console.log(Tasks);
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    // Tasks.insert({
    //   text,
    //   createAt: new Date(),
    //   owner: Meteor.userId(),
    //   username: Meteor.user().username,
    // });
    Meteor.call('tasks.insert', text);

    ReactDOM.findDOMNode(this.refs.textInput).value='';
  }

  toggleHideCompleted(){
      this.setState({
        hideCompleted: !this.state.hideCompleted,
      });
  }

  renderTasks(){
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render(){
    return(
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})({this.props.abc})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
             <input
               type="text"
               ref="textInput"
               placeholder="Type to add new tasks"
             />
           </form> :''
          }

        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  abc: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({checked: { $ne: true } }).count(),
    abc: 100,
    currentUser: Meteor.user(),
  };
}, App);
