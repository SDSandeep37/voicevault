import {
  FaCloudUploadAlt,
  FaFacebookF,
  FaLinkedinIn,
  FaLock,
  FaMicrophone,
  FaShieldAlt,
  FaTwitter,
} from "react-icons/fa";
import { LuAudioLines, LuClock3 } from "react-icons/lu";
import "./landingPage.css";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <LuAudioLines />,
    label: "Advanced Speech-to-Text",
    className: "feature-blue",
  },
  {
    icon: <FaShieldAlt />,
    detailIcon: <FaLock />,
    label: "Secure Cloud Storage",
    className: "feature-shield",
  },
  {
    icon: <LuClock3 />,
    label: "Access Anytime",
    className: "feature-clock",
  },
];

const footerLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Support",
  "Contact Us",
];

const LandingPage = () => {
  return (
    <div className="voicevault-page">
      <header className="vv-navbar">
        <a className="vv-brand" href="#">
          <img src="/icon.png" alt="VoiceVault logo" />
          <span>
            Voice<span>Vault</span>
          </span>
        </a>

        <nav className="vv-nav-links" aria-label="Primary navigation">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Login</a>
          <Link to="/action">
            <button type="button">Get Started</button>
          </Link>
        </nav>
      </header>

      <main className="vv-hero">
        <section className="vv-hero-copy" aria-labelledby="voicevault-heading">
          <h1 id="voicevault-heading">
            Transcribe <span>Your Voice,</span>
            <br />
            Securely Stored
          </h1>

          <p>Convert speech to text quickly and securely with VoiceVault.</p>

          <div className="vv-actions">
            <Link to="/action">
              <button className="vv-action upload" type="button">
                <FaCloudUploadAlt />
                Upload Audio
              </button>
            </Link>
            <Link to="/action">
              <button className="vv-action record" type="button">
                <FaMicrophone />
                Record Voice
              </button>
            </Link>
          </div>

          <div className="vv-feature-row" aria-label="VoiceVault features">
            {features.map((feature) => (
              <article
                className={`vv-feature ${feature.className}`}
                key={feature.label}
              >
                <div className="vv-feature-icon">
                  {feature.icon}
                  {feature.detailIcon && (
                    <span className="vv-feature-detail">
                      {feature.detailIcon}
                    </span>
                  )}
                </div>
                <h2>{feature.label}</h2>
              </article>
            ))}
          </div>

          <p className="vv-tagline">Your Voice, Safely Transcribed.</p>
        </section>

        {/* <section
          className="vv-hero-art"
          aria-label="VoiceVault secure transcription"
        >
          <img
            src="/banner.png"
            alt="Secure voice transcription illustration"
          />
        </section> */}
      </main>

      <footer className="vv-footer">
        <nav className="vv-footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <a href="#" key={link}>
              {link}
            </a>
          ))}
        </nav>

        <div className="vv-socials" aria-label="Social links">
          <a href="#" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="#" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
