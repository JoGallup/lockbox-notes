import { task } from "hardhat/config";
import { formatEther } from "ethers";

task("accounts", "Prints the list of accounts with balances", async (_taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  console.log("📋 Available Accounts:\n");
  console.log("Index\tAddress\t\t\t\t\tBalance");
  console.log("-----\t-------\t\t\t\t\t-------");

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);
    const balanceInEther = formatEther(balance);

    console.log(`${i}\t${account.address}\t${balanceInEther} ETH`);
  }
});

task("balances", "Check balances of all named accounts", async (_taskArgs, hre) => {
  const { deployer, admin, user1, user2 } = await hre.getNamedAccounts();

  const accounts = [
    { name: "deployer", address: deployer },
    { name: "admin", address: admin },
    { name: "user1", address: user1 },
    { name: "user2", address: user2 },
  ];

  console.log("💰 Named Account Balances:\n");
  console.log("Name\tAddress\t\t\t\t\tBalance");
  console.log("----\t-------\t\t\t\t\t-------");

  for (const account of accounts) {
    try {
      const balance = await hre.ethers.provider.getBalance(account.address);
      const balanceInEther = formatEther(balance);
      console.log(`${account.name}\t${account.address}\t${balanceInEther} ETH`);
    } catch (error) {
      console.log(`${account.name}\t${account.address}\tError fetching balance`);
    }
  }
});

task("network", "Display current network information", async (_taskArgs, hre) => {
  const network = hre.network;
  const provider = hre.ethers.provider;

  console.log("🌐 Network Information:\n");
  console.log(`Name: ${network.name}`);
  console.log(`Chain ID: ${network.config.chainId}`);
  console.log(`Gas Price: ${await provider.getFeeData().then(data => formatEther(data.gasPrice || 0))} ETH`);

  try {
    const blockNumber = await provider.getBlockNumber();
    console.log(`Block Number: ${blockNumber}`);
  } catch (error) {
    console.log("Block Number: Unable to fetch");
  }
});
