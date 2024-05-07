// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract HelloWeb3 {
    string public constant name = "Hello Web3";
    mapping(address => uint256) internal userBalances;
    address owner;

    constructor() {
        owner = msg.sender;
    }

    // modifier acts as decorator in Python
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // event is used to log the transaction
    event Transfer(address indexed from, address indexed to, uint256 value);

    // transfer all ETH to another contract
    function migrateTo(address payable _to) public onlyOwner {
        _to.transfer(address(this).balance);
    }

    function changeOwner(address newOwner_) external onlyOwner {
        owner = newOwner_;
    }

    function showBalance() external view returns (uint256) {
        return userBalances[msg.sender];
    }

    // show sender's wallet balance
    function showWalletbalance() external view returns (uint256) {
        return msg.sender.balance;
    }

    function save() external payable {
        userBalances[msg.sender] += msg.value;
        emit Transfer(msg.sender, address(this), msg.value);
    }

    function withdraw(uint256 _amount) external {
        require(userBalances[msg.sender] >= _amount, "Insufficient balance");
        userBalances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Transfer(address(this), msg.sender, _amount);
    }

    function beg() external {
        require(address(this).balance >= 1, "Contract is poor");
        payable(msg.sender).transfer(1); // transfer 1 wei to sender
        emit Transfer(address(this), msg.sender, 1);
    }

    function donate() external payable {
        if (msg.value > 0) {
            emit Transfer(msg.sender, address(this), msg.value);
        }
    }

    // donate ETH to this contract
    receive() external payable {
        this.donate();
    }

    function insertionSort(
        uint[] memory arr
    ) public pure returns (uint[] memory) {
        for (uint i = 1; i < arr.length; i++) {
            uint tmp = arr[i];
            uint j = i;
            while (j >= 1 && tmp < arr[j - 1]) {
                arr[j] = arr[j - 1];
                // be careful with underflow, uint cannot be negative
                j--;
            }
            arr[j] = tmp;
        }
        return arr;
    }
}
