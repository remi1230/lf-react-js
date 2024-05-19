let updDialog = getById('updDialog');

document.addEventListener('DOMContentLoaded', async function() {
    showUserConnectInfos();
    glo.taskId = getOneUrlParam('taskId');
    await getOneTodo(glo.taskId);
    makeHTMLTask();
});

function getOneUrlParam(param){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function makeHTMLTask(dataTask = glo.oneTodo){
    function makeTags(tags){
        let divParent = document.createElement('div');

        tags.forEach(tag => {
            let spanTag = document.createElement('span');
            let txtTag = document.createTextNode(tag);

            spanTag.className = 'taskTag';

            spanTag.appendChild(txtTag);
            divParent.appendChild(spanTag);
        });
        return divParent;
    }
    function makeItemTask(title, content, divContentId){
        let [divChildParent, divChildTitle, divChildContent] = createDivs(3);

        let txtTitle = document.createTextNode(title);
        let txt;
        if(!Array.isArray(content)){ txt = document.createTextNode(content); }
        else{ txt = makeTags(content); }

        divChildTitle.appendChild(txtTitle);
        divChildContent.appendChild(txt);
        divChildParent.appendChild(divChildTitle);
        divChildParent.appendChild(divChildContent);

        divChildContent.id = divContentId;

        divChildContent.style.whiteSpace = 'nowrap';

        divChildParent.className = "oneTaskTitleParent";
        divChildTitle.className  = "oneTaskTitle";

        return divChildParent;
    }

    getById('taskTitle').innerText = dataTask.text;

    let divParent = document.createElement('div');
    
    let date = dateToStrFr(new Date(dataTask.created_at), true);
    let done = dataTask.is_complete ? 'Terminée' : 'En cours';

    date = 'Créée le ' + date.replace(/ /g, ' à ');
    
    let divDescription = makeItemTask("Titre :".replace(/ /g, '\u00A0'), dataTask.text, 'taskText');
    let divTags        = makeItemTask("Tags  :".replace(/ /g, '\u00A0'), dataTask.Tags, 'taskTags');
    let divDate        = makeItemTask("Date :".replace(/ /g, '\u00A0'), date, 'taskDate');
    let divDone        = makeItemTask("État   :".replace(/ /g, '\u00A0'), done, 'taskDone');

    divParent.appendChild(divDescription);
    divParent.appendChild(divTags);
    divParent.appendChild(divDate);
    divParent.appendChild(divDone);

    app.appendChild(divParent);

    toggleStateTaskButton();
}

function toggleStateTaskButton(){
    getById('toggleStateTaskButton').value = glo.oneTodo.is_complete ? "Réouvir la tâche" : "Fermer la tâche";
}

async function deleteTask(id = glo.oneTodo.id ) {
    var result = confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
    if(result){
        await sendDelRequest(id);
    }
};

async function toggleStateTask(id = glo.oneTodo.id ) {
    glo.oneTodo.is_complete = !glo.oneTodo.is_complete;
    toggleStateTaskButton();
    await toggleStatusTask(id, glo.oneTodo.is_complete);
};

function getTaskDoneSwitchValue(){
    const taskDoneValue       = getById('taskDone').innerText;
    const taskDoneSwitchValue = taskDoneValue === 'En cours' ? true : false;

    return taskDoneSwitchValue;
}

async function toggleStatusTask(id, is_complete){
    await sendPutRequest(id, is_complete);
}