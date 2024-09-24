import React, { useState, useEffect, useMemo } from "react";
import Web3 from "web3";
import "./App.css";

function App() {
  const web3 = new Web3(
    "https://mainnet.infura.io/v3/dd15c4aaac164cb59e308e5a44ec663f",
  );
  const APIKEY = "KTTDBPYURM7YVBFS9R59562E7PVW4P7CU3";

  const [balance, setBalance] = useState();
  const [wannasend, setWannasend] = useState();
  const [address, setAddress] = useState();
  const [recommended, setRecommended] = useState()
  const [decimalBal, setDecimalBal] = useState();
  const [to, setTo] = useState();
  const [gas, setGas] = useState()
  const [slicedAddress, setSlicedAddress] = useState();
  const [PK, setPK] = useState();
  const [inPK, setInPK] = useState();
  const [amount, setAmount] = useState()
  const [details, setDetails] = useState(false)
  const [txhis, setTxhis] = useState([])

  async function setBalances() {
    setBalance(await getBalances(address));
  }

  useEffect(() => {
    async function a() {
      await setBalances();
    }
    a();
  });

  useEffect(() => {
    try {
      setSlicedAddress(`${address.slice(0, 5)}...${address.slice(-5)}`);
    } catch (e) { }
  }, [address]);

  useEffect(() => {
    try {
      setDecimalBal(`${balance.toFixed(5)}`);
    } catch (e) { }
  }, [balance]);

  useEffect( () => {
    async function f() {
      setRecommended(await getGasPrices())
      setGas((await getGasPrices()) / 1000000000)
    }
    f()
    if (
      localStorage.getItem("Accounts") != null &&
      localStorage.getItem("Accounts") != undefined &&
      localStorage.getItem("PK") != null &&
      localStorage.getItem("PK") != undefined
    ) {
      setAddress(localStorage.getItem("Accounts"));
      setPK(localStorage.getItem("PK"));

      setRecommended(async () => await getGasPrices())
      setInterval(async () => {
        setRecommended(await getGasPrices())
      }, 5000)
      console.log(localStorage.getItem("Accounts"), localStorage.getItem("PK"));
      async function a() {
        const tx = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${localStorage.getItem("Accounts")}&startblock=0&endblock=99999999&sort=asc&apikey=${APIKEY}`)
        setTxhis((await tx.json()).result)
        console.log("a")
      }
  
      a()
    }
  }, []);

  function createAccounts() {
    const accounts = web3.eth.accounts.create();

    async function a() {
      const tx = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${APIKEY}`)
      setTxhis((await tx.json()).result)
    }

    a()
    return {
      PK: accounts.privateKey,
      addr: accounts.address,
    };
  }

  async function getBalances(addr) {
    console.log(addr);
    const result = await web3.eth.getBalance(addr);
    return Number(result) / 1000000000 / 1000000000;
  }

  async function a() {
    console.log(
      await getBalances("0xad0b0842dFC80b1E806e2389A7f5e098A36E9531"),
    );
  }

  async function getGasPrices() {
    const res = await fetch(
      "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=" +
      APIKEY,
    );
    const json = await res.json();
    const { result } = json;
    return Number(result);
  }

  const inputStyles = {
    width: "200px",
    border: "none",
    fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
    height: "50px",
    margin: "0",
    borderRadius: "10px",
    fontSize: "20px",
    backgroundColor: "#d5d2cd",
    display: "inline",
    marginBottom: "10px",
  };

  const buttonStyles = {
    width: "150px",
    border: "none",
    height: "50px",
    borderRadius: "10px",
    color: "white",
    backgroundColor: "black",
    opacity: "1",
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "10px",
  };

  async function b() {
    console.log(await getGasPrices());
    if (await getGasPrices() != NaN) {
      setRecommended(await getGasPrices())
    }

  }

  async function sendEther(privateKey, from, to, amount, _gasPrice = undefined) {
    let gasPrice = _gasPrice;
    if (!gasPrice) {
      gasPrice = await getGasPrices();
    }

    const weiAmount = web3.utils.toWei(amount.toString(), 'ether');
    const weiGasPrice = web3.utils.toWei(gasPrice.toString(), 'gwei');
    console.log(weiAmount, weiGasPrice)

    if ((weiAmount + weiGasPrice * 21000) / 10 ** 18 > balance) {
      console.log((weiAmount + weiGasPrice * 21000) / 10 ** 18, balance)
    }

    const tx = {
      from: from,
      to: to,
      value: weiAmount,
      gas: 21000,
      gasPrice: weiGasPrice
    };

    try {
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      return receipt;
    } catch (error) {
      throw new Error(error)
    }
  }


  return (
    <>
      <center>
        <div style={{ display: !address && !PK ? "block" : "none" }}>
          <div className="container">
            <h1
              style={{
                fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
              }}
            >
              Create Wallet
            </h1>
            <button
              style={buttonStyles}
              onClick={() => {
                const { PK: priv, addr } = createAccounts();
                console.log(priv, addr);
                setAddress(addr);
                setPK(priv);
                async function a() {
                  const tx = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${APIKEY}`)
                  setTxhis((await tx.json()).result)
                }
                a()
                localStorage.setItem("Accounts", addr);
                localStorage.setItem("PK", priv);
              }}
            >
              Create Wallet
            </button>
          </div>

          <div className="container">
            <h1
              style={{
                fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
              }}
            >
              Import Wallet
            </h1>
            <input
              style={inputStyles}
              value={inPK}
              onChange={(e) => {
                setInPK(String(e.target.value));
                console.log(e.target.value);
              }}
              placeholder="Private Key"
            />
            <br></br>
            <button
              style={buttonStyles}
              onClick={async() => {
                try {
                  setPK(inPK);
                  console.log(inPK);
                  const account = web3.eth.accounts.privateKeyToAccount(inPK);
                  setAddress(account.address);
                  setAddress(account.address);
                  setPK(inPK);
                  localStorage.setItem("Accounts", account.address);
                  localStorage.setItem("PK", inPK);
                  const tx = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${localStorage.getItem("Accounts")}&startblock=0&endblock=99999999&sort=asc&apikey=${APIKEY}`)
                  setTxhis((await tx.json()).result)
                } catch (e) {
                  alert("invalid private key");
                }
              }}
            >
              Import
            </button>
          </div>
        </div>

        <div
          style={{ display: address && PK && !wannasend && !details ? "block" : "none" }}
        >
          <button style={{
            fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
            width: "150px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#DDDDDD",
            padding: "2px",
            display: "block"
          }} onClick={() => navigator.clipboard.writeText(address).then(() => {
            alert("address copied to clipboard")
          })}><h2>
              {slicedAddress}
            </h2></button>
          <div className="container">
            <h1
              style={{
                fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
              }}
            >
              {balance != undefined ? String(decimalBal) : "Loading... "} ETH
            </h1>
            <button style={buttonStyles} onClick={() => setWannasend(true)}>
              Send Ether
            </button>
          </div><br />
          <h1 style={{ fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>Transaction History</h1>
          <table className="container" style={{ fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif", overflowX:"scroll", height:"500px", overflowY: "scroll"}}>
            <tr backgroundColor="gray" style={{border:"1px solid black"}}>
              <td width="40%">From</td>
              <td width="40%">To</td>
              <td width="30%">Value</td>
            </tr>
            {typeof txhis === "object" ? txhis.map(res => {
              console.log(res)
              return <tr style={{ fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif", border:"1px solid black" }}>
                <td>{address == res.from ? "you" : res.from}</td>
                <td>{address == res.to ? "you" : res.to}</td>
                <td style={{margin:"25px"}}>{(res.value/10**18).toFixed(5)} ETH</td>
              </tr>
            }) : ""}
          </table><br />
          <button onClick={() => setDetails(true)} style={buttonStyles}>Account Details</button>
          
        </div>

        <div
          style={{
            display: address && PK && wannasend ? "block" : "none",
            width: "100%",
          }}
        >
          <button
            style={{ backgroundColor: "white", border: "none", display: "block" }}
            onClick={() => setWannasend(false)}
          >
            <p
              style={{
                position: "absolute",
                opacity: "0.6",
                left: "5%",
                fontSize: "18px",
              }}
            >
              <i>&larr; back</i>
            </p>
          </button>
          <button style={{
            fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
            width: "150px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#DDDDDD",
            padding: "2px",
          }} onClick={() => navigator.clipboard.writeText(address).then(() => {
            alert("address copied to clipboard")
          })}><h2>
              {slicedAddress}
            </h2></button>
          <h1
            style={{
              fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
            }}
          >
            Send Eth
          </h1>
          <div className="container">
            <h2 style={{
              fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
            }}>Balance: {decimalBal} ETH</h2>
            <h2 style={{
              fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
            }}>Amount of Eth</h2>
            <input type="number"
              style={inputStyles}
              value={amount}
              onChange={(e) => {
                setAmount(String(e.target.value));
                console.log(e.target.value);
              }}
              placeholder="ETH"
            />
            <h2 style={{
              fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"
            }}>Gas Price (GWEI)</h2>
            <h3 style={{
              fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"
            }}>Recommended Gas Price {(recommended / 1000000000).toFixed(5)} Gwei</h3>
            <input type="number"
              style={inputStyles}
              value={gas}
              onChange={(e) => {
                setGas(String(e.target.value));
                console.log(e.target.value);
              }}
              placeholder="GWEI"
            />
            <h3 style={{
              fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"
            }}>Total Gas Fee: {((gas) * 21000 / 1000000000).toFixed(8)} ETH</h3>
            <input type="text"
              style={inputStyles}
              value={to}
              onChange={(e) => {
                setTo(String(e.target.value));
                console.log(e.target.value);
              }}
              placeholder="Send To"
            /><br></br>
            <button
              style={{ ...buttonStyles, display: ((to != undefined && to != "") && (amount != undefined && amount != "") && (gas != undefined && gas != "")) ? "inline-block" : "none" }}
              onClick={async () => {
                try {
                  console.log((gas * 21000) * 10 ** 9 + amount * 10 ** 18, balance * 10 ** 18)
                  if ((gas * 20) * 10 ** 9 + amount * 10 ** 18 > balance * 10 ** 18) {
                    return alert(`Insufficient funds. Total Transaction cost: ${(((gas * 21000) * 10 ** 9 + amount * 10 ** 18) / 10 ** 18)} Balance: ${((balance * 10 ** 18) / 10 ** 18)}`)
                  }
                  if (!confirm(`Are you sure you want to send ${amount} eth to address ${to}? This action is irreversible.`)) {
                    return setWannasend(false)
                  }

                  alert("Transaction submitted. Please wait a bit for the transaction to send.")
                  await sendEther(PK, address, to, amount, gas)
                  setWannasend(false)
                  alert("Transaction Sent!")
                  async function a() {
                    const tx = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${APIKEY}`)
                    setTxhis((await tx.json()).result)
                  }
                  a()
                } catch (e) {
                  alert("Trsnsaction Reverted :( Try Increasing Gas Price.")
                  console.log(e)
                }
              }
              }
            >
              Send ETH
            </button>
          </div>
        </div>
        <div style={{ display: details ? "block" : "none" }}>
          <button style={{
            fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
            width: "150px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#DDDDDD",
            padding: "2px",
          }} onClick={() => navigator.clipboard.writeText(address).then(() => {
            alert("address copied to clipboard")
          })}><h2>
              {slicedAddress}
            </h2></button>
          <button
            style={{ backgroundColor: "white", border: "none", display: "block" }}
            onClick={() => setDetails(false)}
          >
            <p
              style={{
                position: "absolute",
                opacity: "0.6",
                left: "5%",
                fontSize: "18px",
              }}
            >
              <i>&larr; back</i>
            </p>
          </button>
          <h1 style={{
            fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
          }}>Account Details</h1>
          <div className="container">
            <h3 style={{
              fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
            }}>Address: {address}</h3>
            <h3 style={{
              fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
            }}>Private Key (DO NOT SHARE): {PK}</h3>
            <button style={{ ...buttonStyles, backgroundColor: "red" }} onClick={() => { setPK(undefined); setAddress(undefined); setDetails(false); localStorage.clear() }}>
              Logout
            </button>
          </div>
        </div>
      </center>
    </>
  );
}

//display: (to != undefined || to != "") && (amount != undefined || amount != "") && (gas != undefined || gas != "") ? "block" : "none"

export default App;
