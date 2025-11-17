// import "./index.scss";
// import logo from "../../assets/png/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
const AdminFooter = () => {
  return (
    <footer className=" py-10">
      

      <div className=" pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Organic Store. All rights reserved.
      </div>
    </footer>
  );
};

export default AdminFooter;
