import Link from "next/link";

function Header() {
  return (
    <header className="site-header">
      <div className="header-top">
        <Link href="/" className="header-link">
          Home
        </Link>
        <Link href="/viewNotes" className="header-link">
          Notes
        </Link>
      </div>
<<<<<<< HEAD

      <div className="header-container">
        <div className="logo-container">
          <div className="planner-logo" />
          <div>
            <div className="planner-style">Planner</div>
            <p className="header-subtitle">Keep your work moving</p>
          </div>
        </div>
      </div>
    </header>
  );
=======
    <div className='header-container'>
      <div className='logo-container'>
        <div className='planner-logo'></div>
      <div className='planner-style'>
        Planner
      </div>
      </div>
       <div className='search-button'>
        <input  placeholder="what to search"/>
      <button>
        search
      </button>
      </div>
      </div>
      </div>
      
      
  )
>>>>>>> c4452ab05f5cfc6162c6703c0269fbcb2507176c
}

export default Header
