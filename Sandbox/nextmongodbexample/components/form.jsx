import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {}, errors: {} };
    this.schemaName = "";
  }

  validate = () => {
    // Validates entire input
    const options = {
      abortEarly: false,
    };

    const { error } = Joi.validate(this.state.data, this.schema, options); // First arg is what we want to validate , second is the schema, third is options
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validateProperty = ({ name, value }) => {
    console.log("validate property called");

    this.schemaName = name;
    // Validates each property i.e. each character
    const obj = { [name]: value }; // What ever the name is at run time is set here
    const schema = { [name]: this.schema[name] }; // Selct schema dependant on what input field is being validate
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    console.log("handleSubmit called");
    e.preventDefault(); // Prevent default of an event i.e. a full page reload from server

    const errors = this.validate();
    this.setState({ errors: errors || {} }); // Set to errors object OR empty object
    if (errors) return; // Return immediately if htere are no erros and don't call server

    this.doSubmit();
  };

  handleChange = (e) => {
    console.log("handleChage called");

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    // If error message is truthy then store it in the errors object
    else delete errors[e.currentTarget.name];

    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value; // Get name and value properties from input object below
    this.setState({ data, errors });
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input // Can add new porperties dynamicaly here with out adding to the input.jsx file (using ...rest)
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
