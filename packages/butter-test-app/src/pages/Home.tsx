import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  console.log("hello");
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page.</p>
      <Link to="/about"> go about</Link>
    </div>
  );
};

export default Home;
