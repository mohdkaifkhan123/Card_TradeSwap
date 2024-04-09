import gitHubMark from "../assets/github-mark.png";
import "./footer.css";

function Footer() {
  return (
    <div className="footerBody">
      <div className="nameContainer">
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <p>Mohd Kaif Khan</p>
        </a>
        
      </div>

      <a
        href=""
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={gitHubMark}
          alt="GitHub Mark"
          style={{ width: "50px", height: "50px", margin: "20px" }}
        />
      </a>
     
    </div>
  );
}

export default Footer;
