const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}


const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value || 1;
  
    // Construct the API URL
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  
    console.log("Fetching URL:", URL);
  
    try {
      let response = await fetch(URL);
  
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      let data = await response.json();
      console.log("API Response Data:", data); // Debugging
  
      // Extract exchange rate
      let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
  
      if (!rate) {
        throw new Error(`Currency code ${toCurr.value.toLowerCase()} not found in API response`);
      }
  
      let finalAmount = amtVal * rate;
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
  
      // Use fallback API
      const FALLBACK_URL = `https://latest.currency-api.pages.dev/v1/currencies/${fromCurr.value.toLowerCase()}.json`;
  
      try {
        let fallbackResponse = await fetch(FALLBACK_URL);
  
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback API Error! Status: ${fallbackResponse.status}`);
        }
  
        let fallbackData = await fallbackResponse.json();
        console.log("Fallback API Response Data:", fallbackData); // Debugging
  
        let fallbackRate = fallbackData[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
  
        if (!fallbackRate) {
          throw new Error(`Currency code ${toCurr.value.toLowerCase()} not found in fallback API response`);
        }
  
        let finalAmount = amtVal * fallbackRate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
      } catch (fallbackError) {
        console.error("Error fetching from fallback API:", fallbackError);
        msg.innerText = "Failed to fetch exchange rate. Please try again later.";
      }
    }
  };


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});