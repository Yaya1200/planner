import Link from "next/link";

function Header() {
  return (
    <header className="site-header">
      <div className="header-top">
        <Link href="/" className="header-link">
          Board
        </Link>
        <Link href="/viewNotes" className="header-link">
          Notes
        </Link>
      </div>

      <div className="header-container">
        <div className="logo-container">
          <div className="planner-logo" />
          <div>
            <div className="planner-style">Planner</div>
            <p className="header-subtitle">Keep your work moving with calm focus.</p>
          </div>
        </div>
        <div className="header-badge">Daily focus mode</div>
      </div>
    </header>
  );
}

export default Header;
