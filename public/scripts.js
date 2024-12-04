// public/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const navigation = document.getElementById('navigation');
    const main = document.getElementById('main');

    // Attach a single event listener to the navigation container
    navigation.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior

        const target = event.target;
        if (target.tagName === 'A' && target.dataset.target) {
            const page = target.dataset.target; // Get the content identifier
            loadContent(page); // Call your loadContent function
        }
    });

// Function to load content dynamically
function loadContent(page) 
{
    // Clear the main content area
    document.getElementById('main').innerHTML = '<p>Loading...</p>';

    // Fetch content from the server based on the link clicked
    fetch(`http://localhost:40000/${page}`)
        .then(response => response.text()) // Assuming server returns HTML
        .then(data => {
            // Inject the fetched data into the main div
            document.getElementById('main').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById('main').innerHTML = '<p>Error loading content.</p>';
        });
}
});




