/**
 * Récupère un élément du DOM par son identifiant.
 * @param {string} id - L'identifiant de l'élément à récupérer.
 * @returns {Element} L'élément du DOM correspondant à l'identifiant fourni.
 */
const getById = id => document.getElementById(id);
const app     = getById('app');


// Déclaration d'un objet pour les variables globales
let glo = {
    urls: {
        base      : 'http://localhost:8080/',
        baseFetch : 'http://localhost:3000/todos',
    },
    todos : [],
    styles: {
        itemHovering: '#eee',
        itemNoAction: '#fff',
    },
};

let addDialog = getById('addDialog');

document.addEventListener('DOMContentLoaded', async function() {
    await getAllTodos();
    feedTaskContainer();
});

window.addEventListener('click', (event) => {
    if(addDialog.open && event.target.id !== 'openAddModalButton') {
        addDialog.close();
    }
});

function addTask(){
    const txt = getById('textareaTaskTxt').value;
    let tags  = getById('inputTags').value.replace(/\s/g, '').split(',');

    sendPostRequest(txt, tags);
}

function feedTaskContainer(){
    app.style.display       = 'flex';
    app.style.flexDirection = 'column';

    app.appendChild(makeHTMLTaskTitle());

    glo.todos.forEach(task =>{
        app.appendChild(makeHTMLTask(task));
    });
}

function makeHTMLTaskTitle(){
    let divParent = document.createElement('div');

    let titleLineDescDiv  = document.createElement('div');
    let titleLineDateDiv  = document.createElement('div');
    let titleLineDoneDiv  = document.createElement('div');
    let titleLineDescTxt = document.createTextNode('Description');
    let titleLineDateTxt = document.createTextNode('Date');
    let titleLineDoneTxt = document.createTextNode('État');

    const fontWeightTitle = '900';

    titleLineDescDiv.style.fontWeight = fontWeightTitle;
    titleLineDateDiv.style.fontWeight = fontWeightTitle;
    titleLineDoneDiv.style.fontWeight = fontWeightTitle;

    titleLineDateDiv.style.justifySelf = 'center';
    titleLineDoneDiv.style.justifySelf = 'center';

    titleLineDescDiv.appendChild(titleLineDescTxt);
    titleLineDateDiv.appendChild(titleLineDateTxt);
    titleLineDoneDiv.appendChild(titleLineDoneTxt);

    styleHTMLTask(divParent);

    divParent.appendChild(titleLineDescDiv);
    divParent.appendChild(titleLineDateDiv);
    divParent.appendChild(titleLineDoneDiv);

    return divParent;
}

function makeHTMLTask(dataTask){
    let divParent    = document.createElement('div');
    let divChildTxt  = document.createElement('div');
    let divChildDate = document.createElement('div');
    let divChildDone = document.createElement('div');
    let txt  = document.createTextNode(dataTask.text);
    let date = document.createTextNode(dateToStrFr(new Date(dataTask.created_at), true));
    let done = document.createTextNode(dataTask.is_complete ? 'Terminée' : 'En cours');
    
    divChildTxt.appendChild(txt);
    divChildDate.appendChild(date);
    divChildDone.appendChild(done);

    divChildDate.style.justifySelf = 'center';
    divChildDone.style.justifySelf = 'center';

    styleHTMLTask(divParent);

    divParent.style.cursor = 'pointer';

    divParent.appendChild(divChildTxt);
    divParent.appendChild(divChildDate);
    divParent.appendChild(divChildDone);

    divParent.onclick = function() {
        localStorage.setItem('taskId', dataTask.id);
        window.open(glo.urls.base + 'item.html', '_self');
    };
    divParent.onmouseenter = function() { divParent.style.backgroundColor = glo.styles.itemHovering; };
    divParent.onmouseleave = function() { divParent.style.backgroundColor = glo.styles.itemNoAction; };

    return divParent;
}

function styleHTMLTask(divTask){
    divTask.style.display             = 'grid';
    divTask.style.gridTemplateColumns = '50% 25% 15%';
    divTask.style.border              = '1px #ccc solid';
    divTask.style.borderRadius        = '6px';
    divTask.style.marginBottom        = '7px';
    divTask.style.padding             = '15px';
}

function dateToStrFr(date, withTime = false){
    const day   = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year  = date.getFullYear();

    let dateToReturn = `${day}/${month}/${year}`;
    if(withTime){
        let hours   = date.getHours();
        let minutes = date.getMinutes();

        minutes = minutes > 9 ? minutes : '0' + minutes;
        hours   = hours > 9 ? hours : '0' + hours;

        dateToReturn += ` ${hours}:${minutes}`;
    }

    return dateToReturn; 
}


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
    glo.todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}



async function getOneTodo(id) {
    glo.oneTodo = await getOneInFetch(id);
}

/**
 * Envoie une requête POST avec les données spécifiées.
 */
async function sendPostRequest(text, tags) {
    const body = {
        "text": text,
        "Tags": tags
    };

    try {
        const response = await postInFetch(glo.urls.baseFetch, body);
        location.reload();
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