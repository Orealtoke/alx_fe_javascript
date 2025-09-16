// Quotes now include category property
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate dropdown categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear existing except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const lastCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = lastCategory;
}

// Display a quote
function displayQuote(quoteObj) {
  document.getElementById("quoteDisplay").innerText = `"${quoteObj.text}" — ${quoteObj.category}`;
}

// Add a new quote with category
function promptAddQuote() {
  const newText = prompt("Enter a new quote:");
  if (!newText || newText.trim() === "") return;

  const newCategory = prompt("Enter category for this quote:");
  if (!newCategory || newCategory.trim() === "") return;

  const newQuote = { text: newText.trim(), category: newCategory.trim() };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayQuote(newQuote);
}

// Show random quote (respect filter)
function newQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  displayQuote(randomQuote);
}

// Filter quotes based on dropdown
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  newQuote();
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
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format. Must be an array of objects with {text, category}.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// On page load
window.onload = function () {
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    displayQuote(JSON.parse(lastQuote));
  } else {
    newQuote();
  }
};

