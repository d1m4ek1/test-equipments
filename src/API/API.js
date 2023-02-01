import EquipmentData from "./EquipmentData";

export const GetSearchResults = async (type, serialNumber, note) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let data = [];

  for (let i = 0; i < EquipmentData.length; i++) {
    const el = EquipmentData[i];

    let condition = [];

    if (type !== "") {
      condition.push("type === el.typeEquipment");
    }

    if (serialNumber !== "") {
      condition.push("serialNumber === el.serialNumber");
    }

    if (note !== "") {
      condition.push("note === el.note");
    }

    if (eval(condition.join("&&"))) {
      data.push(el);
    }

    if (condition.length === 0) {
      data.push(el);
    }
  }

  return data;
};

export const RemoveEquipmentItem = async (itemId) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const findedIndex = EquipmentData.findIndex((element) => element.id === itemId);

  if (findedIndex !== undefined && !isNaN(findedIndex)) {
    EquipmentData.splice(findedIndex, 1);
    return [true, EquipmentData.length];
  }

  return [false, EquipmentData.length];
};

export const AddEquipmentItem = async (item) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  EquipmentData.push(item);

  return true;
};

export const SaveChangesEquipment = async (itemId, object) => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const findedIndex = EquipmentData.findIndex((element) => element.id === itemId);

  if (findedIndex !== undefined && !isNaN(findedIndex)) {
    Object.keys(object).forEach((key) => {
      EquipmentData[findedIndex][key] = object[key];
    });
    return true;
  }

  return false;
};
