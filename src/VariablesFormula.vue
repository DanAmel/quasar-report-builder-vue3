<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="true">
    <q-card class="q-dialog-plugin" style="width: 850px; max-width: 80vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Selectionnez les variables</div>
      </q-card-section>

      <q-card-section class="q-pa-md q-mt-md">

        <div class="row justify-center q-pt-md">


            <q-select  dense outlined class="col-sm-5 col-xs-12 clearable q-pr-md q-pt-md"
                       v-for="(variable, index) in variables" v-bind:key="index"
               ref="mySelect"
               v-model="form.variables[index].column"
               :label="variable"
               :options="availableFilterColumns"
               :hide-bottom-space="true"
               option-label="name" option-value="code"
               :options-dense="true"
               use-input input-debounce="0"
               error-message="Champ requis."
               :@m-blur="v$.form.variables.$each.$response.$data[index].column.$touch"
               :error="v$.form.variables.$each.$response.$data[index].column.$error"
               @filter="filterAvailableColumns">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Pas de colonnes
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

        </div>

      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right" class="bg-white text-primary">
        <q-btn color="primary" flat label="Annuler" @click="onCancelClick"/>
        <q-btn color="primary" label="Valider" @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'
import { required, helpers} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'


export default {
  name: 'VariableFormulaForm',
  emits: [...useDialogPluginComponent.emits],

  setup () {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel
    }
  },
  props: {
    title: String,
    variables: Array,
    availableColumns: Array,
    item: Object,
    iconType: {
      type: String,
      default: 'fa fa-',
    },
  },

  data() {
    return {
      v$: useVuelidate(),
      form: {
        $each: helpers.forEach({
          variables: {required},
        })
      },
      availableFilterColumns: [],
      dialogRef: {}

    }
  },

  validations() {
    return {
      form: {
        variables: {
          $each: helpers.forEach({
            column: {required},
          })
        },

      }
    }
  },

  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialogRef.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialogRef.hide()
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      try {
        let res =  this.submit()
        this.onDialogOK(res)
      } catch (e) {
      }
    },

    /*onCancelClick() {
      // we just need to hide dialog
      this.hide()
    },*/

    filterAvailableColumns (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.availableFilterColumns = this.availableColumns.filter(v => v.name && v.name.toLowerCase().indexOf(needle) > -1)
      })
    },

    async prefetchList() {
    },

    submit() {
      this.v$.form.$touch()
      if (this.v$.form.$error) {
        return false
      }

      let data = this.form.variables.map(x =>{
        return {
          column: {name: x.column.name, code: x.column.code, type: x.column.type},
          variable: x.variable,
        }
      })
      return data
    },


    setForm() {
      this.form.variables = this.variables.map(x => {
        return {
          column: null,
          variable: x
        }
      })

      if(this.item.variables){
        this.form.variables.forEach((x, i) =>{
          let el = this.item.variables.find(y => y.variable === x.variable)
          if(el)
            this.form.variables[i].column = el.column
        })
      }

    },
  },

  computed: {

  },

  watch: {
    'availableColumns': {
       handler: function (val, oldVal) {
         //console.log('availableColumns change ')
       },
       deep: true,
     },
  },


  beforeMount() {
    this.setForm()
  },

  mounted() {

  },

}
</script>
