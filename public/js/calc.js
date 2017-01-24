var average = function(rows) {
  var sum = 0

  for (var i in rows) {
    var val = rows[i][1];

    sum += parseFloat(val && val.replace(',','.') || 0)
  }

  return sum/(rows.length - 1);
}

var timing = function(rows) {
  if (!rows.length) {
    return;
  }

  var doses = [];

  var toMinutes = function(time) {
    var timeSplit =  time.split(':');

    return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1]);
  };

  for(var i in rows) {
    doses.push({
      time: rows[i][0],
      minutes: toMinutes(rows[i][0]),
      activeMinutes: 0,
      dose: rows[i][1]
    });
  }

  console.log(rows, doses);

  doses[doses.length - 1].activeMinutes = 1440 - doses[doses.length - 1].minutes;

  if (doses.length > 1) {
    for (var i = doses.length - 2; i > -1; i--) {
      doses[i].activeMinutes = doses[i+1].minutes - doses[i].minutes
    }
  }

  // compute unit per minute
  doses.map(function(dose) {
    dose.activeUnits = (dose.dose / 60) * dose.activeMinutes;
    dose.unitsPerMinute = dose.activeUnits / dose.activeMinutes;
    return dose;
  });

  return doses;
}

var minuteDoseBreakdown = function(doses) {
  if (!doses) {
    return;
  }
  var minuteDose = [];

  var pickDoseForTime = function(minute) {
    for (var i in doses) {
      var dose = doses[i];

      if (minute < dose.minutes) {
        return doses[i-1]
      }
    }

    return doses[doses.length - 1]
  }

  for(var i = 0; i < (24* 60); i++) {
    var dose = pickDoseForTime(i)
    minuteDose[i] = dose.unitsPerMinute
  }

  return minuteDose
};

var hourDoseBreakDown = function(minuteDoses) {
  if (!minuteDoses) {
    return;
  }
  var hours = [];

  for(var h = 0; h < (24); h++) {
    var sum = 0;
    for(var m = 0; m < (60); m++) {
      sum += minuteDoses[h*60 + m]
    }
    hours.push(sum)
  }
  return hours
}

var roundHalf = function(num) {
  return Math.round(num)
}

var calculateTotalBasal = function(basal) {
  basal.rows.pop()

  var doses = timing(basal.rows)
  var dosesPerMinute = minuteDoseBreakdown(doses)
  var basalTotal = dosesPerMinute.reduce(function(a, b) {return a + b})

  return basalTotal.toFixed(2)
}

var calculate = function(pumpSettings) {
  pumpSettings.basal.rows.pop()

  var doses = timing(pumpSettings.basal.rows)
  var dosesPerMinute = minuteDoseBreakdown(doses)
  var dosesPerHour = hourDoseBreakDown(dosesPerMinute)
  /*
  Sanity

  if(doses) {
    var totalD = doses.map(function(x) { return x.activeUnits}).reduce(function(x,y) { return x + y})
    var totalM = dosesPerMinute.reduce(function(x,y) { return x + y})
    var totalH = dosesPerHour.reduce(function(x,y) { return x + y})
  }
  */

  // todo: ask if you want an overlapping hour, her math added up to 25
  if(doses) {
    var basalDoseMorning = (dosesPerHour[7] +
      dosesPerHour[8] +
      dosesPerHour[9] +
      dosesPerHour[10] +
      dosesPerHour[11] +
      dosesPerHour[12] +
      dosesPerHour[13] +
      dosesPerHour[14] +
      dosesPerHour[15] +
      dosesPerHour[16] +
      dosesPerHour[17] +
      dosesPerHour[18]) * 1.2

    var basalDoseAfternoon = (dosesPerHour[19] +
      dosesPerHour[20] +
      dosesPerHour[21] +
      dosesPerHour[22] +
      dosesPerHour[23] +
      dosesPerHour[0] +
      dosesPerHour[1] +
      dosesPerHour[2] +
      dosesPerHour[3] +
      dosesPerHour[4] +
      dosesPerHour[5] +
      dosesPerHour[6]) * 1.2

    var rapidDoseBreakDown = {
      't24': roundHalf(dosesPerHour[0] + dosesPerHour[1] + dosesPerHour[2] + dosesPerHour[3]),
      't4': roundHalf(dosesPerHour[4] + dosesPerHour[5] + dosesPerHour[6] + dosesPerHour[7]),
      't8': roundHalf(dosesPerHour[8] + dosesPerHour[9] + dosesPerHour[10] + dosesPerHour[11]),
      't12': roundHalf(dosesPerHour[12] + dosesPerHour[13] + dosesPerHour[14] + dosesPerHour[15]),
      't16': roundHalf(dosesPerHour[16] + dosesPerHour[17] + dosesPerHour[18] + dosesPerHour[19]),
      't20': roundHalf(dosesPerHour[20] + dosesPerHour[21] + dosesPerHour[22] + dosesPerHour[23])
    }
  }

  return {
    basalDoseMorning: roundHalf(basalDoseMorning),
    basalDoseAfternoon: roundHalf(basalDoseAfternoon),
    rapidDoseBreakDown: rapidDoseBreakDown,
    carbRatio: Math.round(average(pumpSettings.carbRatio.rows)),
    insulinSensitivity: average(pumpSettings.insulinSensitivity.rows).toFixed(1)
  }
}
