const converter = document.querySelector(".converter");
const sendCurrencyButton = document.querySelector(".send-box .currency-select");
const receiveCurrencyButton = document.querySelector(
  ".receive-box .currency-select",
);
const currencyList = document.querySelector(".currency-list");
const sendAmountInput = document.querySelector("#send-amount");
const receiveAmountInput = document.querySelector("#receive-amount");
const currencyDropdown = document.querySelector(".currency-dropdown");
const swapButton = document.querySelector(".swap");
const searchInput = document.querySelector(".currency-search");
const fromFoot = document.querySelector(".fromFoot");
const rateValue = document.querySelector(".rateValue");
const toFoot = document.querySelector(".toFoot");

let currencies = [];
// async function loadCon() {
// const response = await fetch("./data/countries.json");
// currencies = await response.json();
// console.log(currencies);
// }
// loadCon();

let sendCurrency = currencies[0];
let receiveCurrency = currencies[1];
let currentSelection = null;
sendCurrencyButton.addEventListener("click", (e) => {
  currentSelection = "send";
  openCurrencyDropdown(e);
});
receiveCurrencyButton.addEventListener("click", (e) => {
  currentSelection = "receive";
  openCurrencyDropdown(e);
});

sendCurrencyButton.addEventListener("click", openCurrencyDropdown);
receiveCurrencyButton.addEventListener("click", openCurrencyDropdown);
document.addEventListener("click", closeDropdownOnOutsideClick);
swapButton.addEventListener("click", swapCurrency);

function openCurrencyDropdown(event) {
  event.stopPropagation();

  // activeCurrencyButton = event.currentTarget;

  currencyDropdown.classList.remove("hidden");

  renderCurrencyList();
}

function closeCurrencyDropdown() {
  currencyDropdown.classList.add("hidden");
}

function closeDropdownOnOutsideClick(event) {
  if (
    !currencyDropdown.contains(event.target) &&
    !event.target.closest(".currency-select")
  ) {
    closeCurrencyDropdown();
  }
}

function updateCurrency(button, currency) {
  button.querySelector("span").textContent = currency.code;
  button.querySelector("p").textContent = currency.flag;
}

function renderCurrencyList(list = currencies) {
  currencyList.innerHTML = "";

  list.forEach((currency) => {
    const listItem = document.createElement("li");

    listItem.className = "currency-item";

    listItem.innerHTML = `
            <span>${currency.flag}</span>
            <span>${currency.code}</span>
            <span>${currency.name}</span>
        `;

    currencyList.appendChild(listItem);

    listItem.addEventListener("click", () => {
      if (currentSelection == "send") {
        sendCurrency = currency;
        updateCurrency(sendCurrencyButton, currency);
      } else {
        receiveCurrency = currency;
        updateCurrency(receiveCurrencyButton, currency);
      }
      closeCurrencyDropdown();
    });
  });
}

function swapCurrency() {
  [sendCurrency, receiveCurrency] = [receiveCurrency, sendCurrency];
  updateCurrency(sendCurrencyButton, sendCurrency);
  updateCurrency(receiveCurrencyButton, receiveCurrency);
  [sendAmountInput.value, receiveAmountInput.value] = [
    receiveAmountInput.value,
    sendAmountInput.value,
  ];
}

async function convertCurrency() {
  const from = sendCurrency.code;
  const to = receiveCurrency.code;
  const amount = Number(sendAmountInput.value);
  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?from=${from}&to=${to}`,
    );

    const data = await response.json();
    const rate = data.rates[to];
    receiveAmountInput.value = (amount * rate).toFixed(2);
    receiveAmountInput.disabled = true;
    fromFoot.textContent = sendCurrency.code;
    toFoot.textContent = receiveCurrency.code;
    rateValue.textContent = rate.toFixed(2);
  } catch (err) {
    console.log(err);
    receiveAmountInput.value = "NAN";
  }
}

sendAmountInput.addEventListener("input", () => {
  convertCurrency();
});

searchInput.addEventListener("input", searchCurrency);

function searchCurrency(e) {
  const searchText = e.target.value.toLowerCase();
  const filterCurr = currencies.filter((currency) => {
    return (
      currency.code.toLowerCase().includes(searchText) ||
      currency.name.toLowerCase().includes(searchText)
    );
  });
  console.log(filterCurr);
  renderCurrencyList(filterCurr);
}

async function init() {
  const response = await fetch("./data/countries.json");
  currencies = await response.json();
  renderCurrencyList();

  sendCurrency = currencies.find((c) => c.code === "USD");
  receiveCurrency = currencies.find((c) => c.code === "INR");

  updateCurrency(sendCurrencyButton, sendCurrency);
  updateCurrency(receiveCurrencyButton, receiveCurrency);

  convertCurrency();
}
init();

const ctx = document.getElementById("currencyChart");

new Chart(ctx, {
  type: "line",

  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

    datasets: [
      {
        label: "USD → INR",

        data: [85.1, 85.4, 85.3, 85.6, 85.7, 85.5, 85.9],
      },
    ],
  },
});