// //deploy.js
// const main = async () => {
//     const [deployer] = await hre.ethers.getSigners();
//     const accountBalance = await deployer.getBalance();
//     const waveContract = await hre.ethers.getContractFactory('WavePortal');
//     const wavePortal = await waveContract.deploy();

//     console.log("Deploying contracts with account: ", deployer.address);
//     console.log("Account balance: ", accountBalance.toString());
//     console.log("Contract deployed to: ", wavePortal.address);
//     console.log("Contract deployed by: ", deployer.address);
// };

// const runMain = async () => {
//     try {
//         await main();
//         process.exit(0);
//     } catch (error) {
//         console.error(error);
//         process.exit(1);
//     }
// };

// runMain();

// deploy.js
const main = async () => {
	const [deployer] = await hre.ethers.getSigners();
	const accountBalance = await deployer.getBalance();

	console.log('Deploying contracts with account: ', deployer.address);
	console.log('Account balance: ', accountBalance.toString());

	// const waveContract = await hre.ethers.getContractFactory('WavePortal');
	const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
	/* コントラクトに資金を提供できるようにする */
	// const wavePortal = await waveContract.deploy();
	const waveContract = await waveContractFactory.deploy({
		value: hre.ethers.utils.parseEther("0.001"),
	});

	await waveContract.deployed();

	console.log('WavePortal address: ', waveContract.address);
	// console.log("Deploying contracts with account: ", deployer.address);
	// console.log("Account balance: ", accountBalance.toString());
	// console.log("Contract deployed to: ", wavePortal.address);
	// console.log("Contract deployed by: ", deployer.address);
    };

    const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
	};

	runMain();