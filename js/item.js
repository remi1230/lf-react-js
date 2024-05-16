/**
 * Récupère un élément du DOM par son identifiant.
 * @param {string} id - L'identifiant de l'élément à récupérer.
 * @returns {Element} L'élément du DOM correspondant à l'identifiant fourni.
 */
const getById = id => document.getElementById(id);
const app     = getById('app');

let glo = {
    urls: {
        base      : 'http://localhost:8080/',
        baseFetch : 'http://localhost:3000/todos',
    },
    taskId: 0,
    oneTodo: {},
};

let updDialog = getById('updDialog');

document.addEventListener('DOMContentLoaded', async function() {
    glo.taskId = localStorage.getItem('taskId');
    await getOneTodo(glo.taskId);
    makeHTMLTask();
});

function makeHTMLTask(dataTask = glo.oneTodo){
    let divParent    = document.createElement('div');
    let divChildTxt  = document.createElement('div');
    let divChildTags = document.createElement('div');
    let divChildDate = document.createElement('div');
    let divChildDone = document.createElement('div');
    let txt  = document.createTextNode(dataTask.text);
    let tags = document.createTextNode(dataTask.Tags.join(', '));
    let date = document.createTextNode(dateToStrFr(new Date(dataTask.created_at), true));
    let done = document.createTextNode(dataTask.is_complete ? 'Terminée' : 'En cours');
    
    divChildTxt.appendChild(txt);
    divChildTags.appendChild(tags);
    divChildDate.appendChild(date);
    divChildDone.appendChild(done);

    divChildTxt.id  = 'taskTxt';
    divChildTags.id = 'taskTags';
    divChildDate.id = 'taskDate';
    divChildDone.id = 'taskDone';

    divChildTxt.style.whiteSpace = 'nowrap';
    divChildDate.style.whiteSpace = 'nowrap';
    divChildTags.style.whiteSpace = 'nowrap';
    divChildDone.style.whiteSpace = 'nowrap';

    styleHTMLTask(app);

    divParent.appendChild(divChildTxt);
    divParent.appendChild(divChildTags);
    divParent.appendChild(divChildDate);
    divParent.appendChild(divChildDone);

    app.appendChild(divParent);

    app.style.display             = 'grid';
    app.style.gridTemplateColumns = '80% 20%';

    let divIcons   = document.createElement('div');
    let divIconUpd = document.createElement('div');
    let divIconDel = document.createElement('div');

    let divIconUpdTxt = document.createTextNode('✏️');
    let divIconDelTxt = document.createTextNode('🗑️');

    divIconUpd.style.cursor = 'pointer';
    divIconDel.style.cursor = 'pointer';

    divIconUpd.appendChild(divIconUpdTxt);
    divIconDel.appendChild(divIconDelTxt);

    divIconUpd.id = 'divIconUpd';
    divIconDel.id = 'divIconDel';

    divIconUpd.onclick = async function() {
        const is_complete = getTaskDoneSwitchValue();
        await toggleStatusTask(dataTask.id, is_complete);
    };
    divIconDel.onclick = async function() {
        var result = confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
        if(result){
            await sendDelRequest(dataTask.id);
        }
    };

    divIcons.appendChild(divIconUpd);
    divIcons.appendChild(divIconDel);

    divIcons.style.display        = 'flex';
    divIcons.style.flexDirection  = 'column';
    divIcons.style.justifyContent = 'center';
    divIcons.style.rowGap         = '10px';

    app.appendChild(divIcons);
}

function getTaskDoneSwitchValue(){
    const taskDoneValue       = getById('taskDone').innerText;
    const taskDoneSwitchValue = taskDoneValue === 'En cours' ? true : false;

    return taskDoneSwitchValue;
}

async function toggleStatusTask(id, is_complete){
    await sendPutRequest(id, is_complete);
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
        app.remove();
        getById('portfolio').innerHTML = "<h2>Tâche supprimée !</h2>";
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la requête DELETE:', error);
    }
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

function styleHTMLTask(divTask){
    divTask.style.border       = '1px #ccc solid';
    divTask.style.borderRadius = '6px';
    divTask.style.marginBottom = '7px';
    divTask.style.padding      = '15px 20px 15px 15px';
    divTask.style.width        = 'fit-content';
    divTask.style.gap          = '18%';
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




async function getOneTodo(id) {
    glo.oneTodo = await getOneInFetch(id);
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