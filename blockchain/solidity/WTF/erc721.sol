// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) private _tokenURIs;
    address _owner;

    constructor() ERC721("Laisky's First NFT", "LaiskyNFT") {
        _owner = msg.sender;
    }

    // modifier acts as decorator in Python
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    function mintNFT(
        address recipient,
        string memory newTokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _tokenURIs[newItemId] = string(abi.encodePacked(newTokenURI));
        return newItemId;
    }

    function burnNFT(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
        delete _tokenURIs[tokenId];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
