(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const number = (id) => Number(byId(id).value);
  const isFiniteNumber = (value) => Number.isFinite(value);
  const format = (value, maximumFractionDigits = 2) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);
  const show = (id, message) => { byId(id).textContent = message; };
  const invalid = (id, message) => show(id, message);

  byId("percentage-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const rate = number("percent-rate");
    const base = number("percent-value");
    if (!isFiniteNumber(rate) || !isFiniteNumber(base)) {
      return invalid("percentage-result", "Please enter valid numbers.");
    }
    show("percentage-result", `${format(rate)}% of ${format(base)} = ${format(rate / 100 * base)}`);
  });

  byId("ratio-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const part = number("ratio-part");
    const whole = number("ratio-whole");
    if (!isFiniteNumber(part) || !isFiniteNumber(whole)) {
      return invalid("ratio-result", "Please enter valid numbers.");
    }
    if (whole === 0) return invalid("ratio-result", "The total number cannot be zero.");
    show("ratio-result", `${format(part)} is ${format(part / whole * 100)}% of ${format(whole)}.`);
  });

  byId("discount-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const price = number("original-price");
    const rate = number("discount-rate");
    if (!isFiniteNumber(price) || !isFiniteNumber(rate) || price < 0 || rate < 0 || rate > 100) {
      return invalid("discount-result", "Enter a non-negative price and a discount from 0% to 100%.");
    }
    const savings = price * rate / 100;
    show("discount-result", `You save ${format(savings)}. New price: ${format(price - savings)}.`);
  });

  byId("profit-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const cost = number("cost-price");
    const selling = number("selling-price");
    if (!isFiniteNumber(cost) || !isFiniteNumber(selling) || cost < 0 || selling < 0) {
      return invalid("profit-result", "Enter valid, non-negative amounts.");
    }
    const profit = selling - cost;
    const margin = selling === 0 ? null : profit / selling * 100;
    const markup = cost === 0 ? null : profit / cost * 100;
    const label = profit > 0 ? "Profit" : profit < 0 ? "Loss" : "Break-even";
    const marginText = margin === null ? "not defined (selling price is zero)" : `${format(margin)}%`;
    const markupText = markup === null ? "not defined (cost is zero)" : `${format(markup)}%`;
    show("profit-result", `${label}: ${format(profit)} • Margin: ${marginText} • Markup: ${markupText}`);
  });

  const today = new Date();
  const toLocalDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  byId("age-as-of").value = toLocalDateString(today);

  byId("age-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const birthValue = byId("birth-date").value;
    const asOfValue = byId("age-as-of").value;
    if (!birthValue || !asOfValue) return invalid("age-result", "Please select both dates.");

    const [by, bm, bd] = birthValue.split("-").map(Number);
    const [ay, am, ad] = asOfValue.split("-").map(Number);
    const birth = new Date(Date.UTC(by, bm - 1, bd));
    const asOf = new Date(Date.UTC(ay, am - 1, ad));
    if (asOf < birth) return invalid("age-result", "The calculation date must be on or after the birth date.");

    let years = ay - by;
    let months = am - bm;
    let days = ad - bd;
    if (days < 0) {
      months -= 1;
      const daysInPreviousMonth = new Date(Date.UTC(ay, am - 1, 0)).getUTCDate();
      days += daysInPreviousMonth;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    show("age-result", `Age: ${years} years, ${months} months, and ${days} days.`);
  });

  byId("year").textContent = String(new Date().getFullYear());
})();
