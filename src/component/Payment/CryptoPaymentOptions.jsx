import { useState, useEffect } from "react";
import {
  FaSync,
  FaArrowLeft,
  FaArrowRight,
  FaExclamationTriangle,
  FaDollarSign,
} from "react-icons/fa";
import { IoLogoBitcoin } from "react-icons/io5";
import { SiEthereum, SiTether } from "react-icons/si";
import styles from "./Payment.module.css";

// ── Supported cryptos (without BNB) ──────────────────────────────
const CRYPTO_OPTIONS = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    icon: <IoLogoBitcoin />,
    color: "#F7931A",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    icon: <SiEthereum />,
    color: "#627EEA",
  },
  {
    id: "tether",
    symbol: "USDT",
    name: "Tether (ERC20)",
    icon: <SiTether />,
    color: "#26A17B",
  },
  {
    id: "usd-coin",
    symbol: "USDC",
    name: "USD Coin",
    icon: <FaDollarSign />, // reliable fallback for USDC
    color: "#2775CA",
  },
];

// ── Currency symbols ──────────────────────────────────────────────
const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  KES: "KSh",
  GHS: "₵",
  ZAR: "R",
  UGX: "USh",
  CAD: "CA$",
  AUD: "A$",
  JPY: "¥",
  CNY: "¥",
  SGD: "S$",
  MYR: "RM",
};

function fmt(amount, currency) {
  const c = currency || "NGN";
  const n = Number(amount || 0);
  const symbol = CURRENCY_SYMBOLS[c] || (c ? c + " " : "₦");
  return `${symbol}${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function CryptoPaymentOptions({
  amount,
  currency,
  onSelect,
  onBack,
}) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchRates = async () => {
    setLoading(true);
    setError("");
    try {
      const ids = CRYPTO_OPTIONS.map((c) => c.id).join(",");
      const vsCurrency = currency?.toLowerCase() || "ngn";
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vsCurrency}`,
      );
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error(
            `Currency "${currency}" is not supported by the exchange rate service.`,
          );
        }
        throw new Error("Failed to fetch rates");
      }
      const data = await res.json();
      setRates(data);
    } catch (err) {
      setError(
        err.message || "Could not load exchange rates. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, [currency]);

  const handleSelect = (cryptoId) => setSelected(cryptoId);

  const handleConfirm = () => {
    if (selected) {
      const crypto = CRYPTO_OPTIONS.find((c) => c.id === selected);
      if (crypto) {
        const vsCurrency = currency?.toLowerCase() || "ngn";
        const rate = rates?.[crypto.id]?.[vsCurrency];
        const cryptoAmount = rate ? Number(amount) / rate : 0;
        onSelect({
          symbol: crypto.symbol,
          amount: cryptoAmount,
          rate: rate,
          id: crypto.id,
          name: crypto.name,
          color: crypto.color,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.card}>
        <p className={styles.cardTitle}>Loading exchange rates…</p>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <p className={styles.errorMsg}>{error}</p>
        <button className={styles.ghostBtn} onClick={fetchRates}>
          Retry
        </button>
        <button
          className={styles.ghostBtn}
          onClick={onBack}
          style={{ marginLeft: 8 }}
        >
          ← Go back
        </button>
      </div>
    );
  }

  const fiatAmount = Number(amount);
  const vsCurrency = currency?.toLowerCase() || "ngn";

  return (
    <div className={styles.card}>
      <div className={styles.rateHeader}>
        <p className={styles.cardTitle}>Choose your crypto</p>
        <button className={styles.refreshBtn} onClick={fetchRates}>
          <FaSync /> Refresh rates
        </button>
      </div>
      <p className={styles.rateSub}>
        You need to send <strong>{fmt(fiatAmount, currency)}</strong>
      </p>
      <div className={styles.cryptoGrid}>
        {CRYPTO_OPTIONS.map((crypto) => {
          const rate = rates?.[crypto.id]?.[vsCurrency];
          const cryptoAmount = rate ? fiatAmount / rate : 0;
          const isSelected = selected === crypto.id;
          return (
            <div
              key={crypto.id}
              className={`${styles.cryptoCard} ${isSelected ? styles.cryptoCardSelected : ""}`}
              onClick={() => handleSelect(crypto.id)}
              style={{ borderColor: isSelected ? crypto.color : "transparent" }}
            >
              <div
                className={styles.cryptoLogo}
                style={{ color: crypto.color }}
              >
                {crypto.icon}
              </div>
              <div className={styles.cryptoInfo}>
                <span className={styles.cryptoSymbol}>{crypto.symbol}</span>
                <span className={styles.cryptoName}>{crypto.name}</span>
              </div>
              <div className={styles.cryptoRate}>
                {rate ? (
                  <>
                    <span className={styles.cryptoAmount}>
                      {cryptoAmount.toFixed(6)}
                    </span>
                    <span className={styles.cryptoPrice}>
                      1 {crypto.symbol} = {fmt(rate, currency)}
                    </span>
                  </>
                ) : (
                  <span className={styles.cryptoUnavailable}>
                    <FaExclamationTriangle /> Rate unavailable
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.cryptoActions}>
        <button className={styles.ghostBtn} onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
        <button
          className={styles.payBtn}
          disabled={!selected}
          onClick={handleConfirm}
          style={{ background: "#F7931A" }}
        >
          Confirm & Proceed <FaArrowRight />
        </button>
      </div>
      <p className={styles.secureNote}>
        <FaSync /> Exchange rates update automatically every 60 seconds.
      </p>
    </div>
  );
}
