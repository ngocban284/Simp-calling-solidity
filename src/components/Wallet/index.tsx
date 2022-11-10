// connect wallet component
import { connectWallet } from "../../utils";
import { useMetaMask } from "metamask-react";

import { ethers } from "ethers";

declare const window: any;

const ConnectWallet: React.FC = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  return (
    <div className="connect-wallet">
      <div className="connect-wallet__button">
        {status == "connected" ? (
          <button className="button button--hover" onClick={connect}>
            {account}
          </button>
        ) : (
          <button className="button button--hover" onClick={connect}>
            {" "}
            Connect Wallet{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
