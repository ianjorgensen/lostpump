Vue.component('settings-module',{
  template: "<div class='table'><table><tr><th v-for='header in propdata.headers'>{{ header }}</th></tr><tr v-for='row in propdata.rows'><td v-for='cell in row'><input v-bind:value='cell' v-on:change='onChange'></td></tr></table><div class='sum' v-if='propdata.sum'>{{ propdata.sum }}</div></div>",
  created: function() {
    this.appendRow()
    this.clearEmptyRows()
  },
  props: ['propdata'],
  updated: function() {
    if (this.propdata.settingType == 'basal') {
      this.sumInsulin();
    }
  },
  beforeUpdate: function() {
    this.appendPolice()
  },
  methods: {
    appendRow: function() {
      this.propdata.rows.push(new Array(this.propdata.headers.length))
    },
    pickupValues: function() {
      var rowLength = this.propdata.headers.length
      var inputs = $(this.$el).find('input').toArray().map(function(el) { return $(el).val().replace(',','.') })
      var rows = []

      while(inputs.length) {
        rows.push(inputs.splice(0, rowLength));
      }

      this.propdata.rows = rows;
      this.appendPolice();
    },
    onChange: function() {
      this.pickupValues();
      this.clearEmptyRows();
      this.sortByTime();
      if (this.propdata.settingType == 'basal') {
        this.sumInsulin();
      }

    },
    clearEmptyRows: function() {
      for(var i = 0; i < this.propdata.rows.length - 1; i++) {
        if (this.propdata.rows[i].reduce(function(x,y) {return x + y;}) == "") {
          this.propdata.rows.splice(i,1);
          console.log('splicing');
        }

        if(this.propdata.rows[i][0] && this.propdata.rows[i][0].indexOf(':') == -1 && parseInt(this.propdata.rows[i][0]) < 24) {
          if(parseInt(this.propdata.rows[i][0]) < 10) {
            this.propdata.rows[i][0] = '0' + this.propdata.rows[i][0] + ':00';
          } else {
            this.propdata.rows[i][0] = this.propdata.rows[i][0] + ':00';
          }
        }
      }
    },
    sumInsulin: function() {
      var sum = calculateTotalBasal(JSON.parse(JSON.stringify(this.propdata)))
      console.log('sum',sum)

      if(sum && !isNaN(sum)) {
        this.propdata.sum = sum + ' ie/dag'
      }
    },
    sortByTime: function() {
      this.propdata.rows.sort(function(a,b) {
        var aVal = Number.MAX_SAFE_INTEGER;
        var bVal = Number.MAX_SAFE_INTEGER;

        if (a && a[0] && a[0].indexOf(':') != -1) {
          aVal = parseInt(a[0].split(':')[0])*60 + parseInt(a[0].split(':')[1])
        }

        if (b && b[0] && b[0].indexOf(':') != -1) {
          bVal = parseInt(b[0].split(':')[0])*60 + parseInt(b[0].split(':')[1])
        }

        return aVal - bVal;
      });
    },
    appendPolice: function() {
      var last = [""];
      if (this.propdata.rows.length) {
        last = JSON.parse(JSON.stringify(this.propdata.rows[this.propdata.rows.length - 1]));
      }
      var lastReduce = last.reduce(function(x,y) {if(!x)x=''; if(!y)y=''; return x + y;});

      if (lastReduce != "") {
        this.appendRow()
      }
    }
  }
})
