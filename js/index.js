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


window.addEventListener("keydown", function (e) {
  var key = e.key;
    if(e.altKey){
      switch (key) {
        case 'k':
          //window.open(glo.urls.base + 'public/img/uml/useCase.png', '_blank');
        break;
        case 'l':
          //window.open(glo.urls.base + 'public/img/uml/classDiagram.png', '_blank');
        break;
      }
    }
});


async function getAllTodos() {
    glo.todos = await getInFetch(glo.urls.baseFetch);
    glo.todos = glo.todos[0]['todolist'];
}



async function getOneTodo(id) {
    glo.oneTodo = await getOneInFetch(id);
   //glo.todos = glo.todos[0]['todolist'];
}

/**
 * Envoie une requête POST avec les données spécifiées.
 */
async function sendPostRequest(text, tags, is_complete) {
    const body = {
        "text": text,
        "Tags": tags,
        "is_complete": is_complete
    };

    try {
        const response = await postInFetch(glo.urls.baseFetch, body);
        console.log('Données renvoyées:', response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la requête POST:', error);
    }
}

/**
 * Envoie une requête PUT avec les données spécifiées pour mettre à jour une ressource identifiée par un id.
 * @param {number} id - Identifiant de la ressource à mettre à jour.
 */
async function sendPutRequest(id, text, tags, is_complete) {
    const url    = `${glo.urls.baseFetch}/${id}`; 
    const method = 'PUT';
    const body   = {
        "text": text,
        "Tags": tags,
        "is_complete": is_complete
    };

    try {
        const response = await putInFetch(url, body);
        console.log('Données mises à jour:', response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la requête PUT:', error);
    }
}

/**
 * Envoie une requête DELETE avec les données spécifiées pour supprimer une ressource identifiée par un id.
 * @param {number} id - Identifiant de la ressource à supprimer.
 */
async function sendDelRequest(id) {
    const url = `${glo.urls.baseFetch}/${id}`; 

    try {
        const response = await delInFetch(url);
        console.log('Données supprimées: ', response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la requête DELETE:', error);
    }
}

/**
 * Effectue une requête GET et renvoie les données après avoir reçu la réponse.
 * @param {string} url - URL à laquelle effectuer la requête.
 * @param {Function} [successFunction] - Fonction à exécuter après une réponse réussie.
 * @param {any} [successFunctionParams] - Paramètres optionnels à passer à la fonction de succès.
 * @returns {Promise<any>} - Promesse résolue avec les données de la réponse.
 */
async function getInFetch(url, successFunction, successFunctionParams) {
    return await fetchRequest(url, 'GET', null, successFunction, successFunctionParams);
}

/**
 * Effectue une requête GET et renvoie les données après avoir reçu la réponse.
 * @param {string} url - URL à laquelle effectuer la requête.
 * @param {Function} [successFunction] - Fonction à exécuter après une réponse réussie.
 * @param {any} [successFunctionParams] - Paramètres optionnels à passer à la fonction de succès.
 * @returns {Promise<any>} - Promesse résolue avec les données de la réponse.
 */
async function getOneInFetch(id, successFunction, successFunctionParams) {
    return await fetchRequest(glo.urls.baseFetch + '/' + id, 'GET', null, successFunction, successFunctionParams);
}

/**
 * Effectue une requête HTTP et renvoie les données après avoir reçu la réponse.
 * @param {string} url - URL à laquelle effectuer la requête.
 * @param {Object} [body] - Corps de la requête à envoyer (pour les requêtes POST, PUT, etc.).
 * @param {Function} [successFunction] - Fonction à exécuter après une réponse réussie.
 * @param {any} [successFunctionParams] - Paramètres optionnels à passer à la fonction de succès.
 * @returns {Promise<any>} - Promesse résolue avec les données de la réponse.
 */
async function postInFetch(url, body, successFunction, successFunctionParams) {
    return await fetchRequest(url, 'POST', body, successFunction, successFunctionParams);
}

/**
 * Effectue une requête HTTP et renvoie les données après avoir reçu la réponse.
 * @param {string} url - URL à laquelle effectuer la requête.
 * @param {Object} [body] - Corps de la requête à envoyer (pour les requêtes POST, PUT, etc.).
 * @param {Function} [successFunction] - Fonction à exécuter après une réponse réussie.
 * @param {any} [successFunctionParams] - Paramètres optionnels à passer à la fonction de succès.
 * @returns {Promise<any>} - Promesse résolue avec les données de la réponse.
 */
async function putInFetch(url, body, successFunction, successFunctionParams) {
    return await fetchRequest(url, 'PUT', body, successFunction, successFunctionParams);
}

/**
 * Effectue une requête HTTP et renvoie les données après avoir reçu la réponse.
 * @param {string} url - URL à laquelle effectuer la requête.
 * @param {Object} [body] - Corps de la requête à envoyer (pour les requêtes POST, PUT, etc.).
 * @param {Function} [successFunction] - Fonction à exécuter après une réponse réussie.
 * @param {any} [successFunctionParams] - Paramètres optionnels à passer à la fonction de succès.
 * @returns {Promise<any>} - Promesse résolue avec les données de la réponse.
 */
async function delInFetch(url, successFunction, successFunctionParams) {
    return await fetchRequest(url, 'DELETE', null, successFunction, successFunctionParams);
}

/**
 * Effectue une requête HTTP et renvoie les données après avoir reçu la réponse.
 * @param {string} url - URL à laquelle effectuer la requête.
 * @param {string} method - Méthode HTTP à utiliser (GET, POST, PUT, etc.).
 * @param {Object} [body] - Corps de la requête à envoyer (pour les requêtes POST, PUT, etc.).
 * @param {Function} [successFunction] - Fonction à exécuter après une réponse réussie.
 * @param {any} [successFunctionParams] - Paramètres optionnels à passer à la fonction de succès.
 * @returns {Promise<any>} - Promesse résolue avec les données de la réponse.
 */
async function fetchRequest(url, method, body, successFunction, successFunctionParams) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        });

        const data = await response.json();

        if (successFunction) {
            await successFunction(successFunctionParams ? successFunctionParams() : undefined);
        }

        return data;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}



getById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const prenom = getById('prenom').value;
    
    if(!prenom){ alert("Vous devez renseigner un prénom afin d'accéder à la liste des tâches"); return false; }
    else{
        localStorage.setItem('prenom', prenom);
        window.open(glo.urls.base + 'tasks.html', '_self');
    }
});








/**
 * Supprime tous les enfants d'un élément DOM.
 * @param {Element} parent - L'élément DOM dont les enfants doivent être supprimés.
 */
function removeAllChildren(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/**
 * Applique un style de prévisualisation d'image à un élément du DOM.
 */
function designImagePreview(){
  const imgPrev = getById('updNewsForm').querySelector('[id="imagePreview"]').parentElement;

  const optionsDesign = {
    border       : "1px #ccc solid",
    borderRadius : "5px",
    padding      : "5px"
  };

  for(let prop in optionsDesign){ imgPrev.style[prop] = optionsDesign[prop]; }
}

/**
 * Récupère la valeur d'un cookie spécifique.
 * @param {string} name - Le nom du cookie à récupérer.
 * @returns {string} La valeur du cookie, ou une chaîne vide si le cookie n'est pas trouvé.
 */
function getCookie(name) {
    let cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return "";
}

/**
 * Effectue un effet de fondu (fadeOut) sur un élément DOM jusqu'à ce qu'il devienne invisible.
 * @param {Element} element - L'élément DOM sur lequel appliquer l'effet de fondu.
 */
function fadeOut(element) {
    let opacite = 1;

    function step() {
        opacite = opacite - 0.01;
        element.style.opacity = opacite;

        if (opacite > 0) {
            requestAnimationFrame(step);
        } else {
            element.style.display = 'none';
        }
    }
    requestAnimationFrame(step);
}