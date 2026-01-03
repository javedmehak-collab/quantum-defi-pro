const CONTRACT_ADDR = "0xf0061895db4E704401D18A7372aB4b1d6CddB921";
const USDT_ADDR = "0x55d398326f99059fF775485246999027B3197955";
const DEFAULT_REF = "QuantumAdmin";

// Full Smart Contract ABI
const ABI = [
    {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"_username","type":"string"},{"internalType":"string","name":"_referrerName","type":"string"}],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"regrow","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"address","name":"referrer","type":"address"},{"internalType":"string","name":"username","type":"string"},{"internalType":"bool","name":"registered","type":"bool"},{"internalType":"uint256","name":"totalActiveDeposit","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"usernameToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"USDT","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

const USDT_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)",
    "function allowance(address owner, address spender) public view returns (uint256)"
];

let signer, contract, usdt;

async function connect() {
    if (!window.ethereum) return alert("Please use Trust Wallet or MetaMask Browser");
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();

        contract = new ethers.Contract(CONTRACT_ADDR, ABI, signer);
        usdt = new ethers.Contract(USDT_ADDR, USDT_ABI, signer);

        // Update Contract Balance
        const bal = await usdt.balanceOf(CONTRACT_ADDR);
        document.getElementById('contractBal').innerText = parseFloat(ethers.utils.formatUnits(bal, 18)).toFixed(2) + " USDT";

        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('loginPrompt').classList.add('hidden');
        document.getElementById('connectBtn').innerText = address.substring(0, 6) + "...";
    } catch (e) { alert("Connection error: " + e.message); }
}

async function approve() {
    try {
        const amount = document.getElementById('amt').value;
        if(!amount || amount <= 0) return alert("Enter valid amount");
        const tx = await usdt.approve(CONTRACT_ADDR, ethers.utils.parseUnits(amount.toString(), 18));
        await tx.wait();
        alert("USDT Approved Successfully!");
    } catch (e) { alert("Approval failed: " + e.message); }
}

async function deposit() {
    try {
        const amount = document.getElementById('amt').value;
        const tx = await contract.deposit(ethers.utils.parseUnits(amount.toString(), 18));
        await tx.wait();
        alert("Investment Successful! Welcome to QuantumDefi.");
    } catch (e) { alert("Deposit failed: " + e.message); }
}

async function register() {
    try {
        const user = document.getElementById('regUser').value;
        const ref = document.getElementById('regRef').value || DEFAULT_REF;
        if(!user) return alert("Please choose a username");
        const tx = await contract.register(user, ref);
        await tx.wait();
        alert("Registration Successful with " + ref);
    } catch (e) { alert("Registration failed: " + e.message); }
}
