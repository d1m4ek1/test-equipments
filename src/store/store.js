import { createApp } from "vue";
import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      listEquipment: [],
      numberOfEquipments: 10,
      searchData: {
        typeEquipment: "",
        serialNumbers: "",
        note: "",
      },
    };
  },
  mutations: {
    setListEquipment: (state, data) => (state.listEquipment = data.list),
    setNumberOfEquipments: (state, data) => (state.numberOfEquipments = data.number),
    setSearchData: (state, data) => {
      state.searchData.typeEquipment = data.typeEquipment;
      state.searchData.serialNumbers = data.serialNumbers;
      state.searchData.note = data.note;
    },
  },
  getters: {
    getListEquipment: (state) => state.listEquipment,
    getNumberOfEquipments: (state) => state.numberOfEquipments,
    getTypeEquipmentSearch: (state) => state.searchData.typeEquipment,
    getTypeSerialNumbersSearch: (state) => state.searchData.serialNumbers,
    getTypeNoteSearch: (state) => state.searchData.note,
  },
});

export default store;
