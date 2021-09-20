let globalTaskData = [];

taskContents = document.getElementById("taskContents");

const addCard = () => {
	const newTaskDetails = {
		id: `${Date.now()}`,
		url: document.getElementById("imageURL").value,
		title: document.getElementById("taskTitle").value,
		type: document.getElementById("taskType").value,
		deadline: document.getElementById("taskDeadline").value,
		description: document.getElementById("taskDescription").value,
	};

	taskContents.insertAdjacentHTML('beforeend', generateCard(newTaskDetails));

	globalTaskData.push(newTaskDetails);
	saveToLocalStorage();
};

const generateCard = ({id, url, title, type, deadline, description}) => 
	`<div id=${id} class="col-md-6 col-lg-4 mt-4">
		<div class="card" key=${id}>
			<div class="card-header">
				<div class="d-flex justify-content-end">
					<button type="button" class="btn btn-outline-info" name=${id} onclick="editTask(this)">
						<i class="fas fa-pencil-alt"></i>
					</button>
					<button type="button" class="btn btn-outline-danger" name=${id} onclick="deleteTask(this)">
						<i class="fas fa-trash-alt"></i>
					</button>
				</div>
			</div>
			<img src="${url || "https://previews.123rf.com/images/underverse/underverse1506/underverse150600803/41162151-task-word-on-notes-paper-with-cork-background-.jpg"}" class="card-img-top" alt="image">
			<div class="card-body">
				<h5 class="card-title">${title}</h5>
				<p class="card-text">${description}</p>
				<p class="badge bg-primary">${type}</p>
				<p class="badge bg-danger float-end">${deadline}</p>
			</div>
			<div class="card-footer">
				<button type="button" class="btn btn-outline-primary float-end" data-bs-target="#openTaskModal" data-bs-toggle="modal" onclick="openTaskModal(this)" name=${id}>Open Task</button>
			</div>
		</div>
	</div>`


const saveToLocalStorage = () => {
	localStorage.setItem("taskboy", JSON.stringify({tasks: globalTaskData}));
};

const reloadTaskCards = () => {
	const localStorageCopy = JSON.parse(localStorage.getItem("taskboy"));
	if(localStorageCopy) {
		globalTaskData = localStorageCopy.tasks;
	}
	globalTaskData.map((cardData) => {
		taskContents.insertAdjacentHTML('beforeend', generateCard(cardData));
	});
};

const deleteTask = (e) => {
	const targetID = e.getAttribute("name");
	globalTaskData = globalTaskData.filter((cardData) => cardData.id!==targetID);
	saveToLocalStorage();
	window.location.reload();
};

const editTask = (e) => {
	const targetID = e.getAttribute("name");
	e.parentNode.parentNode.parentNode.childNodes[5].childNodes[1].setAttribute("contenteditable", "true");
	e.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].setAttribute("contenteditable", "true");
	e.parentNode.parentNode.parentNode.childNodes[5].childNodes[5].setAttribute("contenteditable", "true");
	e.parentNode.parentNode.parentNode.childNodes[5].childNodes[7].setAttribute("contenteditable", "true");
	e.parentNode.parentNode.parentNode.childNodes[7].childNodes[1].innerHTML = "Save Changes";
	e.parentNode.parentNode.parentNode.childNodes[7].childNodes[1].setAttribute("onclick", "saveEdits(this)");
	e.parentNode.parentNode.parentNode.childNodes[7].childNodes[1].setAttribute("name", targetID);
	e.parentNode.parentNode.parentNode.childNodes[7].childNodes[1].setAttribute("data-bs-target", "");
};

const saveEdits = (e) => {
	const targetID = e.getAttribute("name");
	const updatedTaskData = {
		id: targetID,
		url: document.getElementsByTagName("img")[0].getAttribute("src"),
		title: e.parentNode.parentNode.childNodes[5].childNodes[1].innerHTML,
		type: e.parentNode.parentNode.childNodes[5].childNodes[5].innerHTML,
		deadline: e.parentNode.parentNode.childNodes[5].childNodes[7].innerHTML,
		description: e.parentNode.parentNode.childNodes[5].childNodes[3].innerHTML,
	};
	globalTaskData = globalTaskData.map((cardData) => (cardData.id === targetID) ? updatedTaskData : cardData);
	saveToLocalStorage();
	window.location.reload();

	e.parentNode.parentNode.childNodes[5].childNodes[1].setAttribute("contenteditable", "false");
	e.parentNode.parentNode.childNodes[5].childNodes[3].setAttribute("contenteditable", "false");
	e.parentNode.parentNode.childNodes[5].childNodes[5].setAttribute("contenteditable", "false");
	e.parentNode.parentNode.childNodes[5].childNodes[7].setAttribute("contenteditable", "false");
	e.innerHTML = "Open Task";
	e.setAttribute("onclick", "openTaskModal(this)");
	e.setAttribute("data-bs-target", "#openTaskModal");
};

const generateTaskModal = ({id, url, title, type, deadline, description}) => {
	const date = new Date(parseInt(id));
	return `<div id=${id}>
		<img src="${url || "https://previews.123rf.com/images/underverse/underverse1506/underverse150600803/41162151-task-word-on-notes-paper-with-cork-background-.jpg"}" alt="image" class="w-100">
		<strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
		<h5 class="modal-title">${title}</h5>
		<p class="modal-body">${description}</p>
		<p class="badge bg-primary">${type}</p>
		<p class="badge bg-danger float-end">${deadline}</p>
	</div>`;
};

const openTaskModal = (e) => {
	const targetID = e.getAttribute("name");
	const targetCard = globalTaskData.filter((e) => e.id == targetID);
	document.getElementById("open__task__modal").innerHTML = generateTaskModal(targetCard[0]);
};

const searchTask = (e) => {
	if (!e) e = window.event;
	while (taskContents.firstChild) {
		taskContents.removeChild(taskContents.firstChild);
	}

	const resultData = globalTaskData.filter(({title}) =>
		title.includes(e.target.value)
	);

	resultData.map((cardData) => {
		taskContents.insertAdjacentHTML("beforeend", generateCard(cardData));
	});
};

const sortByCreated = () => {
	window.location.reload();
	while (taskContents.firstChild) {
		taskContents.removeChild(taskContents.firstChild);
	}
	globalTaskData.sort((a, b) => {
		let da = new Date(a.id),
			db = new Date(b.id);
		return da - db;
	});
	globalTaskData.forEach((e) => taskContents.insertAdjacentHTML("beforeend", generateCard(e)));
}

const sortByDeadline = () => {
	while (taskContents.firstChild) {
		taskContents.removeChild(taskContents.firstChild);
	}
	globalTaskData.sort((a, b) => {
		const da = new Date(a.deadline),
			db = new Date(b.deadline);
		return da - db;
	});
	globalTaskData.forEach((e) => taskContents.insertAdjacentHTML("beforeend", generateCard(e)));
}

const sorting = () => {
	value = document.getElementById("sort").value;
	if(value == 1)
	{
		return sortByCreated();
	}
	else if(value == 2)
	{
		return sortByDeadline();
	}
}

const deadlineCheck = (e) => {
	if (!e) e = window.event;

	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0');
	var yyyy = today.getFullYear();
	today = yyyy + '-' + mm + '-' + dd;	

	globalTaskData.forEach((card) => {
		if (today == card.deadline) {
			document.getElementById(card.id).childNodes[1].setAttribute("style", "box-shadow: 4px 4px 25px 5px red;");
		}
	})
}