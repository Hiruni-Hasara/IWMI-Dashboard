import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">IWMI</div>

      <ul className="nav-links">

        <li><a href="#hero">Home</a></li>
        <li><a href="#aboutbasin">Basin Overview</a></li>
        <li><a href="#wateravailablecharts">Water Availability</a></li>
        <li><a href="#">Water Balance</a></li>
        <li><a href="#">Monthly Water Balance</a></li>
        <li><a href="#">WA_Indicators</a></li>
        <li><a href="#contact">Contact us</a></li>
      </ul>
    </nav>
  );
}
