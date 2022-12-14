import React from "react";

import Logo from "../Logo";
import ConnectWallet from "../Wallet";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__logo">
          <a href="" target="_blank" rel="noreferrer nofollower">
            <Logo />
          </a>
        </div>
        <ConnectWallet />
      </div>
    </header>
  );
};

export default Header;
