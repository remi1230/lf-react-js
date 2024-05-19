let addDialog = getById('addDialog');

document.addEventListener('DOMContentLoaded', async function() {
    showUserConnectInfos();
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

    if(txt && tags[0] !== ""){ sendPostRequest(txt, tags); }
    else{ alert("Tous les champs doivent être renseignés !"); }
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
        const url = new URL(window.location.href);
        url.pathname = 'item.html';
        url.searchParams.set('taskId', dataTask.id);
        window.location.href = url.toString();
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