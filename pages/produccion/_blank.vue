<template>
    <div class="content">
    </div>
  </template>
  <script>
  import flatPicker from "vue-flatpickr-component";
  import "flatpickr/dist/flatpickr.css";
  import {
    Table,
    TableColumn,
    Select,
    Option,
    Autocomplete,
    Switch,
    DatePicker,
    RadioButton,
    Radio,
    Notification,
    Button,
  } from "element-ui";
  
  import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
  import { BasePagination } from "@/components/argon-core";
  import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
  import swal from "sweetalert2";
  import Tabs from "@/components/argon-core/Tabs/Tabs";
  import TabPane from "@/components/argon-core/Tabs/Tab";
  
  export default {
    mixins: [clientPaginationMixin],
    layout: "ProduccionDashboardLayout",
    components: {
      Tabs,
      TabPane,
      BasePagination,
      flatPicker,
      RouteBreadCrumb,
      [DatePicker.name]: DatePicker,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [Notification.name]: Notification,
      [Autocomplete.name]: Autocomplete,
      [TableColumn.name]: TableColumn,
      [RadioButton.name]: RadioButton,
      [Radio.name]: Radio,
      [Button.name]: Button,
      [Switch.name]: Switch
    },
    data() {
      return {
      };
    },
    methods: {
    },
    mounted() {
    },
  };
  </script>
  <style>
  </style>
  