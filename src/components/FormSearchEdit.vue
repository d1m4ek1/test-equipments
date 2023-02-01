<template>
  <div class="block">
    <h2>Поиск, редактирование и удаление записей</h2>

    <form class="block_form">
      <div class="block_form__input">
        <p>Тип оборудования</p>
        <select
          class="input"
          name="type_equipment"
          v-model="formData.typeEquipment.value"
        >
          <option selected disabled>Типы оборудования</option>
          <option @click="getSearchResults()" value="">Не выбрано</option>
          <option
            v-for="(item, idx) in typeEquipments"
            :key="`${idx}_equipment`"
            :value="item"
            @click="getSearchResults()"
          >
            {{ item }}
          </option>
        </select>
      </div>
      <div class="block_form__input">
        <p>Серийный номер</p>
        <input
          v-model="formData.serialNumbers.value"
          placeholder="Серийный номер"
          @input="getSearchResults()"
          class="input"
          name="serialNumbers"
          type="text"
        />
      </div>
      <div class="block_form__input">
        <p>Примечание</p>
        <textarea
          v-model="formData.note.value"
          placeholder="Примечание"
          @input="getSearchResults()"
          class="input"
          name="note"
        ></textarea>
      </div>
    </form>

    <div class="block_view_mode">
      <h3>Выбрать режим поиска</h3>
      <div class="radio_input">
        <input
          v-model="selectorViewMode"
          value="view"
          type="radio"
          name="view"
          id="radio_view_input"
        />
        <label for="radio_view_input">Просмотр</label>
      </div>
      <div class="radio_input">
        <input
          v-model="selectorViewMode"
          value="edit"
          type="radio"
          name="edit"
          id="radio_edit_input"
        />
        <label for="radio_edit_input">Редактирование</label>
      </div>
    </div>

    <ListEquipment
      :viewMode="selectorViewMode"
      :reloadEquipment="reloadEquipment"
    />
  </div>
</template>

<style scoped>
.block_form {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.block_form__input {
  width: 100%;
}

.block_form__input > .input {
  max-width: 100%;
}

.block_form > .block_form__input:not(:last-child) {
  margin-right: 15px;
}

.block_form .button {
  margin-top: 29px;
}

.block_form__input > p {
  margin-bottom: 10px;
}

.block_view_mode {
  margin-top: 20px;
}

.block_view_mode > h3 {
  margin-bottom: 10px;
}

@media screen and (max-width: 960px) {
  .block_form {
    flex-wrap: wrap;
  }

  .block_form__input {
    width: 45%;
    margin-right: 0 !important;
  }

  .block_form__input > input,
  .block_form__input > select,
  .block_form__input > textarea,
  .block_form > .button {
    width: 100%;
    max-width: 100%;
  }
}

@media screen and (max-width: 540px) {
  .block_form {
    flex-wrap: nowrap;
    flex-direction: column;
  }

  .block_form__input {
    width: 100%;
  }

  .block_form__input:not(:first-child) {
    margin-top: 15px;
  }
}
</style>

<script>
import ListEquipment from "./ListEquipment.vue";
import { GetSearchResults } from "../API/API";

export default {
  name: "FormSearchEdit",
  data() {
    return {
      formData: {
        typeEquipment: {
          value: "",
          isValid: true,
        },
        serialNumbers: {
          value: "",
          isValid: true,
        },
        note: {
          value: "",
        },
      },
      typeEquipments: ["TP-Link TL-WR74", "D-Link DIR-300", "D-Link DIR-300 E"],
      selectorViewMode: "view",
      errors: {
        isValidFormData: true,
      },
      timeoutForQuery: null,
      reloadEquipment: false,
    };
  },
  methods: {
    getSearchResults() {
      clearTimeout(this.timeoutForQuery);
      this.reloadEquipment = true;

      if (+this.$route.query.page !== 1) {
        this.$router.push({ name: "pagination", query: { page: 1 } });
      }

      this.timeoutForQuery = setTimeout(async () => {
        const result = await GetSearchResults(
          this.formData.typeEquipment.value,
          this.formData.serialNumbers.value,
          this.formData.note.value
        );

        this.$store.commit({
          type: "setSearchData",
          typeEquipment: this.formData.typeEquipment.value,
          serialNumbers: this.formData.serialNumbers.value,
          note: this.formData.note.value,
        });

        this.$store.commit({
          type: "setListEquipment",
          list: result,
        });

        this.reloadEquipment = false;
      }, 500);
    },
  },
  components: {
    ListEquipment,
  },
};
</script>
