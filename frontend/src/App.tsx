import React, { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";

export default function SwapBox() {
  const [amount, setAmount] = useState("");

  return (
    <div className="flex flex-col items-center bg-black text-white p-6 rounded-2xl shadow-lg w-[400px]">
      <h1 className="text-xl font-bold mb-4">Thalaivar DEX</h1>

      {/* Wallet Connect Button */}
      <ConnectWallet />

      {/* Amount Input */}
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="mt-4 p-2 w-full text-black rounded"
      />

      {/* Get Quote Button */}
      <button className="bg-blue-500 mt-4 px-4 py-2 rounded-lg w-full">
        Get Quote
      </button>

      {/* Placeholder for Quote Result */}
      <div className="mt-4 p-2 bg-gray-800 rounded w-full text-sm">
        Best Router: —
        <br />
        Output: —
      </div>

      {/* Swap Button */}
      <button className="bg-purple-600 mt-4 px-4 py-2 rounded-lg w-full">
        Swap
      </button>
    </div>
  );
}
