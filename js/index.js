/**
 * Récupère un élément du DOM par son identifiant.
 * @param {string} id - L'identifiant de l'élément à récupérer.
 * @returns {Element} L'élément du DOM correspondant à l'identifiant fourni.
 */
const getById = id => document.getElementById(id);

// Déclaration d'un objet pour les variables globales
let glo = {
    urls: {
        base      : 'http://localhost:8080/',
        baseFetch : 'http://localhost:3000/todos',
    },
    todos : [],
};

getById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const prenom = getById('prenom').value;
    
    if(!prenom){ alert("Vous devez renseigner un prénom afin d'accéder à la liste des tâches"); return false; }
    else{
        localStorage.setItem('prenom', prenom);
        window.open(glo.urls.base + 'tasks.html', '_self');
    }
});








