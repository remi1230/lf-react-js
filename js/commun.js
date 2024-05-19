// Déclaration d'un objet pour les variables globales
let glo = {
    urls: {
        base      : 'http://localhost:8080/',
        baseFetch : 'http://localhost:3000/todos',
    },
    taskId: 0,
    todos : [],
    oneTodo: {},
    styles: {
        itemHovering: '#eee',
        itemNoAction: '#fff',
    },
    getNextId: function(){ return Math.max(...glo.todos.map(todo => todo.id)) + 1 ; },
};

/**
 * Récupère un élément du DOM par son identifiant.
 * @param {string} id - L'identifiant de l'élément à récupérer.
 * @returns {Element} L'élément du DOM correspondant à l'identifiant fourni.
 */
const getById = id => document.getElementById(id);
const app     = getById('app');

function showUserConnectInfos(){
    getById('userConnect').innerText = "User: " + localStorage.getItem('prenom');
}

function createDivs(number){
    return Array.from({ length: number }, () => {
        return document.createElement('div');
    });
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
        "id"  : glo.getNextId(),
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
async function sendPutRequest(id, is_complete) {
    const url    = `${glo.urls.baseFetch}/${id}`;
    const body   = {
        "is_complete": is_complete
    };

    let taskDone = getById('taskDone');

    try {
        const response = await putInFetch(url, body);
        console.log('Données mises à jour:', response);
        taskDone.innerText = is_complete ? 'Terminée' : "En cours";
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
        window.open(glo.urls.base + "tasks.html", "_self");
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

        let data;
        if(method !== 'DELETE'){ data = await response.json(); }
        else{ data = "Tâche supprimée !"; }

        if (successFunction) {
            await successFunction(successFunctionParams ? successFunctionParams() : undefined);
        }

        return data;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}