"use client";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";

export default function LoginPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🔐 Authentication</h1>

      {isConnected ? (
        <>
          <p>✅ Wallet connected: {address}</p>
          <button onClick={() => router.push("/")}>Continue</button>
        </>
      ) : (
        <>
          <p>⚠️ Please connect your wallet</p>
          <w3m-button></w3m-button>
          <button
            disabled={isPending}
            onClick={() => connect({ connector: connectors[0] })}
          >
            {isPending ? "Connecting..." : "Connect Wallet"}
          </button>
        </>
      )}
    </main>
  );
}
