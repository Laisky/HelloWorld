// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract LaiskyTokenProxy {
    address owner;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address _implementation;

    event CallLaiskySuccess(string msg);

    constructor(address implementation) {
        _implementation = implementation;
    }

    fallback() external payable {
        require(
            _implementation != address(0),
            "implementation is the zero address"
        );
        (bool success, bytes memory data) = _implementation.delegatecall(
            msg.data
        );
        require(success, "delegatecall failed");

        emit CallLaiskySuccess("delegatecall success");
        assembly {
            switch success
            case 0 {
                revert(add(data, 0x20), mload(data))
            }
            default {
                return(add(data, 0x20), mload(data))
            }
        }
    }
}

contract LaiskyTokenV1 {
    address owner;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address _implementation;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // modifier acts as decorator in Python
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function mint(address _to, uint256 _value) public onlyOwner {
        balanceOf[_to] += _value;
        totalSupply += _value;
        emit Transfer(address(0), _to, _value);
    }

    function burn(uint256 _value) public onlyOwner {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Transfer(msg.sender, address(0), _value);
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) {
        owner = msg.sender;

        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(
            allowance[_from][msg.sender] >= _value,
            "Not allowed to transfer"
        );
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function balance() external view returns (uint256) {
        return balanceOf[msg.sender];
    }

    function upgrade(address newImplementation) public onlyOwner {
        _implementation = newImplementation;
    }
}
