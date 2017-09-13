var Crowdsale = artifacts.require("Crowdsale");
var HelpToken = artifacts.require("HelpToken");

contract('Crowdsale', async (accounts) => {
  it("Test if we can buy tokens from the crowd sale", async () => {
   
    const crowdsaleInstance = await Crowdsale.deployed();

    const tokenContract = await getTokenContract(crowdsaleInstance);

    //buy a 100 HelpTokens
    const buyToken = await crowdsaleInstance.buyTokens.sendTransaction(accounts[1], {
                    value: web3.toWei('0.1', 'ether'), 
                    from: accounts[1]});

    //check the balance
    const numTokens = await tokenContract.balanceOf(accounts[1]);

    assert.equal(numTokens.valueOf(), 100, "The second account bought a 100 HelpTokens with 0.1 ether");

  });

  it("Test if we can buy tokens by calling the fallback method", async () => {
   
    const crowdsaleInstance = await Crowdsale.deployed();

    const tokenContract = await getTokenContract(crowdsaleInstance);

    //buy a 100 HelpTokens
    const buyToken = await crowdsaleInstance.sendTransaction({
                    value: web3.toWei('0.1', 'ether'), 
                    from: accounts[2]});

    //check the balance
    const numTokens = await tokenContract.balanceOf(accounts[2]);

    assert.equal(numTokens.valueOf(), 100, "The second account bought a 100 HelpTokens with 0.1 ether");

  });

  //Helper method
  async function getTokenContract(crowdsaleInstance) {
    const tokenAddress = await crowdsaleInstance.token.call();

    const tokenContract = await HelpToken.at(tokenAddress);

    return tokenContract;
  }
 

});