var createSettingsSection = function(dataSettings, pumpid, pumpTravelId) {
  settingsSection = new Vue({
    el: '#app',
    data: {
      waiting: false,
      pumpid: pumpTravelId || pumpid,
      url: window.location.origin,
      disableInput: false,
      pumpFound: null,
      regiment: null,
      settings: JSON.parse(JSON.stringify(dataSettings))
    },
    updated: function() {
      globalPumpSettings = JSON.parse(JSON.stringify(this.$data));
      console.log('update vue');
    },
    mounted: function() {
      if (this.pumpid) {
        this.loadSample(!!pumpTravelId);
      }
    },
    methods: {
      updateSettings: function(settings) {
        this.regiment = null;
        this.settings = JSON.parse(JSON.stringify(settings))
      },
      save: function(save) {
        console.log('save settings to server', this.settings);
        $.post("/save", {pumpid: this.pumpid, settings: this.settings}, function(data) {
          console.log('post',data);
          notify('gemt');
        });
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
      clipboard: function() {
        var pumpSettings = JSON.parse(JSON.stringify(this.settings))

        var buildTable = function(table) {
          table.rows.unshift(table.headers)
          table.rows.pop();

          var r = textTable(table.rows);
          console.log(r);
          return r;
        };

        console.log(pumpSettings)
        var basalSum = calculateTotalBasal(JSON.parse(JSON.stringify(pumpSettings.basal)))
        var basalTable = buildTable(pumpSettings.basal)
        var bgTargetTablet = buildTable(pumpSettings.bgTarget)
        var carbRatioTable = buildTable(pumpSettings.carbRatio)
        var insulinSensitivityTable = buildTable(pumpSettings.insulinSensitivity)

        var text = 'Pump ID: ' + this.pumpid + '\n' +
          'Aktiv insulin-tid: ' + pumpSettings.insulinActionTime + '\n' +
          'Pumpefirma og -model: ' + pumpSettings.pumpModel + '\n\n' +
          'Basalrate \n' + basalTable + '\n' + basalSum + ' ie/dag'  + '\n\n' +
          'Kulhydrat-insulin-forhold \n' + carbRatioTable + '\n\n' +
          'Insulin-sensitivitet \n' + insulinSensitivityTable + '\n\n' +
          'Mål-blodsukker \n' + bgTargetTablet + '\n\n' +
          'Link: ' + window.location.origin + '?pumpid=' + this.pumpid

        console.log(text);

        new Clipboard('.clipboard', {
            text: function(trigger) {
                return text;
            }
        });
        notify('klar til at sætte ind');
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
              _this.disableInput = true;
              setTimeout(function() {
                $( "input" ).prop( "disabled", true );
                _this.calculateRegiment(false);
              },1000);
            }
          }
        });
      },
      print: function() {
        var person = prompt("Indtast fulde navn og CPR nummer", "");

        if (person != null) {
          document.getElementById("patientName").innerHTML = "Patient: " + person;
        } else {
          document.getElementById("patientName").innerHTML = '';
        }

        window.print()
      }
    }
  })
};
