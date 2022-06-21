<template>
    <div>
        <JqxGrid @cellbeginedit="cellBeginEditEvent($event)" @cellendedit="cellEndEditEvent($event)"
                 :columns="columnsInfo" :source="dataAdapter"
                 :editable="true" :enabletooltips="true" :selectionmode="'multiplecellsadvanced'">
        </JqxGrid>
        <div style="font-size: 12px; font-family: Verdana; margin-top: 30px;">
            <div ref="beginEdit"></div>
            <div ref="endEdit" style="margin-top: 10px;"></div>
        </div>
    </div>
</template>
<script>
    import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
    export default {
        layout: "DespachoDashboardLayout",
        components: {
            JqxGrid
        },
        data(){
          return {
              columnsInfo: [
                 { text: 'Contact Name', datafield: 'ContactName', width: 240 },
                 { text: 'Contact Title', datafield: 'Title', width: 240 },
                 { text: 'City', datafield: 'City', width: 150 },
                 { text: 'Country', datafield: 'Country' }
             ],
                getWidth: "'98%'",
                dataAdapter: new jqx.dataAdapter(this.source)
            }
        },
        beforeCreate: function () {
                     this.source = {
             localdata: [
                 ['Maria Anders', 'Sales Representative', 'Berlin', 'Germany'],
                 ['Ana Trujillo', 'Owner', 'Mxico D.F.', 'Mexico'],
                 ['Antonio Moreno', 'Owner', 'Mxico D.F.', 'Mexico'],
                 ['Thomas Hardy', 'Sales Representative', 'London', 'UK'],
                 ['Christina Berglund', 'Order Administrator', 'Lule', 'Sweden'],
                 ['Hanna Moos', 'Sales Representative', 'Mannheim', 'Germany'],
                 ['Frdrique Citeaux', 'Marketing Manager', 'Strasbourg', 'France'],
                 ['Martn Sommer', 'Owner', 'Madrid', 'Spain'],
                 ['Laurence Lebihan', 'Owner', 'Marseille', 'France'],
                 ['Elizabeth Lincoln', 'Accounting Manager', 'Tsawassen', 'Canada'],
                 ['Victoria Ashworth', 'Sales Representative', 'London', 'UK'],
                 ['Patricio Simpson', 'Sales Agent', 'Buenos Aires', 'Argentina']
             ],
             datafields: [
                 { name: 'ContactName', type: 'string', map: '0' },
                 { name: 'Title', type: 'string', map: '1' },
                 { name: 'City', type: 'string', map: '2' },
                 { name: 'Country', type: 'string', map: '3' }
             ],
             datatype: 'array'
         };
        },
        methods: {
            cellBeginEditEvent: function (event) {
                let args = event.args;
                this.$refs.beginEdit.innerHTML = 'Event Type: cellbeginedit, Column: ' + args.datafield + ', Row: ' + (1 + args.rowindex) + ', Value: ' + args.value;
            },
            cellEndEditEvent: function (event) {
                let args = event.args;
                this.$refs.endEdit.innerHTML = 'Event Type: cellendedit, Column: ' + args.datafield + ', Row: ' + (1 + args.rowindex) + ', Value: ' + args.value;
            }
        }
    }
</script>
