// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYCValidation is Ownable {
    mapping(address => bool) public KYCCompletedRegistry;

    function seKYCCompletedFor(address _userAddress) external {
        KYCCompletedRegistry[_userAddress] = true;
    }

    function seKYCRevokedFor(address _userAddress) external {
        KYCCompletedRegistry[_userAddress] = false;
    }

    function isKYCCompletedFor(address _userAddress)
        internal
        view
        returns (bool)
    {
        return KYCCompletedRegistry[_userAddress];
    }

    function requireKYCCompletion(address _buyer) external view {
        require(
            isKYCCompletedFor(_buyer),
            "You must complete KYC before purchasing tokens"
        );
    }
}
