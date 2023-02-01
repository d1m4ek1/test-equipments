<template>
  <div class="block">
    <h2>Добавить оборудование</h2>

    <div class="block_form">
      <div class="block_form__input">
        <p>*Тип оборудования</p>
        <select
          class="input"
          :class="{ error_input: !formData.typeEquipment.isValid }"
          name="type_equipment"
          v-model="formData.typeEquipment.value"
        >
          <option selected disabled>Выберите тип оборудования</option>
          <option
            v-for="(item, idx) in typeEquipments"
            :key="`${idx}_equipment`"
            :value="item"
          >
            {{ item }}
          </option>
        </select>
      </div>
      <div class="block_form__input">
        <p>*Серийный номер</p>
        <input
          v-model="formData.serialNumbers.value"
          placeholder="Серийный номер"
          class="input"
          :class="{ error_input: !formData.serialNumbers.isValid }"
          name="serial_numbers"
          type="text"
        />
      </div>
      <div class="block_form__input">
        <p>Примечание</p>
        <textarea
          placeholder="Примечание"
          v-model="formData.note.value"
          class="input"
          name="note"
        ></textarea>
      </div>
      <button class="button" @click="onSubmit($event)">Добавить</button>
    </div>
    <div v-if="!isDataLoaded" class="loader">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <p class="error_text" v-if="!errors.isValidFormData">
      *Заполните обязательные поля
    </p>
    <p class="successfully_text" v-if="notify.isSuccessfullyAdded">
      Оборудование успешно добавлено
    </p>
  </div>
</template>

<style scoped>
.block {
  position: relative;
}

.block_form {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.block_form__input {
  width: 100%;
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

.loader {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 5px;
  background-color: rgba(97, 97, 97, 0.342);
  height: 100%;
}
.loader > .lds-ring {
  top: 50%;
  transform: translateY(-50%);
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
import { AddEquipmentItem } from "../API/API";

export default {
  data() {
    return {
      formData: {
        typeEquipment: {
          value: "Выберите тип оборудования",
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
      errors: {
        isValidFormData: true,
      },
      notify: {
        isSuccessfullyAdded: false,
      },
      isDataLoaded: true,
    };
  },
  methods: {
    clearInputs() {
      this.formData.typeEquipment.value = "Выберите тип оборудования";
      this.formData.serialNumbers.value = "";
      this.formData.note.value = "";
    },
    async onSubmit(event) {
      event.preventDefault();
      let isValidInput = true;

      Object.keys(this.formData).forEach((key) => {
        isValidInput
          ? (isValidInput = this.inputValidate(this.formData[key].value, key))
          : this.inputValidate(this.formData[key].value, key);
      });

      this.errors.isValidFormData = isValidInput;

      if (!isValidInput) return;

      this.isDataLoaded = false;

      this.isDataLoaded = await AddEquipmentItem({
        typeEquipment: this.formData.typeEquipment.value,
        serialNumber: this.formData.serialNumbers.value,
        note: this.formData.note.value,
        isEdited: false,
        isEditSaved: 0,
        id: Math.floor(Math.random() * 20000),
      });

      this.clearInputs();
      this.notify.isSuccessfullyAdded = true;
      setTimeout(() => {
        this.notify.isSuccessfullyAdded = false;
      }, 2000);
    },
    inputValidate(string, key) {
      if (key === "note") return true;

      if (string === "" || string === "Выберите тип оборудования") {
        this.formData[key].isValid = false;
        return false;
      }

      this.formData[key].isValid = true;

      return true;
    },
  },
};
</script>
