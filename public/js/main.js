var settingsSection;

var data1 = {
  settings: {
    basal: {
      headers: ['kl.','ie/t'],
      rows: [['00:00','1.4'],['07:00','1'],['17:00','1.5']]
    },
    carbRatio: {
      headers: ['kl.','gram/IE',],
      rows: [['00:00','7'],['11:00','8'],['17:30', '7']]
    },
    insulinSens: {
      headers: ['kl.','mmol/l/IE'],
      rows: [['00:00','1.3']]
    },
    bgTarget: {
      headers: ['kl.','mmol/l (min.)','mmol/l (maks.)'],
      rows: [['00:00','5.2','5.2']]
    }
  }
}

var dataEmpty = {
  settings: {
    basal: {
      headers: ['kl.','ie/t'],
      rows: [['','']]
    },
    carbRatio: {
      headers: ['kl.','gram/IE',],
      rows: [['','']]
    },
    insulinSens: {
      headers: ['kl.','mmol/l/IE'],
      rows: [['','']]
    },
    bgTarget: {
      headers: ['kl.','mmol/l (min.)','mmol/l (maks.)'],
      rows: [['','','']]
    }
  }
};

$(function(){
  var createSettingsSection = function(dataSettings) {
    settingsSection = new Vue({
      el: '#app',
      data: {
        waiting: false,
        pumpFound: null,
        settings: JSON.parse(JSON.stringify(dataSettings))
      },
      updated: function() {
        console.log('updated data', JSON.stringify(this.$data));
      },
      methods: {
        updateSettings: function(settings) {
          this.settings = JSON.parse(JSON.stringify(settings))
        },
        createPump: function() {
          this.pumpFound = true;
          this.updateSettings(dataEmpty.settings);
        },
        loadSample: function() {
          this.waiting = true;
          setTimeout(function(_this) {
            return function() {
              _this.waiting = false;
              _this.pumpFound = true;
              _this.updateSettings(data1.settings);
            };
          }(this), 3000);
        },
        print: function() {
          window.print()
        }
      }
    })
  }

  createSettingsSection(dataEmpty.settings);
});
