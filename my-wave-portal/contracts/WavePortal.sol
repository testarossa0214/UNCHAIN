// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /* 乱数生成のための基盤となるシード(種)を作成 */
    uint256 private seed;
    /*
    * NewWaveイベントの作成
    */
    event NewWave(address indexed from, uint256 timestamp, string message);
    /*
    * Waveという構造体を作成
    * 構造体の中身はカスタマイズすることができる
    */
    struct Wave {
        address waver; //「👋(wave)」を送ったユーザーのアドレス
        string message; //ユーザーが送ったメッセージ
        uint256 timestamp; //ユーザーが「👋(wave)」を送った瞬間のタイムスタンプ
    }
    /*
    * 構造体の配列を格納するための変数waveを宣言
    * これでユーザーが送ってきたすべての「👋(wave)」を保持することができる
    */
    Wave[] waves;

    /*
    * "address => uint mapping"は、アドレスと数値を関連づける
    */
    mapping(address => uint256) public lastWaveAt;


    constructor() payable {
        console.log("We have been constructed!"); // payableを加えることで、コントラクトに送金機能を実装
        /*
        * 初期シードの設定
        */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    /*
    * _messageという文字列を要求するようにwave関数を更新
    * _messageは、ユーザーがフロントエンドから送信するメッセージ
    */
    function wave(string memory _message) public {
        /*
        * 現在ユーザーがwaveを送信している時刻と、前回waveを送信した時刻が15分以上離れていることを確認
        */
        require(
            lastWaveAt[msg.sender] + 0 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
        * ユーザーの現在のタイムスタンプを更新する
        */
        lastWaveAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        // console.log("%s waved w/ message %s", msg.sender, _message);
        console.log("%s has waved!", msg.sender);

        /*
        * 「👋(wave)」というメッセージを配列に格納
        */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
        * ユーザーのために乱数を生成
        */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        /*
        * ユーザーがETHを獲得する確率を50%に設定
        */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            /*
            * ユーザーにETHを送るためのコードは以前と同じ
            */
            /*
            * 「👋(wave)」を送ってくれたユーザーに0.0001ETHを送る
            */
            uint256 prizeAmount = 0.0001 ether;
            require(                                    //requireはtrue or falseであることを確認するif文的な感じ false(コントラクトが持つ資金が足りない場合)、トランザクションをキャンセル
                prizeAmount <= address(this).balance, //ユーザーに送るETHが、コントラクトの持つ残高より小さいことを確認している
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}(""); //送金処理
            require(success, "Failed to withdraw money from contract."); //成功確認
        } else {
            console.log ("%s did not win.", msg.sender);
        }

        /*
        * コントラクト側でemitされたイベントに関する通知をフロントエンドで取得できるようにする
        */
        emit NewWave(msg.sender, block.timestamp, _message);

    }
    /*
    * 構造体配列のwavesを返してくれるgetAllWavesという関数を追加
    * これで作ったwebアプリからwavesを取得することができる
    */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    // constructor() {
    //     console.log("Here is my first smart contract!");
    // }


    // function wave() public {
    //     totalWaves += 1;
    //     console.log("%s has waved!", msg.sender);
    // }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
