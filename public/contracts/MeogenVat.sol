// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Meogen Vat
/// @notice Treasury for mix fees. ETH lands here, never on an EOA.
/// @dev Compiler 0.8.24, optimizer 200 runs, Robinhood Chain 4663.
/// @custom:website https://meogen.xyz
/// @custom:twitter https://x.com/meogenXYZ
/// @custom:telegram https://t.me/meogenXYZ
/// @custom:github https://github.com/meogenxyz/meogen
contract MeogenVat {
    /// @notice Deployer. May sweep ETH and hand the vat to a new owner.
    address public owner;

    string public constant name = "Meogen Vat";
    string public constant description =
        "The gene that mews. Mix fees from the Nursery settle here. Not a wallet.";
    string public constant website = "https://meogen.xyz";
    string public constant twitter = "https://x.com/meogenXYZ";
    string public constant telegram = "https://t.me/meogenXYZ";
    string public constant github = "https://github.com/meogenxyz/meogen";

    event Received(address indexed from, uint256 amount);
    event Swept(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Mix fees arrive as plain ETH.
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /// @notice Site, X, Telegram, GitHub.
    function socials()
        external
        pure
        returns (string memory, string memory, string memory, string memory)
    {
        return (website, twitter, telegram, github);
    }

    /// @notice Move ETH out. Owner only.
    function sweep(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "zero");
        require(amount <= address(this).balance, "bal");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "send");
        emit Swept(to, amount);
    }

    /// @notice Hand the vat to a new owner. Zero address refused.
    function transferOwnership(address next) external onlyOwner {
        require(next != address(0), "zero");
        owner = next;
    }
}
