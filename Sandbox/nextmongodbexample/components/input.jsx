import React, { Component } from "react";

const Input = ({ name, label, error, ...rest }) => {
  // ...rest gets the rest of the properties from the props object
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input {...rest} id={name} name={name} className="form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
