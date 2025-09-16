// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  "The best way to predict the future is to invent it.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "Don’t watch the clock; do what it does. Keep going."
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a quote
function displayQuote(quote) {
  document.getElementById("quoteDisplay").innerText = quote;
}

// Add a new quote
function addQuote(newQuote) {
  if (newQuote && newQuote.trim() !== "") {
    quotes.push(newQuote.trim());
    saveQuotes();
    displayQuote(newQuote);
  }
}

// Show a random quote
function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  sessionStorage.setItem("lastQuote", randomQuote); // save to sessionStorage
  displayQuote(randomQuote);
}

// Export quotes as JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format. Must be an array of strings.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// On page load
window.onload = function () {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    displayQuote(lastQuote);
  } else {
    newQuote();
  }
};

