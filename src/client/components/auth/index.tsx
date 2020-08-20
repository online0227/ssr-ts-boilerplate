import React from 'react';
import { AuthInfo } from '../types/authentication';
import { connect } from 'react-redux';

export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
interface IsAuthenticatedProps {
  user?: AuthInfo
}

const isAuthenticated: React.FC<IsAuthenticatedProps> = (props) => {
  if (props.user.logged === true) {
    return <div>{props.children}</div>;
  } else {
    return null;
  }
};

const isAdmin: React.FC<IsAuthenticatedProps> = (props) => {
  if (props.user.role === 1) {
    return <div>{props.children}</div>;
  } else {
    return null;
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.userInfo
  }
}


export const AuthenticatedWrapper = connect(mapStateToProps)(isAuthenticated)
export const AdminWrapper = connect(mapStateToProps)(isAdmin)