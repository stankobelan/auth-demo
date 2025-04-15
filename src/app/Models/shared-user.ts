import { User } from './User';

let currentUser: User | null = null;
let listeners: ((user: User | null) => void)[] = [];

export function getCurrentUser() {
  return currentUser;
}

export function setCurrentUser(user: User | null) {
  currentUser = user;
  listeners.forEach(listener => listener(user));
}

export function onUserChange(listener: (user: User | null) => void) {
  listeners.push(listener);
}
