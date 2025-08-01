const apiKey = "fc47fb9a1e5c642a80d1e4a1";

const currencyList = [
  { code: "USD", name: "AQSh dollari" },
  { code: "UZS", name: "O'zbek so'mi" },
  { code: "EUR", name: "Yevro" },
  { code: "GBP", name: "Funt sterling" },
  { code: "RUB", name: "Rossiya rubli" },
  { code: "CNY", name: "Xitoy yuani" },
  { code: "KZT", name: "Qozog'iston tengesi" },
  { code: "TRY", name: "Turkiya lirasi" },
  { code: "JPY", name: "Yaponiya iyenasi" },
  { code: "AED", name: "BAA dirhami" }
];

function populateCurrencyDropdowns() {
  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");

  currencyList.forEach(currency => {
    const optionFrom = document.createElement("option");
    const optionTo = document.createElement("option");
    optionFrom.value = currency.code;
    optionFrom.text = `${currency.code} - ${currency.name}`;
    optionTo.value = currency.code;
    optionTo.text = `${currency.code} - ${currency.name}`;
    fromSelect.appendChild(optionFrom);
    toSelect.appendChild(optionTo);
  });

  fromSelect.value = "USD";
  toSelect.value = "UZS";
}

async function loadRates() {
  const base = "USD";
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.result === "success") {
      const rates = data.conversion_rates;
      let html = "";
      currencyList.forEach(c => {
        const rate = rates[c.code];
        if (rate) {
          html += `<div class="rate-item">
            <strong>${c.code}</strong> (${c.name})
            <span>1 USD = ${rate} ${c.code}</span>
          </div>`;
        }
      });
      document.getElementById("rateList").innerHTML = html;
    } else {
      document.getElementById("rateList").innerText = "Xatolik: Kurslarni olishda muammo.";
    }
  } catch (error) {
    document.getElementById("rateList").innerText = "Tarmoq xatosi yoki noto‘g‘ri API kaliti.";
  }
}

async function convertCurrency() {
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (isNaN(amount) || amount <= 0) {
    document.getElementById("result").innerText = "Iltimos, to'g'ri miqdor kiriting.";
    return;
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.result === "success") {
      const rate = data.conversion_rate;
      const converted = (amount * rate).toFixed(2);
      document.getElementById("result").innerText = `${amount} ${from} = ${converted} ${to}`;
    } else {
      document.getElementById("result").innerText = "Xatolik: " + data['error-type'];
    }
  } catch (err) {
    document.getElementById("result").innerText = "Tarmoq xatosi yoki API xatoligi.";
  }
}

populateCurrencyDropdowns();
loadRates();
