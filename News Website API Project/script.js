// Selecting DOM elements
const container = document.querySelector(".container");
const optionsContainer = document.querySelector(".options-container");

// News API variables
const country = "us"; // Country code for USA
const options = [
  "general",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
]; // News category options

// Request related variables
let requestURL;
let page = 1; // Initial page number
const pageSize = 10; // Number of articles per page

// Function to generate news cards from data
const generateUI = (articles) => {
  // Loop through each article and create a news card
  for (let item of articles) {
    let card = document.createElement("div");
    card.classList.add("news-card");
    card.innerHTML = `<div class="news-image-container">
    <img src="${item.urlToImage || "./Gazette.jpg"}" alt="" />
    </div>
    <div class="news-content">
      <div class="news-title">
        ${item.title}
      </div>
      <div class="news-description">
      ${item.description || item.content || ""}
      </div>
      <a href="${item.url}" target="_blank" class="view-button">Read More</a>
    </div>`;
    container.appendChild(card);

    // Add click event listeners to elements for redirecting to article URL
    const imgElement = card.querySelector('.news-image-container img');
    imgElement.addEventListener('click', () => {
      window.location.href = item.url;
    });

    const titleElement = card.querySelector('.news-title');
    titleElement.addEventListener('click', () => {
      window.location.href = item.url;
    });

    const descriptionElement = card.querySelector('.news-description');
    descriptionElement.addEventListener('click', () => {
      window.location.href = item.url;
    });
  }
};

// Function to fetch news from API
const getNews = async () => {
  // Display loading message while fetching data
  container.innerHTML = "<div class='loading'>Loading...</div>";
  let response = await fetch(requestURL);
  if (!response.ok) {
    // Display error message if data fetching fails
    alert("Data unavailable at the moment. Please try again later");
    return false;
  }
  let data = await response.json();
  generateUI(data.articles); // Generate news cards from fetched data
  container.querySelector('.loading').remove(); // Remove loading message
  // Add Load More button if there are more articles to load
  if (data.articles.length === pageSize) {
    createLoadMoreButton();
  }
};

// Function to load more news articles
const loadMoreNews = async () => {
  page++; // Increment page number to load next page
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
  await getNews();
};

// Function to handle category selection
const selectCategory = (e, category) => {
  let options = document.querySelectorAll(".option");
  options.forEach((element) => {
    element.classList.remove("active");
  });
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=1&pageSize=${pageSize}&apiKey=${apiKey}`;
  e.target.classList.add("active");
  page = 1; // Reset page number when category is changed
  getNews();
};

// Function to create option buttons for news categories
const createOptions = () => {
  for (let i of options) {
    optionsContainer.innerHTML += `<button class="option ${
      i == "general" ? "active" : ""
    }" onclick="selectCategory(event,'${i}')">${i}</button>`;
  }
};

// Function to create Load More button
const createLoadMoreButton = () => {
  // Check if Load More button already exists, if not, create one
  if (!document.querySelector(".load-more-button")) {
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Load More";
    loadMoreButton.classList.add("load-more-button");
    loadMoreButton.addEventListener("click", loadMoreNews);
    container.appendChild(loadMoreButton);
  }
};

// Initialize the page with default category and fetch news
const init = () => {
  optionsContainer.innerHTML = "";
  container.innerHTML = ""; // Clear container before loading new news
  getNews();
  createOptions();
};

// Initialize the page when window loads
window.onload = () => {
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&page=1&pageSize=${pageSize}&apiKey=${apiKey}`;
  init();
};

// Event listener to handle blur effect on heading-container when scrolling
window.addEventListener('scroll', function() {
  var header = document.querySelector('.heading-container');
  var scrollPosition = window.scrollY;
  
  if (scrollPosition > 100) {
    header.classList.add('blur');
  } else {
    header.classList.remove('blur');
  }
});

// Event listener to handle visibility of Back to Top button when scrolling
window.addEventListener('scroll', function() {
  var backToTopButton = document.querySelector('.back-to-top');

  if (window.pageYOffset > 100) {
    backToTopButton.style.opacity = '1';
    backToTopButton.style.visibility = 'visible';
  } else {
    backToTopButton.style.opacity = '0';
    backToTopButton.style.visibility = 'hidden';
  }
});

// Event listener to scroll to top when Back to Top button is clicked
document.querySelector('.back-to-top-button').addEventListener('click', function(event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Hover effect on Back to Top button
document.querySelector('.back-to-top-button').addEventListener('mouseover', function() {
  this.style.transform = 'scale(1.1)';
  this.style.transition = 'transform 0.3s ease';
});

document.querySelector('.back-to-top-button').addEventListener('mouseout', function() {
  this.style.transform = 'scale(1)';
  this.style.transition = 'transform 0.3s ease';
});
