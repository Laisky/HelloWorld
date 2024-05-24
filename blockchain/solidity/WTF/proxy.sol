// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Proxy {
    address public implementation;
    uint constant x = 10;

    event LOG(uint x);

    constructor(address implementation_) {
        implementation = implementation_;
    }

    fallback() external payable {
        emit LOG(x);
        address _implementation = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(
                gas(),
                _implementation,
                0,
                calldatasize(),
                0,
                0
            )

            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}

contract Logic {
    address public implementation;
    uint public constant x = 99;
    event CallSuccess();

    function increment() external returns (uint) {
        emit CallSuccess();
        return x;
    }
}

/**
 * @dev Caller合约，调用代理合约，并获取执行结果
 */
contract Caller {
    address public proxy; // 代理合约地址

    constructor(address proxy_) {
        proxy = proxy_;
    }

    // 通过代理合约调用increment()函数
    function increment() external returns (uint) {
        (, bytes memory data) = proxy.call(
            abi.encodeWithSignature("increment()")
        );
        return abi.decode(data, (uint));
    }
}
