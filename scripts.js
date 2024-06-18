const API = "https://api.edamam.com/search";
const appId = "24a22d05";
const appKey = "d9e0c0e19b24c621ddbada5238b68cb6"; 


let searchInput = document.getElementById("search-input");
let searchBtn = document.getElementById("search-button");
let resultsContainer = document.getElementById("results-container");

searchBtn.addEventListener("click", function () {
    getRecipes();
    searchInput.value = "";
});

document.addEventListener("keydown", (event)=>{
    if(event.key === "Enter"){
        getRecipes();
        searchInput.value = "";
    }
})

async function getRecipes() {
    let searchInputVal = searchInput.value.trim();

    if (searchInputVal) {
        try {
            const response = await fetch(`${API}?q=${searchInputVal}&app_id=${appId}&app_key=${appKey}`);
            if (!response.ok) {
                console.log("Please enter a valid recipe name");
                return;
            }
            const data = await response.json();

            resultsContainer.innerHTML = '';
            const recipes = data.hits;

            if (recipes.length > 0) {
                recipes.forEach(recipeData => {
                    const recipe = recipeData.recipe;
                    const recipeElement = document.createElement('div');
                    recipeElement.classList.add('recipe');
                    recipeElement.dataset.uri = recipe.uri;

                    const recipeImage = recipe.image ? `<img src="${recipe.image}" alt="${recipe.label}">` : '';
                    recipeElement.innerHTML = `
                        ${recipeImage}
                        <h3>${recipe.label}</h3>
                        <p>Source: ${recipe.source}</p>
                    `;
                    recipeElement.addEventListener('click', () => {
                        getRecipeDetails(recipe.uri);
                    });
                    resultsContainer.appendChild(recipeElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>No recipes found. Please try a different search term.</p>';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p>Failed to fetch recipes. Please try again later.</p>';
        }
    } else {
        console.log("Nothing found");
        resultsContainer.innerHTML = '<p>No recipes found. Please try a different search term.</p>';
    }
}

async function getRecipeDetails(recipeUri) {
    const encodedUri = encodeURIComponent(recipeUri);
    const detailsApiUrl = `https://api.edamam.com/search?r=${encodedUri}&app_id=${appId}&app_key=${appKey}`;

    try {
        const response = await fetch(detailsApiUrl);
        if (!response.ok) {
            console.log("Failed to fetch recipe details");
            return;
        }
        const data = await response.json();

        if (data.length > 0) {
            const recipe = data[0];
            displayRecipeDetails(recipe);
        } else {
            console.log("No details found for this recipe");
        }
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function displayRecipeDetails(recipe) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('recipe-details');
    
    const recipeImage = recipe.image ? `<img src="${recipe.image}" alt="${recipe.label}">` : '';
    detailsContainer.innerHTML = `
        <h2>${recipe.label}</h2>
        ${recipeImage}
        <h3>Ingredients</h3>
        <ul>
            ${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <h3>Instructions</h3>
        <p>Source: <a href="${recipe.url}" target="_blank">${recipe.source}</a></p>
    `;
    
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(detailsContainer);
}
