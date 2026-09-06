// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Meogen Vat
/// @notice Mix fees land here. Never an EOA.
/// Compiler 0.8.24, optimizer 200, Robinhood 4663.
contract MeogenVat {
    address public owner;

    event Received(address indexed from, uint256 amount);
    event Swept(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function sweep(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "zero");
        require(amount <= address(this).balance, "bal");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "send");
        emit Swept(to, amount);
    }

    function transferOwnership(address next) external onlyOwner {
        require(next != address(0), "zero");
        owner = next;
    }
}
