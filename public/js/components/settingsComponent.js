Vue.component('settings-module',{
  template: "<table><tr><th v-for='header in propdata.headers'>{{ header }}</th></tr><tr v-for='row in propdata.rows'><td v-for='cell in row'><input v-bind:value='cell' v-on:change='onChange'></td></tr></table>",
  created: function() {
    this.appendRow();
    this.clearEmptyRows();
  },
  props: ['propdata'],
  beforeUpdate: function() {
    console.log('beforeUpdate', this.propdata)
    this.appendPolice()
  },
  methods: {
    appendRow: function() {
      this.propdata.rows.push(new Array(this.propdata.headers.length));
    },
    pickupValues: function() {
      var rowLength = this.propdata.headers.length;
      var inputs = $(this.$el).find('input').toArray().map(function(el) { return $(el).val() });
      var rows = [];

      while(inputs.length) {
        rows.push(inputs.splice(0, rowLength));
      }

      this.propdata.rows = rows;
      this.appendPolice();
    },
    onChange: function() {
      this.pickupValues();
      this.clearEmptyRows();
    },
    clearEmptyRows: function() {
      for(var i = 0; i < this.propdata.rows.length - 1; i++) {
        if (this.propdata.rows[i].reduce(function(x,y) {return x + y;}) == "") {
          this.propdata.rows.splice(i,1);
          console.log('splicing');
        }
      }
    },
    appendPolice: function() {
      var last = [""];
      if (this.propdata.rows.length) {
        last = JSON.parse(JSON.stringify(this.propdata.rows[this.propdata.rows.length - 1]));
      }
      var lastReduce = last.reduce(function(x,y) {if(!x)x=''; if(!y)y=''; return x + y;});

      if (lastReduce != "") {
        this.appendRow();
      }
    }
  }
})
