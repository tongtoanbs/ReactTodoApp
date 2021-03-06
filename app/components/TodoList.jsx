import React, { PropTypes } from 'react';
import Todo from './Todo';
import { connect } from 'react-redux';
import TodoApi from '../api/TodoAPI';

export const TodoList = React.createClass({
  propTypes: {
    todos: PropTypes.array.isRequired,
    showCompleted: PropTypes.bool,
    searchText: PropTypes.string
  },
  render() {
    const { todos, showCompleted, searchText } = this.props;
    const renderTodos = () => {
      const filteredTodos = TodoApi.filterTodos(todos, showCompleted, searchText);

      if (filteredTodos.length === 0) {
        return (
          <p className="container__message">Nothing To Do</p>
        );
      }

      return filteredTodos.map((todo) => {
        return <Todo key={todo.id} {...todo}/>;
      });
    };

    return (
      <div>
        {renderTodos()}
      </div>
    );
  }
});

const mapStateToTodoListProps = (state) => state;

export default connect(
  mapStateToTodoListProps
)(TodoList);