export default function Footer() {
  return (
    <footer className="bg-purple-progress py-20 text-white text-lg">
      <div className="container mx-auto px-5 md:px-8 lg:px-0">
        <div className="md:flex mb-4">
          <div className="md:w-1/2 md:mt-0 mt-8 h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-footer.svg" alt="" className="mb-3" />
            <p className="font-light">
              Helps people execute their <br />
              bright ideas
            </p>
          </div>
          <div className="md:w-1/4 mt-8 md:mt-0 h-auto">
            <div className="mb-8 font-bold">Explore</div>
            <ul className="font-light">
              <li className="mb-3">Our Services</li>
              <li className="mb-3">Equity System</li>
              <li className="mb-3">Refund</li>
              <li className="mb-3">Shareholder</li>
            </ul>
          </div>
          <div className="md:w-1/4 mt-8 md:mt-0 h-auto">
            <div className="mb-8 font-bold">Investor</div>
            <ul className="font-light">
              <li className="mb-3">My Account</li>
              <li className="mb-3">Top Startups</li>
              <li className="mb-3">How-to Tutorials</li>
              <li className="mb-3">Withdrawl</li>
            </ul>
          </div>
          <div className="md:w-1/4 mt-8 md:mt-0 h-auto">
            <div className="mb-8 font-bold">Office</div>
            <ul className="font-light">
              <li className="mb-3">+021 2208 1996</li>
              <li className="mb-3">KBP, Bandung</li>
              <li className="mb-3">No.12 (Fundloka)</li>
              <li className="mb-3">support@fundloka.id</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
