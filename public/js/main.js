var settingsSection;

var samplePumpSettings = {
  settings: {
    basal: {
      headers: ['kl.','ie/t'],
      rows: [['00:00','1.4'],['07:00','1'],['17:00','1.5']]
    },
    carbRatio: {
      headers: ['kl.','gram/IE',],
      rows: [['00:00','7'],['11:00','8'],['17:30', '7']]
    },
    insulinSensitivity: {
      headers: ['kl.','mmol/l/IE'],
      rows: [['00:00','1.3']]
    },
    bgTarget: {
      headers: ['kl.','mmol/l (min.)','mmol/l (maks.)'],
      rows: [['00:00','5.2','5.2']]
    }
  }
}

var emptyPumpSettings = {
  settings: {
    basal: {
      headers: ['kl.','ie/t'],
      rows: [['','']]
    },
    carbRatio: {
      headers: ['kl.','gram/IE',],
      rows: [['','']]
    },
    insulinSensitivity: {
      headers: ['kl.','mmol/l/IE'],
      rows: [['','']]
    },
    bgTarget: {
      headers: ['kl.','mmol/l (min.)','mmol/l (maks.)'],
      rows: [['','','']]
    }
  }
}



// ((1 * b) + (8 * c) + (3 * d)) * 1.2
// 13
/*
1: convert kl. to absolute minutes in day

1440
2: conver previus to total minutes per day for when the period is active

*/
// ((5 * d) + (4 * a) + (3 * b)) * 1.2
// 12
var globalPumpSettings;
var regiment;

$(function(){
  var createSettingsSection = function(dataSettings) {
    settingsSection = new Vue({
      el: '#app',
      data: {
        waiting: false,
        pumpid: null,
        pumpFound: null,
        regiment: null,
        settings: JSON.parse(JSON.stringify(dataSettings))
      },
      updated: function() {

        globalPumpSettings = JSON.parse(JSON.stringify(this.$data));

        console.log('update vue');
        //console.log('updated data', globalPumpSettings, result);
      },
      methods: {
        updateSettings: function(settings) {
          this.regiment = null;
          this.settings = JSON.parse(JSON.stringify(settings))
        },
        calculateRegiment: function() {
          var result = calculate(this.settings);

          if(result.rapidDoseBreakDown) {
            this.regiment = result;
          }

          //save settings to server
          $.post("/save", {pumpid: this.pumpid, settings: this.settings}, function(data) {
            console.log('post',data);
          });
        },
        createPump: function() {
          this.pumpFound = true;
          this.updateSettings(emptyPumpSettings.settings);
        },
        loadSample: function() {
          this.waiting = true;

          var _this = this;
          $.getJSON('/pump/' + this.pumpid, function( data ) {
            _this.waiting = false;

            console.log('pump data',data);
            if (data.notfound) {
              _this.pumpFound = false;
              _this.updateSettings(emptyPumpSettings.settings);
            } else {
              _this.pumpFound = true;
              _this.updateSettings(data.settings);
            }
          });
        },
        print: function() {
          window.print()
        }
      }
    })
  }

  createSettingsSection(emptyPumpSettings.settings);
});
