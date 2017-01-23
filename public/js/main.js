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
      settingType: 'basal',
      headers: ['kl.','ie/t'],
      rows: [['00:00','']]
    },
    carbRatio: {
      settingType: 'carbRatio',
      headers: ['kl.','gram/IE',],
      rows: [['00:00','']]
    },
    insulinSensitivity: {
      settingType: 'insulinSensitivity',
      headers: ['kl.','mmol/l/IE'],
      rows: [['00:00','']]
    },
    bgTarget: {
      settingType: 'bgTarget',
      headers: ['kl.','mmol/l (min.)','mmol/l (maks.)'],
      rows: [['00:00','','']]
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

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(function(){
  if(getUrlParameter('pumptravelid')) {
    disableInputGlobal = true;
    $('.pumpCreate, .save, .intro').hide();
  }

  createSettingsSection(emptyPumpSettings.settings, getUrlParameter('pumpid'), getUrlParameter('pumptravelid'));
});
