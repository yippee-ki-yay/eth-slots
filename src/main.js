App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('SlotMachine.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var SlotMachineArtifact = data;
      App.contracts.SlotMachine = TruffleContract(SlotMachineArtifact);

      // Set the provider for our contract.
      App.contracts.SlotMachine.setProvider(App.web3Provider);

    });

    return App.bindEvents();
  },

  bindEvents: function() {
     $(document).on('click', '#slotMachineButtonShuffle', App.startRoll);
    // $(document).on('change paste keyup', '#num_tokens', App.priceInEther);
  },

  startRoll: function() {
    event.preventDefault();

    var slotMachineInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];


      App.contracts.SlotMachine.deployed().then(function(instance) {
        slotMachineInstance = instance;

         return slotMachineInstance.oneRoll.sendTransaction(account, {from: account, value: web3.toWei(num_eth.toString(), 'ether')});

      }).then(function(res) {
          console.log(res);
      })
      .catch(function(err) {
        console.log(err.message);
      });
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
