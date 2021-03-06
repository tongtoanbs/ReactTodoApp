import firebase, { firebaseRef, githubProvider } from '../firebase';
import moment from 'moment';

export const setSearchText = (searchText) => ({
  type: 'SET_SEARCH_TEXT',
  searchText
});

export const addTodo = (todo) => ({
  type: 'ADD_TODO',
  todo
});

export const addTodos = (todos) => ({
  type: 'ADD_TODOS',
  todos
});

export const toggleShowCompleted = () => ({
  type: 'TOGGLE_SHOW_COMPLETED'
});

export const updateTodo = (id, updates) => ({
  type: 'UPDATE_TODO',
  id,
  updates
});

export const startAddTodo = (text) => (dispatch, getState) => {
  const todo = {
    text,
    completed: false,
    createdAt: moment().unix(),
    completedAt: null
  };
  const uid = getState().auth.uid;
  const todoRef = firebaseRef.child(`users/${uid}/todos`).push(todo);

  return todoRef.then(() => {
    dispatch(addTodo({
      ...todo,
      id: todoRef.key
    }));
  })
};

export const startToggleTodo = (id, completed) => (dispatch, getState) => {
  const uid = getState().auth.uid;
  const todoRef = firebaseRef.child(`users/${uid}/todos/${id}`);
  const updates = {
    completed,
    completedAt: completed ? moment().unix() : null
  };

  return todoRef.update(updates).then(() => {
    dispatch(updateTodo(id, updates));
  });
};

export const startAddTodos = () => (dispatch, getState) => {
  const uid = getState().auth.uid;

  return firebaseRef.child(`users/${uid}/todos`).once('value').then((snapshot) => {
    const res = snapshot.val();
    const todos = res ? Object.keys(res).map(id => ({
      id,
      ...res[id]
    })) : [];

    dispatch(addTodos(todos));
  });
};

export const startLoging = () => (dispatch, getState) => {
  firebase.auth().signInWithPopup(githubProvider).then((res) => {
    console.log('Auth worked!', res);
  }, (err) => {
    console.log('Unable to auth', err);
  });
};

export const startLogout = () => (dispatch, getState) =>
  firebase.auth().signOut().then(() => console.log('Logged out!'));

export const login = (uid) => ({
  type: 'LOGIN',
  uid
});

export const logout = () => ({
  type: 'LOGOUT'
});