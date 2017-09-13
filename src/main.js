App = {
  web3Provider: null,
  contracts: {},
  roll1: -1,
  roll2: -1,
  roll3: -1,

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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
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

      //App.checkBalance();
      App.slotMachine();

    });

    return App.bindEvents();
  },

  bindEvents: function() {
     $(document).on('click', '#slotMachineButtonShuffle', App.startRoll);
     $(document).on('click', '#whitdraw', App.whitdraw);
  },

  whitdraw: function() {

  },

  checkBalance: function() {
    web3.eth.getAccounts(function(error, accounts) {

        var account = accounts[0];

        App.contracts.SlotMachine.deployed().then(function(instance) {
            instance.balanceOf.call(account).then(function(balance) {
                console.log(balance);
            })
        });

    });
  },

  startRoll: function() {
    event.preventDefault();

    var slotMachineInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      var event;

      App.contracts.SlotMachine.deployed().then(function(instance) {
        slotMachineInstance = instance;

        event = slotMachineInstance.Rolled();

        event.watch(function(err, resp) {
            console.log(resp);
        });

        return slotMachineInstance.oneRoll.sendTransaction({from: account, value: web3.toWei('0.1', 'ether')});

      }).then(function() {

          return slotMachineInstance.getResult(account);
      }).then(function(res) {
          if(res.length >= 2) {
              roll1 = res[0].valueOf();
              roll2 = res[1].valueOf();
              roll3 = res[2].valueOf();

              console.log(roll1, roll2, roll3);
          }
      })
      .catch(function(err) {
        console.log(err.message);
      });
    });
  },

  slotMachine: function() {
      	var machine4 = $("#casino1").slotMachine({
            active	: 0,
            delay	: 500
        });

        var machine5 = $("#casino2").slotMachine({
            active	: 1,
            delay	: 500
        });

        machine6 = $("#casino3").slotMachine({
            active	: 2,
            delay	: 500
        });

        machine4.setRandomize(function() { return roll1; });
        machine5.setRandomize(function() { return roll2; });
        machine6.setRandomize(function() { return roll3; });

        var started = 0;

        $("#slotMachineButtonShuffle").click(function(){
            started = 3;
            machine4.shuffle();
            machine5.shuffle();
            machine6.shuffle();
        });

        $("#slotMachineButtonStop").click(function(){
            switch(started){
                case 3:
                    machine4.stop();
                    break;
                case 2:
                    machine5.stop();
                    break;
                case 1:
                    machine6.stop();
                    break;
            }
            started--;
        });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
