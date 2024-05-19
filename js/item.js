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
    function makeItemTask(title, content, divContentId){
        let [divChildParent, divChildTitle, divChildContent] = createDivs(3);

        let txtTitle = document.createTextNode(title);
        let txt      = document.createTextNode(content);

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
    
    let tags = dataTask.Tags.join(', ');
    let date = dateToStrFr(new Date(dataTask.created_at), true);
    let done = dataTask.is_complete ? 'Terminée' : 'En cours';
    
    let divDescription = makeItemTask("Titre :".replace(/ /g, '\u00A0'), dataTask.text, 'taskText');
    let divTags        = makeItemTask("Tags  :".replace(/ /g, '\u00A0'), tags, 'taskTags');
    let divDate        = makeItemTask("Date :".replace(/ /g, '\u00A0'), date, 'taskDate');
    let divDone        = makeItemTask("État   :".replace(/ /g, '\u00A0'), done, 'taskDone');
    
    styleHTMLTask(app);

    divParent.appendChild(divDescription);
    divParent.appendChild(divTags);
    divParent.appendChild(divDate);
    divParent.appendChild(divDone);

    app.appendChild(divParent);

    toggleStateTaskButton();

    /*app.style.display             = 'grid';
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

    app.appendChild(divIcons);*/
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

function styleHTMLTask(divTask){
    divTask.style.border       = '1px #ccc solid';
    divTask.style.borderRadius = '6px';
    divTask.style.marginBottom = '7px';
    divTask.style.padding      = '15px 20px 15px 15px';
    divTask.style.width        = 'fit-content';
    divTask.style.gap          = '18%';
}