<template>
  <div class="items_equipment">
    <h3>Список оборудований</h3>
    <template v-if="viewMode === 'view'">
      <template
        v-for="(item, idx) in itemsEquipment"
        :key="`${idx}_item_equipment`"
      >
        <div class="items_equipment__item">
          <div class="blocks_input_edit">
            <p>Тип оборудования: {{ item.typeEquipment }}</p>
            <p>Серийный номер: {{ item.serialNumber }}</p>
            <p>Примечание: {{ item.note === "" ? "-" : item.note }}</p>
          </div>
        </div>
      </template>
    </template>
    <template v-if="viewMode === 'edit'">
      <div
        v-for="(item, idx) in itemsEquipment"
        :key="`${idx}_item_equipment`"
        class="items_equipment__item edit_item"
        :class="{
          equipment_edited: item.isEdited,
          equipment_saved: item.isEditSaved === 1,
          error_block: item.isEditSaved === -1,
        }"
      >
        <div class="blocks_input_edit">
          <div class="block_input_edit">
            <p>Тип оборудования:&nbsp;</p>
            <select
              name="type_equipment"
              v-model="item.typeEquipment"
              @input="item.isEdited = true"
            >
              <option selected disabled>Типы оборудования</option>
              <option
                v-for="(typeItem, idxTypes) in typeEquipments"
                :key="`${idx}_${idxTypes}_equipment`"
                :value="typeItem"
              >
                {{ typeItem }}
              </option>
            </select>
          </div>
          <div class="block_input_edit">
            <p>Серийный номер:&nbsp;</p>
            <input
              type="text"
              v-model="item.serialNumber"
              @input="item.isEdited = true"
            />
          </div>
          <div class="block_input_edit">
            <p>Примечание:&nbsp;</p>
            <input
              type="text"
              v-model="item.note"
              @input="item.isEdited = true"
            />
          </div>
        </div>

        <div class="edit_panel">
          <button @click="onRemoveEquipment(item.id, idx)">Удалить</button>
          <button v-if="item.isEdited" @click="saveChanges(item.id, item, idx)">
            Сохранить
          </button>
        </div>

        <div v-if="item.isEditSaved === 2" class="loader technical_loader">
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="!isDataLoaded || isTechnicalLoader"
      class="loader"
      :class="{ technical_loader: isTechnicalLoader }"
    >
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div v-if="itemsEquipment.length === 0 && isDataLoaded">
      <p>Оборудование не найдено</p>
      <button @click="getSearchResults()" class="button">
        Попробовать еще раз
      </button>
    </div>
    <Pagination
      v-if="isDataLoaded & !isTechnicalLoader"
      :totalPages="totalPages"
    />
  </div>
</template>

<style scoped>
.items_equipment {
  margin-top: 20px;
  position: relative;
}
.items_equipment > h3 {
  margin-bottom: 20px;
}
.items_equipment__item {
  position: relative;
  width: 100%;
  height: 60px;
  padding: 5px 10px;
  margin-bottom: 10px;
  border: 1px rgb(200, 200, 200) solid;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.blocks_input_edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.block_input_edit {
  display: flex;
}

.block_input_edit > input,
.block_input_edit > select {
  font-size: 15px;
  padding-left: 3px;
  border: 1px solid;
  border-radius: 3px;
  background-color: white;
}

.edit_panel > button:not(:last-child) {
  margin-right: 10px;
}

.technical_loader {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(97, 97, 97, 0.342);
  height: 100%;
  border-radius: 5px;
}

.technical_loader > .lds-ring {
  top: 50%;
  transform: translateY(-50%);
}

.equipment_edited {
  border: 1px solid orange;
}

.equipment_saved {
  border: 1px solid rgb(0, 210, 0);
}

@media screen and (max-width: 1100px) {
  .items_equipment__item {
    height: 80px;
  }
  .blocks_input_edit {
    flex-wrap: wrap;
    justify-content: space-around;
  }
}

@media screen and (max-width: 800px) {
  .items_equipment__item.edit_item {
    height: 100px !important;
  }
  .blocks_input_edit {
    flex-wrap: nowrap;
    flex-direction: column;
    align-items: flex-start;
  }

  .block_input_edit {
    width: 100%;
    justify-content: space-between;
  }

  .block_input_edit > input,
  .block_input_edit > select,
  .block_input_edit > textarea {
    width: 60%;
  }
}

@media screen and (max-width: 450px) {
  .items_equipment__item.edit_item {
    height: 170px !important;
  }
  .block_input_edit {
    flex-direction: column;
    margin-bottom: 5px;
  }

  .block_input_edit > input,
  .block_input_edit > select,
  .block_input_edit > textarea {
    width: 100%;
  }
}
</style>

<script>
import {
  GetSearchResults,
  RemoveEquipmentItem,
  SaveChangesEquipment,
} from "../API/API";
import Pagination from "./Pagination.vue";

export default {
  props: {
    viewMode: String,
    reloadEquipment: Boolean,
  },
  watch: {
    reloadEquipment: {
      handler(reload) {
        if (reload) {
          this.isDataLoaded = false;
          this.itemsEquipment = [];
        } else {
          this.isDataLoaded = true;

          let maxNumberEquipments =
            +this.$route.query.page * this.$store.getters.getNumberOfEquipments;

          for (
            let i =
              maxNumberEquipments - this.$store.getters.getNumberOfEquipments;
            i < maxNumberEquipments;
            i++
          ) {
            const element = this.$store.getters.getListEquipment[i];
            if (element === undefined) break;
            this.itemsEquipment.push(element);
          }

          this.totalPages = Math.ceil(
            this.$store.getters.getListEquipment.length /
              this.$store.getters.getNumberOfEquipments
          );
        }
      },
      deep: true,
    },
    "$route.query.page": {
      handler(newPage) {
        this.getSearchResults();
      },
      deep: true,
    },
  },
  data() {
    return {
      itemsEquipment: [],
      isDataLoaded: false,
      isTechnicalLoader: false,
      totalPages: 1,
      typeEquipments: ["TP-Link TL-WR74", "D-Link DIR-300", "D-Link DIR-300 E"],
    };
  },
  methods: {
    async getSearchResults() {
      this.isDataLoaded = false;
      this.itemsEquipment = [];

      const result = await GetSearchResults(
        this.$store.getters.getTypeEquipmentSearch,
        this.$store.getters.getTypeSerialNumbersSearch,
        this.$store.getters.getTypeNoteSearch
      );

      let maxNumberEquipments =
        (this.$route.query.page === undefined ? 1 : +this.$route.query.page) *
        this.$store.getters.getNumberOfEquipments;

      for (
        let i = maxNumberEquipments - this.$store.getters.getNumberOfEquipments;
        i < maxNumberEquipments;
        i++
      ) {
        const element = result[i];
        if (element === undefined) break;
        this.itemsEquipment.push(element);
      }

      this.totalPages = Math.ceil(
        result.length / this.$store.getters.getNumberOfEquipments
      );

      this.isDataLoaded = true;
    },
    async onRemoveEquipment(itemId, idx) {
      this.isDataLoaded = false;
      this.isTechnicalLoader = true;

      let [isSuccessfully, equipmentDataLength] = await RemoveEquipmentItem(
        itemId
      );

      if (isSuccessfully) {
        this.itemsEquipment.splice(idx, 1);

        this.totalPages = Math.ceil(
          equipmentDataLength / this.$store.getters.getNumberOfEquipments
        );

        this.isDataLoaded = true;
        this.isTechnicalLoader = false;
      }
    },
    async saveChanges(itemId, object, idx) {
      this.itemsEquipment[idx].isEditSaved = 2;

      const response = await SaveChangesEquipment(itemId, {
        typeEquipment: object.typeEquipment,
        serialNumber: object.serialNumber,
        note: object.note,
      });

      if (response) {
        this.itemsEquipment[idx].isEdited = false;
        this.itemsEquipment[idx].isEditSaved = 1;

        setTimeout(() => {
          if (this.itemsEquipment[idx] !== undefined) {
            this.itemsEquipment[idx].isEditSaved = 0;
          }
        }, 2000);
      }
    },
  },
  created() {
    this.getSearchResults();
  },
  components: {
    Pagination,
  },
};
</script>