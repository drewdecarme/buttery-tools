import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>Welcome to the About Page.</p>
      <Link to="/"> go home</Link>
    </div>
  );
};

export default About;
