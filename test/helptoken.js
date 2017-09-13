var Crowdsale = artifacts.require("Crowdsale");
var HelpToken = artifacts.require("HelpToken");

contract('HelpToken', async (accounts) => {
  it("Test if we can transfer some tokens from owner to another user", async () => {
   
    const crowdsaleInstance = await Crowdsale.deployed();

    const tokenContract = await getTokenContract(crowdsaleInstance);

    const transfered = await tokenContract.transfer(accounts[3], 1000);

    const numTokens = await tokenContract.balanceOf(accounts[3]);

    assert.equal(numTokens.valueOf(), 1000, "Giving a 1000 HelpTokens to the 4th account");

  });

   it("Test if the drain method will fail if !owner tries to access", async () => {
   
    const crowdsaleInstance = await Crowdsale.deployed();

    const tokenContract = await getTokenContract(crowdsaleInstance);

    const transfered = await tokenContract.drainIco.call(accounts[1]);

    const icoAddress = await tokenContract.ico.call();

    const numTokens = await tokenContract.balanceOf(icoAddress);

    assert.equal(numTokens.valueOf(), 200000, "Ico account should be drained");

  });

   it("Test if the drain method will work if the owner pulls money from ICO fund", async () => {
   
    const crowdsaleInstance = await Crowdsale.deployed();

    const tokenContract = await getTokenContract(crowdsaleInstance);

    const transfered = await tokenContract.drainIco();

    const icoAddress = await tokenContract.ico.call();

    const numTokens = await tokenContract.balanceOf(icoAddress);

    assert.equal(numTokens.valueOf(), 0, "Ico account should't change");

  });

});

//Helper method
async function getTokenContract(crowdsaleInstance) {
    const tokenAddress = await crowdsaleInstance.token.call();

    const tokenContract = await HelpToken.at(tokenAddress);

    return tokenContract;
}
 