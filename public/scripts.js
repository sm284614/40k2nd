document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main');

    // Load content dynamically
    function loadContent(page) {
        //fetch content
        fetch(`http://localhost:40000/load_content?page=${page}`)
            .then((response) => response.json())
            .then((data) => {
                switch (page)
                {
                    case 'faction_list':
                        renderFactionTable(data);
                        break;
                    case 'weapon_list':
                        renderWeaponTable(data); 
                        break;
                    case 'model_list':
                        renderModelTable(data);
                        break;
                    case 'unit_list':
                        renderUnitTable(data);
                        break;
                    default:
                        renderErrorPage(page);
                }
                // Push the new state to the history
                // This ensures that each page load (even same page) creates a new history entry
                history.pushState({ page: page }, '', `?page=${page}`);
            })
            .catch((error) => console.error('Error loading content:', error));
    }
    // Load content dynamically based on the unit name
    function loadUnitDetails(unitName) {
        fetch(`http://localhost:40000/unit_details?unit_name=${encodeURIComponent(unitName)}`)
            .then((response) => response.json())
            .then((data) => {
                renderUnitDetails(data);  // Render the unit details
            })
            .catch((error) => console.error('Error loading unit details:', error));
    }
    // Render faction table
    function renderFactionTable(data) 
    {
        const tableHTML = `
            <div class="factionTable">
                <table class="factionTable" id="factionTable">
                    <thead>
                        <tr>
                            <th></th>
                            <th onclick='SortTable("factionTable", 1, true)'>Faction</th>
                            <th onclick='SortTable("factionTable", 2, true)'>Empire</th>
                            <th onclick='SortTable("factionTable", 3, true)'>Strategy</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data
                            .map(
                                (row) => `
                                <tr>
                                    <td>
                                        <img class="image25" src="./image/icon/${row.faction_name}.svg" alt="${row.faction_name}">
                                    </td>
                                    <td>
                                        <a href="#" onclick="loadUnitAndNavigation(${row.faction_id})">
                                            ${row.faction_name}
                                        </a>
                                    </td>
                                    <td>${row.empire_name}</td>
                                    <td>${row.strategy_rating}</td>
                                </tr>
                                `
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        `;
        main.innerHTML = tableHTML; // Update the main div with the table
    }
    function renderWeaponTable(data){
        const tableHTML = `
            <div class="weaponTable">
                <table class="weapontable" id="weapontable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Strength</th>
                            <th>Damage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data
                            .map(
                                (row) => `
                                <tr>
                                    <td>${row.name}</td>
                                    <td>${row.strength}</td>
                                    <td>${row.damage}</td>
                                </tr>
                                `
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        `;
        main.innerHTML = tableHTML; // Update the main div with the table
    }
    function renderModelTable(data) {
        const tableHTML = `
            <table class='weapontable' id='models'>
                <thead>
                    <tr>
                        <th class='modelname'>Name</th>
                        <th class='modelstat'>M</th>
                        <th class='modelstat'>WS</th>
                        <th class='modelstat'>BS</th>
                        <th class='modelstat'>S</th>
                        <th class='modelstat'>T</th>
                        <th class='modelstat'>W</th>
                        <th class='modelstat'>I</th>
                        <th class='modelstat'>A</th>
                        <th class='modelstat'>Ld</th>
                        <th class='modelstat'>Special</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td class='model_name'>${row.model_name}</td>
                            <td class='modelstat'>${row.M}</td>
                            <td class='modelstat'>${row.WS}</td>
                            <td class='modelstat'>${row.BS}</td>
                            <td class='modelstat'>${row.S}</td>
                            <td class='modelstat'>${row.T}</td>
                            <td class='modelstat'>${row.W}</td>
                            <td class='modelstat'>${row.I}</td>
                            <td class='modelstat'>${row.A}</td>
                            <td class='modelstat'>${row.Ld}</td>
                            <td class='modelstat'></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    
        document.getElementById('main').innerHTML = tableHTML; // Assuming 'main' is the element you want to insert the table into
    };   
    function renderUnitTable(data) {
        const tableHTML = `
           <table class="weapontable" id="models">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Faction</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td>
                                <a href="#" data-target="unit" data-unit-name="${row.unit_name}">
                                    ${row.unit_name}
                                </a>
                            </td>
                            <td>${row.faction_name}</td>
                            <td>
                                ${row.unit_cost === 0 ? `${row.unit_model_cost} points per model` : `${row.unit_cost} points`}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>    
        `;
    
        document.getElementById('main').innerHTML = tableHTML; // Assuming 'main' is the element you want to insert the table into
    };
    // Render the unit details page
    function renderUnitDetails(data) {
        const detailsHTML = `
            <h2>${data.unit_name}</h2>
            <p><strong>Faction:</strong> ${data.faction_name}</p>
            <p><strong>Cost:</strong> ${data.unit_cost === 0 ? `${data.unit_model_cost} points per model` : `${data.unit_cost} points`}</p>
            <p><strong>Description:</strong> ${data.description}</p>
        `;
        main.innerHTML = detailsHTML;  // Insert the unit details into the page
    }

    function renderErrorPage(page)
    {
        main.innerHTML = `No handler for page: ${page}`;
    }

    // Attach event listeners for navigation links
    const navigation = document.getElementById('navigation');
    navigation.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target;
        if (target.tagName === 'A' && target.dataset.target) 
        {
            const page = target.dataset.target;                
            switch (page) {
                case 'army_list':                    
                    loadArmyList(); // Fetch and render army list
                    openModal(); // Open the modal
                    break;    
                default:
                    loadContent(page); // Handle all other pages
            }
        }
    });
    function loadArmyList() 
    {
        fetch(`http://localhost:40000/load_army_list`)
            .then((response) => response.json())
            .then((data) => 
            {
                const modalMainContent = document.getElementById('modal-main-content');
                modalMainContent.innerHTML = `
                <div id='army_select'>                    
                    <table id='armySelect' class='rounded-table'>
                        <tbody>
                            ${data
                                .map(row => `
                                    <tr>
                                        <td>
                                            <img class='image25' src='./image/icon/${row.faction_name}.svg' alt='${row.faction_name}'>
                                        </td>
                                        <td>
                                            <a href='#' class='edit-army' data-army-id='${row.army_id}'>${row.army_name}</a>
                                        </td>
                                        <td>
                                            (${row.points_limit} points)
                                        </td>
                                        <td>
                                            <input class='delete-army' type='button' value='&times;' data-army-id='${row.army_id}'>
                                        </td>
                                    </tr>
                                `)
                                .join('')}
                            <tr>
                                <td>
                                    <input type='button' value='new' onclick='LoadModal("army/create_new_army", ${1});'>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            })
            .catch((error) => console.error('Error loading army list:', error));
    }

    function openModal() 
    {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block'; // Show the modal  
        // Attach close button functionality
        const closeButton = document.getElementById('modal-close-button');
        if (closeButton) 
        {
            closeButton.onclick = () => 
            {
                modal.style.display = 'none';
            };
        }
    
        // Close when clicking outside modal
        window.onclick = (event) => 
        {
            if (event.target === modal) 
            {
                modal.style.display = 'none';
            }
        };
    }

    // Handle browser navigation (back/forward)
    window.addEventListener('popstate', (event) => 
    {
        if (event.state && event.state.page) 
        {
            loadContent(event.state.page);
        }
    });

    // If the page is loaded with a query string (e.g., ?page=faction_list), load the initial content
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page');
    if (initialPage) 
    {
        loadContent(initialPage);
    }
});
