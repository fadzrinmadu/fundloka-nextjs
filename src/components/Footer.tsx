export default function Footer() {
  return (
    <footer className="bg-purple-progress py-20 text-white text-lg">
      <div className="container mx-auto">
        <div className="sm:flex mb-4">
          <div className="sm:w-1/2 sm:mt-0 mt-8 h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-footer.svg" alt="" className="mb-3" />
            <p className="font-light">
              Helps people execute their <br />
              bright ideas
            </p>
          </div>
          <div className="sm:w-1/4 h-auto">
            <div className="mb-8 font-bold">Explore</div>
            <ul className="font-light">
              <li className="mb-3">Our Services</li>
              <li className="mb-3">Equity System</li>
              <li className="mb-3">Refund</li>
              <li className="mb-3">Shareholder</li>
            </ul>
          </div>
          <div className="sm:w-1/4 h-auto">
            <div className="mb-8 font-bold">Investor</div>
            <ul className="font-light">
              <li className="mb-3">My Account</li>
              <li className="mb-3">Top Startups</li>
              <li className="mb-3">How-to Tutorials</li>
              <li className="mb-3">Withdrawl</li>
            </ul>
          </div>
          <div className="sm:w-1/4 h-auto">
            <div className="mb-8 font-bold">Office</div>
            <ul className="font-light">
              <li className="mb-3">+021 2208 1996</li>
              <li className="mb-3">KBP, Bandung</li>
              <li className="mb-3">No.12 (Backer)</li>
              <li className="mb-3">support@backer.id</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
