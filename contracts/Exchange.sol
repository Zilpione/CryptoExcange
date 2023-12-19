// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;
    mapping(uint256 => bool) public orderCancelled;

    constructor (
        address  _feeAccount,
        uint256 _feePercent     
    ){
        feeAccount = _feeAccount;    
        feePercent = _feePercent;        
    }
   
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);

    event OrderEvent (
        uint256 id,
        address user, 
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event CancelEvent (
        uint256 id,
        address user, 
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    struct _Order {
        uint256 id;
        address user; //Who make the order
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

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
    function balanceOf
    (
        address _token,
        address _user
    )
        public 
        view returns (uint256)
    {
        return tokens[_token][_user];
    }

//Token Give (the token they want to spend)
//Get (want to recive)
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        //REQUIRE BALANCE
        require(balanceOf(_tokenGive,msg.sender) >= _amountGive);
        //instantiate new order

        orderCount = orderCount + 1;
        orders[orderCount] = _Order(
            orderCount,    
            msg.sender,  
            _tokenGet,    
            _amountGet,    
            _tokenGive,    
            _amountGive,    
            block.timestamp
            );   
        orderCancelled[orderCount]=false;
        //EMIT EVENT      
         emit OrderEvent(orderCount, msg.sender, 
            _tokenGet, _amountGet,    
            _tokenGive,  _amountGive,    
            block.timestamp
            );

    }

    function withdrawToken
    (
        address _token,
        uint256 _amount
    )
    public
    {
        require(tokens[_token][msg.sender]>=_amount,'Token non sufficienti');
       
        //Transfer Tokens to user
        require(Token(_token).transfer(msg.sender, _amount));

        //Update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

        //emit Event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
  
  function cancelOrder(uint256 _id) public{
    //Fetch
    _Order storage found = orders[_id];
    
    //Order must exist, owner

    require(found.id == _id);
   

    require(address(found.user)==msg.sender);
    //Cancel
    orderCancelled[_id] = true; 
    
    //Emit evt
    emit CancelEvent(_id, msg.sender, 
            found.tokenGet, found.amountGet,    
            found.tokenGive,  found.amountGive,    
            block.timestamp
            );

  }
}
