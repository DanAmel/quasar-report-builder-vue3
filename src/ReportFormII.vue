<template>
  <div class="row q-mb-sm q-mt-xs">
  </div>
</template>

<script>

import get from "lodash/get";
import orderBy from "lodash/orderBy"
import clone from 'lodash/cloneDeep'
//import { useVuelidate } from '@vuelidate/core'
import {Parser} from 'expr-eval'
import SQLConfig from "./SQLConfig";
import { useQuasar } from 'quasar'



export default {
  name: 'ReportForm',
  components: {
    TabData: () => import('./TabData'),
    //TabCross: () => import('./TabCross'),
    //TabChart: () => import('./TabChart'),
  },


  data() {
    return {
     // v$: useVuelidate(),
      $q: useQuasar(),
      dialog: false,
      maximizedToggle: true,
      mReport: null,
      is_all: true,
      apply_filter: false,
      loading: false,
      tab: 'tab-data',
      pageSizeSelected: {code: 'A4', name: 'A4'},
      request_mode: {id: 1, name: "Vue", code: "view"},
      pageOrientationSelected: {code: 'portrait', name: 'Portrait'},
      reportListOptions: [],
      requestModeOptions: [
        {id: 1, name: "Vue", code: "view"},
        {id: 2, name: "SQL", code: "sql"},
      ],
      pageSizeList: [
        {code: 'A4', name: 'A4'},
        {code: 'A3', name: 'A3'},
        {code: 'A2', name: 'A2'},
        {code: 'A1', name: 'A1'},
        {code: 'A0', name: 'A0'},
      ],
      pageOrientationList: [
        {code: 'portrait', name: 'Portrait'},
        {code: 'landscape', name: 'Paysage'},
      ],
      newFilter: {
        isValid: false,
        isChart: false,
        title: null,
        dateReport: null,
        operand_date: null,
        request_mode: null,
        columns: [],
        conditions: [],
        groupBy: [],
        orderBy: [],
        column_cross: [],
        line_cross: [],
        value_cross: [],
        formulas: [],
        app_code: '',
        app_notice: '',
        options: {},
      },
      validator: this.v$,
      conditionList: [
        {name: 'ET', code: 'and'},
        {name: 'OU', code: 'or'},
      ],
      operandList: [
        {name: 'Egal', code: 'equals'},
        {name: 'Différent', code: 'not-equal'},
        {name: 'Contient', code: 'contains'},
        {name: 'Supérieur', code: 'gt'},
        {name: 'Inférieur', code: 'lt'},
        {name: 'Supérieur =', code: 'gte'},
        {name: 'Inférieur =', code: 'lte'},
        {name: 'Commence par', code: 'start'},
        {name: 'Fini par', code: 'end'},
        {name: 'Entre', code: 'between'},
        {name: 'Est null', code: 'isNull'},
        {name: 'Diff. de null', code: 'isNotNull'}
      ],
      aggregatList: [
        {name: 'MIN', code: 'min'},
        {name: 'MAX', code: 'max'},
        {name: 'NOMBRE', code: 'count'},
        {name: 'SOMME', code: 'sum'},
        {name: 'DISTINCT', code: 'distinct'},
        {name: 'MOYENNE', code: 'avg'},
      ],
      orderList: [
        {name: 'ASC', code: 'asc'},
        {name: 'DESC', code: 'desc'},
      ],
      reportFilter: []
    }
  },

  /*validations() {
    return {
      mReport: {required},
      newFilter: {
        title: {required},
        dateReport: {required},
        operand_date: {required},
        columns: {
          required,
         /!* $each: {
            column: {required},
          }*!/
        },
        formulas: {
          /!*$each: {
            expression: {required, expression},
            alias: {required},
            variables: {checkVariable},
          }*!/
        },
        conditions: {
          /!*$each: {
            condition: {required},
            column: {required},
            operand: {required},
            column_attribut: {
              required: requiredIf(function (model) {
                return model.use_variable
              })
            },
          }*!/
        },
        orderBy: {
          /!*$each: {
            column: {required},
            sens: {required},
          }*!/
        },
        groupBy: {
          /!*$each: {
            column: {required}
          }*!/
        },

        column_cross: {
          /!*$each: {
            column: {required},
          }*!/
        },

        line_cross: {
          /!*$each: {
            column: {required},
          }*!/
        },

        value_cross: {
          /!*$each: {
            column: {required},
            //aggregat: {required},
          }*!/
        },

        request_editor: {
          sql: {
            required: requiredIf(function (model) {

              return this.newFilter.request_mode === "sql"
            })
          }
        },

        chart: {
          chartComplexity: {
            required: requiredIf(function (model) {
              return this.newFilter.isChart
            })
          },
          chartType: {
            required: requiredIf(function (model) {
              return this.newFilter.isChart
            })
          },
          xaxisname: {
            required: requiredIf(function (model) {
              return this.newFilter.isChart
            })
          },
          yaxisname: {
            required: requiredIf(function (model) {
              return this.newFilter.isChart
            })
          },
          series: {
            required: requiredIf(function (model) {
              return this.newFilter.isChart
            })
          },
          category: {
            required: requiredIf(function (model) {
              return this.newFilter.isChart
            })
          },


        }

      }
    }
  },*/

  methods: {
    get,

    onModeChange(value) {
      if (value)
        this.tab = 'tab-chart'
      else
        this.tab = 'tab-data'
    },

    hide(evt) {
      this.dialog = false
    },

    showNotification(notification) {
      this.$emit('showNotification', notification)
    },

    showHideLoading(show) {
      this.$emit('showHideLoading', show)
    },

    filterModules(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        let modules = orderBy(this.reportList, 'table_description', 'asc')
        this.reportListOptions = modules.filter(v => get(v, 'table_description', '').toLowerCase().indexOf(needle) > -1)
      })
    },


  },

  computed: {


    isRequestMode() {
      return this.request_mode && this.request_mode.code !== "view"
    },

    columns() {
      let data = []
      try {

        data = get(this.mReport, 'columns', []).map(x => {

          let comment = JSON.parse(get(x, 'column_comment'))
          let agregats = this.getAvailaibleAgregats(get(x, 'type'))
          let operands = this.getAvailaibleOperands(get(x, 'type'))

          return {
            name: get(comment, 'comment'),
            code: get(x, 'column_name'),
            type: get(x, 'type'),
            data: get(comment, 'value'),
            aggregats: agregats,
            operands: operands,
          }
        })
      } catch (error) {
        console.log('error', error)
      }

      return data
    },

    dateColumns() {
      let data = []
      if (this.columns) {
        data = this.columns.filter(x => (x.type === 'date' || x.type === 'timestamptz'))
      }
      return data
    },

    getColumnsGroupBy() {
      return this.newFilter.columns.map(x => {
        return {code: get(x, 'column.code'), name: get(x, 'column.name'), sumData: false}
      })
    },

    filterReport() {
      this.v$.$touch()

      let data = this.generateFilter()
      data.isValid = !this.v$.$invalid
      //console.log("datadata", data)

      //this.$emit('update:modelValue', clone(data))
      return data
    },

    canShowSQLConfig() {
      return this.canEditRequest && this.request_mode && this.request_mode.code === "sql"
    },
    canSave() {
      return this._can('create_pdf_params') || this._can('update_pdf_params')
    },

  },

  async mounted() {
  },

  watch: {

    /*'modelValue': {
      handler: async function (val, oldVal) {
        if (val) {
          this.newFilter = clone(val)
          if (Array.isArray(this.reportList) && this.reportList.length <= 0) {

          }
          await this.mapForm()
        }
      },
      deep: true,
      immediate: true,
    },

    'reportList': {
      handler: async function (val, oldVal) {
        if (val) {
          if (!this.newFilter.request_mode || this.newFilter.request_mode !== "sql") {
            this.mReport = this.reportList.find(x => get(x, 'table_name') === get(this.newFilter, 'table'))
            let temp = this.dateColumns.find(x => x.code === get(this.newFilter, 'column_date'))
            this.newFilter = {...this.newFilter, dateReport: temp ? temp : null}
            this.reportListOptions = orderBy(val, 'table_description', 'asc')
          } else {
            this.mReport = this.newFilter.request_editor.module
          }

        }
      },
      deep: true,
      immediate: true,
    },*/

  }

}
</script>
