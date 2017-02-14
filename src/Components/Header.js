import React from 'react'

import '../Styles/Components/Header.css'

const Header = ({logOut}) => {

    return(
        <div className="header">
            <button  onClick={() => logOut()}>Log Out</button>
        </div>
    )
}

export default Header