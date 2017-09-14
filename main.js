App = {
  web3Provider: null,
  contracts: {},
  account: null,
  instance: null,
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

      App.checkAccount();
      App.slotMachine();

    });

    return App.bindEvents();
  },

  bindEvents: function() {
     $(document).on('click', '#slotMachineButtonShuffle', App.startRoll);
     $(document).on('click', '#whitdraw', App.whitdraw);
  },

  whitdraw: function() {
    instance.withdraw.call().then(function(resp) {
        console.log(resp);
        App.checkBalance();
    })
    .catch(function(err) {
        console.log(err);
    });
  },

  checkAccount: function() {
    web3.eth.getAccounts(function(error, accounts) {
        App.account = accounts[0];

        App.contracts.SlotMachine.deployed().then(function(_instance) {
            instance = _instance;

             var event = instance.Rolled();

             event.watch(function(err, resp) {
                 console.log(resp);
             });

            App.checkBalance();
        });
    });
  },

   checkBalance: function() {

    console.log("Acc: " + App.account);

    instance.balanceOf.call(App.account).then(function(balance) {

        var balance = balance.valueOf();

        var balanceInEther = web3.fromWei(balance, "ether");

        $("#balance").text(balanceInEther + " ether");
        
    });
   },
       

  startRoll: function() {
    event.preventDefault();

    console.log("Roll was pressed");

    App.contracts.SlotMachine.deployed().then(function(instance) {

        return instance.oneRoll.sendTransaction({from: App.account, value: web3.toWei('0.1', 'ether')});

    }).then(function() {

        return instance.getResult(App.account);
    }).then(function(res) {
        if(res.length >= 2) {
            App.roll1 = res[0].valueOf();
            App.roll2 = res[1].valueOf();
            App.roll3 = res[2].valueOf();

            console.log(App.roll1, App.roll2, App.roll3);
        }

        App.checkBalance();
    })
    .catch(function(err) {
    console.log(err.message);
    });
  },

  prizeWon: function() {

    console.log("Prize won");

    if((App.roll1 == App.roll2) && (App.roll1 == App.roll3)) {
        $("#header-msg").text("Congratulation you won!!!");
    } else if ((App.roll1 == App.roll2) || (App.roll1 == App.roll3) || (App.roll2 == App.roll3)) {
        $("#header-msg").text("Not bad, you live to try again");
    } else {
        $("#header-msg").text("Ouch, maybe another try?");
    }
  },

  slotMachine: function() {

      	var machine1 = $("#casino1").slotMachine({
            active	: 0,
            delay	: 500
        });

        var machine2 = $("#casino2").slotMachine({
            active	: 1,
            delay	: 500
        });

        var machine3 = $("#casino3").slotMachine({
            active	: 2,
            delay	: 500
        });

        machine1.setRandomize(function() { return App.roll1; });
        machine2.setRandomize(function() { return App.roll2; });
        machine3.setRandomize(function() { return App.roll3; });

        var started = 0;

        $("#slotMachineButtonShuffle").click(function(){
            started = 3;
            machine1.shuffle();
            machine2.shuffle();
            machine3.shuffle();
        });

        $("#slotMachineButtonStop").click(function(){
            switch(started){
                case 3:
                    machine1.stop();
                    break;
                case 2:
                    machine2.stop();
                    break;
                case 1:
                    machine3.stop();
                    App.prizeWon();
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
