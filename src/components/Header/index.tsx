import React from "react";

import Logo from "../Logo";
import ConnectWallet from "../Wallet";
import "./Header.css";

interface HeaderProps {
  walletAddress: string;
}

const Header: React.FC<HeaderProps> = ({ walletAddress }) => {
  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__logo">
          <a href="" target="_blank" rel="noreferrer nofollower">
            <Logo />
          </a>
        </div>
        <ConnectWallet walletAddress={walletAddress} />
      </div>
    </header>
  );
};

export default Header;
