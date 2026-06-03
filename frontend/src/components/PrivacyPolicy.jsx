import './PrivacyPolicy.css';

function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <div className="privacy-card">
        <h1>Privacy Policy</h1>
        <p className="last-updated">
          Last Updated: June 2026
        </p>

        <section>
          <h2>Information We Collect</h2>
          <p>
            When a user selects text or requests webpage analysis using the
            SummAI browser extension, the selected text or webpage content may
            be transmitted to SummAI backend services for processing.
          </p>

          <p>We do not intentionally collect:</p>

          <ul>
            <li>Passwords</li>
            <li>Payment information</li>
            <li>Government identification numbers</li>
            <li>Contact lists</li>
            <li>Browser history unrelated to user requests</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Information</h2>
          <ul>
            <li>Generate summaries</li>
            <li>Generate flowcharts</li>
            <li>Create learning roadmaps</li>
            <li>Improve user experience</li>
          </ul>
        </section>

        <section>
          <h2>Data Storage</h2>
          <p>
            Submitted text may be temporarily processed to generate requested
            results. SummAI does not sell user data to third parties.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            SummAI may use third-party AI providers and cloud infrastructure
            services to process user requests.
          </p>
        </section>

        <section>
          <h2>Data Sharing</h2>
          <p>
            SummAI does not sell personal information. Information may only be
            shared when required by law or to operate the service.
          </p>
        </section>

        <section>
          <h2>Security</h2>
          <p>
            We take reasonable measures to protect information transmitted
            through the service.
          </p>
        </section>

        <section>
          <h2>Children's Privacy</h2>
          <p>
            SummAI is not intended for children under the age of 13.
          </p>
        </section>

        <section>
          <h2>Changes To This Policy</h2>
          <p>
            This Privacy Policy may be updated periodically. Updates will be
            posted on this page.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Email: varshitcoding@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;