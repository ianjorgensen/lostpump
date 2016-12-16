var createSettingsSection = function(dataSettings, pumpid) {
  settingsSection = new Vue({
    el: '#app',
    data: {
      waiting: false,
      pumpid: pumpid,
      pumpFound: null,
      regiment: null,
      settings: JSON.parse(JSON.stringify(dataSettings))
    },
    updated: function() {

      globalPumpSettings = JSON.parse(JSON.stringify(this.$data));

      console.log('update vue');
      //console.log('updated data', globalPumpSettings, result);
    },
    mounted: function() {
      if (this.pumpid) {
        this.loadSample(true);
      }
    },
    methods: {
      updateSettings: function(settings) {
        this.regiment = null;
        this.settings = JSON.parse(JSON.stringify(settings))
      },
      calculateRegiment: function(save) {
        console.log('calculateRegiment', save);
        var result = calculate(this.settings);

        if(result.rapidDoseBreakDown) {
          this.regiment = result;
        }

        //save settings to server
        if(save !== false) {
          console.log('save settings to server', this.settings);
          $.post("/save", {pumpid: this.pumpid, settings: this.settings}, function(data) {
            console.log('post',data);
          });
        }
      },
      createPump: function() {
        this.pumpFound = true;
        this.updateSettings(emptyPumpSettings.settings);
      },
      loadSample: function(calculate) {
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

            if (calculate === true) {
              console.log('try to calculate');
              setTimeout(function() {_this.calculateRegiment(false);},100);
            }
          }
        });
      },
      print: function() {
        window.print()
      }
    }
  })
};
