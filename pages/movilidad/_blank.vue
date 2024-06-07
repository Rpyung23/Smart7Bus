<template>
  <div class="content">
    <div class="image-container">
      <img :src="logo" alt="Centered Image" class="circular-image" />
    </div>
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
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";

export default {
  mixins: [clientPaginationMixin],
  layout: "DashboardLayoutMovilidad",
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
      logo: this.$cookies.get("logo"),
    };
  },
  methods: {
  },
  mounted() {
  },
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: white; /* Fondo blanco */
  overflow: hidden; /* Evita el scroll */
}

.content {
  /*display: flex;*/
  justify-content: center;
  align-items: center;
  height: 100vh;
  /*overflow: hidden; /* Evita el scroll */
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0px; /* Ajusta este valor para mover la imagen hacia arriba */
}

.circular-image {
  width: 37rem;
  height: 37rem;
  /* border-radius: 50%; */
  /* border: 3px solid #000; */ /* Puedes cambiar el color del borde aquí */
  object-fit: cover; /* Esto se asegura de que la imagen se escale correctamente dentro del borde circular */
}
</style>
