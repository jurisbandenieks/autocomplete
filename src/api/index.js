import axios from "axios";

export async function fetchLocations(inputText) {
  const queryParams = new URLSearchParams({
    key: "pk.7eb1ffef27f722e89d8ee135078399b4",
    q: inputText,
    limit: 5
  });
  const url = "https://api.locationiq.com/v1/autocomplete.php?";

  return await axios.get(url + queryParams);
}
