// run.js
const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

    /*
    * デプロイする際0.1ETHをコントラクトに提供する
    */
    const waveContract = await waveContractFactory.deploy({ //3-2追記
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();
    console.log("Contract deployed to: ", waveContract.address);

    /*
    * コントラクトの残高を取得(0.1ETH)であることを確認
    */
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
        );
        console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
        );

    // console.log("Contract added to:", waveContract.address);
    // let waveCount;
    // waveCount = await waveContract.getTotalWaves();
    // console.log(waveCount.toNumber());

    // const wavePortal = await waveContract.deployed();

    // console.log("Contract deployed to:", wavePortal.address);
    // console.log("Contract deployed by:", owner.address);
    /*
    * 2回 waves を送るシミュレーションを行う
    */
    const waveTxn = await waveContract.wave("This is wave #1");
    await waveTxn.wait();

    const waveTxn2 = await waveContract.wave("This is wave #2");
    await waveTxn2.wait();

    // /*
    // * Waveを取得
    // */
    // let waveTxn = await waveContract.wave("A message!");
    // await waveTxn.wait(); // トランザクションが承認されるのを待つ(テスト:1回目)

    /*
    * コントラクトの残高を取得し、Waveを取得した後の結果を出力
    */
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    /*
    * コントラクトの残高から0.0001ETH引かれていることを確認
    */
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );
    // const [_, randomPerson] = await hre.ethers.getSigners();
    // waveCount = await waveContract.getTotalWaves();

    // waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    // await waveTxn.wait(); // トランザクションが承認されるのを待つ(テスト:2回目)

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
    // waveCount = await waveContract.getTotalWaves();
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();