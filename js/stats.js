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

document.addEventListener('DOMContentLoaded', async function() {
    await getAllTodos();
    feedTaskStats();
});

function feedTaskStats(){
    const stats = calcStats();

    showNumberTimeByTime(stats.tasksTotal, 'statTotal');
    showNumberTimeByTime(stats.taskUndone, 'statUndone');
    showNumberTimeByTime(stats.taskDone, 'statDone');
}

function calcStats(){
    const tasks      = glo.todos;
    const tasksTotal = tasks.length;

    const taskDone   = tasks.filter(task => task.is_complete).length;
    const taskUndone = tasksTotal- taskDone;

    return {tasksTotal, taskDone, taskUndone};
}

function showNumberTimeByTime(number, htmlElemId, laptime = 100) {
    for (let i = 0; i <= number; i++) {
        setTimeout(function() {
            if(i !== parseInt(number) || parseInt(number) === number){ getById(htmlElemId).innerText = i; }
            else{
                getById(htmlElemId).innerText = number;
            }
        }, i * laptime);
    }
}

async function getAllTodos() {
    glo.todos = await getInFetch(glo.urls.baseFetch);
    glo.todos = glo.todos[0]['todolist'];
    glo.todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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