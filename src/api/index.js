import axios from "axios";

export async function fetchLocation() {
  return await axios.get("../assets/initLocation.json");
}

export async function fetchLocations(inputText) {
  const queryParams = new URLSearchParams({
    key: "pk.7eb1ffef27f722e89d8ee135078399b4",
    q: inputText,
    limit: 5
  });
  const url = "https://api.locationiq.com/v1/autocomplete.php?";

  const { data } = await axios.get(url + queryParams);

  const dataWithId = data.map((el) => {
    return { ...el, id: el.place_id, label: el.display_name };
  });

  return dataWithId;
}
