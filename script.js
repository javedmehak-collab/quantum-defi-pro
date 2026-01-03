const CONTRACT_ADDR = "0xf0061895db4E704401D18A7372aB4b1d6CddB921";
const USDT_ADDR = "0x55d398326f99059fF775485246999027B3197955";
const DEFAULT_REF = "QuantumAdmin";

let signer, contract, usdt;

async function connect() {
    if (!window.ethereum) return alert("Use Trust Wallet/MetaMask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    
    // ABI yahan paste hogi (Step 3 mein hai)
    contract = new ethers.Contract(CONTRACT_ADDR, ABI, signer);
    usdt = new ethers.Contract(USDT_ADDR, ["function approve(address s, uint256 a) public returns (bool)", "function balanceOf(address a) public view returns (uint256)"], signer);
    
    const bal = await usdt.balanceOf(CONTRACT_ADDR);
    document.getElementById('contractBal').innerText = ethers.utils.formatUnits(bal, 18) + " USDT";
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('loginPrompt').classList.add('hidden');
    document.getElementById('connectBtn').innerText = "Connected";
}

async function approve() {
    const amount = document.getElementById('amt').value;
    const tx = await usdt.approve(CONTRACT_ADDR, ethers.utils.parseUnits(amount, 18));
    await tx.wait(); alert("USDT Approved!");
}

async function deposit() {
    const amount = document.getElementById('amt').value;
    const tx = await contract.deposit(ethers.utils.parseUnits(amount, 18));
    await tx.wait(); alert("Investment Successful!");
}

async function register() {
    const user = document.getElementById('regUser').value;
    const ref = document.getElementById('regRef').value || DEFAULT_REF;
    const tx = await contract.register(user, ref);
    await tx.wait(); alert("Registered!");
}
