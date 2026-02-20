import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      

      <ul className="nav-links">

        <li><a href="#">Basin Overview</a></li>
        <li><a href="#">Water Availability</a></li>
        <li><a href="#">Water Balance</a></li>
        <li><a href="#">Monthly Water Balance</a></li>
        <li><a href="#">WA_Indicators</a></li>
        <li><a href="#contact">Contact us</a></li>
      </ul>
    </nav>
  );
}
