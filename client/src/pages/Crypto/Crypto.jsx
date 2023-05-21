import { useState, useEffect } from "react";
import Loader from "../../components/Loader/Loader";
import { getCrypto } from "../../api/external";
import styles from "./Crypto.module.css";

function Crypto() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // IIFE: immediately invoked function expression
    (async function cryptoApiCall() {
      const response = await getCrypto();
      console.log("====>",response);
      setData(response.data);
    })();

    // Cleanup
    setData([]);
  }, []);

  if (data.length === 0) {
    return <Loader text="crytocurrenices" />;
  }

  const negativeStyle = {
    color: "#ea3943",
  };

  const positiveStyle = {
    color: "#16c784",
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.head}>
          <th>#</th>
          <th>Coin</th>
          <th>Symbol</th>
          <th>Price($)</th>
          <th>Market Capital($)</th>
          <th>24h</th>
        </tr>
      </thead>
      <tbody>
        {data.map((coin) => (
          <tr id={coin.id} className={styles.tableRow}>
            <td>{coin.rank}</td>
            <td>
              <div className={styles.logo}>
               {coin.name}
              </div>
            </td>
            <td>
              <div className={styles.symbol}>{coin.symbol}</div>
            </td>
            <td>{coin.priceUsd}</td>
            <td>{coin.marketCapUsd}</td>
            <td
              style={
                coin.changePercent24Hr < 0
                  ? negativeStyle
                  : positiveStyle
              }
            >
              {coin.changePercent24Hr}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Crypto;
