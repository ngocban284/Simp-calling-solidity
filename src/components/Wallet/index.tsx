// connect wallet component
import { connectWallet } from "../../utils";
import { useMetaMask } from "metamask-react";

interface ConnectWalletProps {
  walletAddress: string;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ walletAddress }) => {
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
