// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;

    constructor (
        address  _feeAccount,
        uint256 _feePercent     
    ){
        feeAccount = _feeAccount;    
        feePercent = _feePercent;        
    }
   
    event Deposit(address token, address user, uint256 amount, uint256 balance);

    function depositToken(
        address _token,
        uint256 _amount
        ) 
        public 
    {
        
        //Transfer Token to Exchange
        //msg.sender è quello che chiama lo smartContract    
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
              
        //Update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        //Emit Event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //Check Balances
    function balanceOf(address _token, address _user)
        public 
            view returns (uint256)
        {
            return tokens[_token][_user];
        }
  
}