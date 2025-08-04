"use client";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { Wallet, Shield, ArrowRight, Loader2 } from "lucide-react";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.backgroundDecoration}>
        <div className={styles.blurCircleTop}></div>
        <div className={styles.blurCircleBottom}></div>
      </div>

      {/* Main card */}
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          {/* Header section */}
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <Shield className={styles.icon} />
            </div>
            
            <h1 className={styles.title}>
              Secure Access
            </h1>
            <p className={styles.subtitle}>
              Connect your wallet to access the application
            </p>
          </div>

          {/* Content section */}
          <div className={styles.content}>
            {isConnected ? (
              <div className={styles.connectedState}>
                {/* Success state */}
                <div className={styles.successBox}>
                  <div className={styles.successHeader}>
                    <div className={styles.checkIcon}>
                      <svg className={styles.checkSvg} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className={styles.successText}>Wallet Connected</span>
                  </div>
                  <p className={styles.addressText}>
                    {truncateAddress(address)}
                  </p>
                </div>

                {/* Continue button */}
                <button
                  onClick={() => router.push("/")}
                  className={styles.continueButton}
                >
                  <span>Continue to App</span>
                  <ArrowRight className={styles.arrowIcon} />
                </button>
              </div>
            ) : (
              <div className={styles.disconnectedState}>
                {/* Connection prompt */}
                <div className={styles.warningBox}>
                  <div className={styles.warningHeader}>
                    <Wallet className={styles.walletIcon} />
                    <span className={styles.warningText}>Wallet Required</span>
                  </div>
                  <p className={styles.warningSubtext}>
                    Please connect your Web3 wallet to continue
                  </p>
                </div>

                {/* Connection buttons */}
                <div className={styles.buttonGroup}>
                  {/* Web3Modal button */}
                  <div className={styles.web3ModalWrapper}>
                    <w3m-button />
                  </div>

                  {/* Alternative connect button */}
                  <button
                    disabled={isPending}
                    onClick={() => connect({ connector: connectors[0] })}
                    className={`${styles.connectButton} ${isPending ? styles.connectButtonDisabled : ''}`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className={styles.spinnerIcon} />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className={styles.buttonWalletIcon} />
                        <span>Connect Wallet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer text */}
        <p className={styles.footer}>
          Secured by blockchain technology
        </p>
      </div>
    </div>
  );
}