import React from 'react'

function Header() {
  return (
    <div >
      <div style={{display:'flex', gap:"20px", justifyContent:"flex-end", margin:"10px"}}>
      <a href='/' className='header-link'>Home</a>
      <a href='viewNotes' className='header-link'>Note</a>
      </div>
    <div className='header-container'>
      <div className='logo-container'>
        <div className='planner-logo'></div>
      <div className='planner-style'>Planner</div>
      </div>
       <div className='search-button'>
        <input  placeholder="what to search"/>
      <button>search</button>
      </div>
      </div>
      </div>
      
      
  )
}

export default Header