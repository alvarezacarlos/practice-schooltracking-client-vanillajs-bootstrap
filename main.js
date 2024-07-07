const NAV_LINK_MAP = {
  navLinkCreateActivity: "createActivityTemplate",
  navLinkUpdateActivity: "updateActivityTemplate",
  navLinkCreateTask: "createTasksTemplate",
  navLinkUpdateTask: "updateTasksTemplate",
  navLinkActivitiesList: "activitiesListTasksTemplate",
  navLinkTasksList: "tasksListTasksTemplate",
};

const SERVER_URL = "https://0jq5kt41-5000.use2.devtunnels.ms"

const handleFetchActivities = async () => {
  const response = await fetch(`${SERVER_URL}/activities`, {
    mode: 'cors', // Configuración de modo CORS
    headers: {
      // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');   
      'Access-Control-Allow-Origin': 'http://localhost:5500',
      'Content-Type': 'application/json'
    }
  });
  const responseJSON = await response.json();
  console.log(responseJSON.data);
  console.log("hey");
  const activities = responseJSON.data;
  const activitiesOrderedList = document.querySelector(
    "#activitiesOrderedList"
  );
  activities.forEach((activity) => {
    let li = document.createElement("li");
    li.innerText = `${activity.ID} - ${activity.ActivityName} - ${activity.SubjectName} - ${activity.ActivityGrade}`;
    li.classList.add("list-group-item");

    if (parseInt(activity.ActivityGrade) === 0) {
      // the task hasn't a grade, its opened
      li.classList.add("opened-assignmet");
    } else {
      // the task has a grade, its closed
      li.classList.add("closed-assignmet");
    }

    activitiesOrderedList.appendChild(li);
  });
};

const handleFetchTasks = async () => {
  const response = await fetch(`${SERVER_URL}/tasks`);
  const responseJSON = await response.json();
  console.log(responseJSON.data);
  console.log("hey");
  const tasks = responseJSON.data;
  const tasksOrderedList = document.querySelector("#tasksOrderedList");
  tasks.forEach((task) => {
    let li = document.createElement("li");
    li.innerText = `${task.ID} - ${task.TaskName} - ${task.SubjectName} - ${task.TaskGrade}`;
    li.classList.add("list-group-item");

    if (parseInt(task.TaskGrade) === 0) {
      // the task hasn't a grade, its opened
      li.classList.add("opened-assignmet");
    } else {
      // the task has a grade, its closed
      li.classList.add("closed-assignmet");
    }

    tasksOrderedList.appendChild(li);
  });
};

// UPDATE TASK LOGIC
// clear create task form
const clearUpdateTaskForm = () => {
  const searchInput = document.querySelector("#task-id");
  const dateInput = document.querySelector("#update-task-date");
  const subjectInput = document.querySelector("#update-task-subject");
  const taskNameInput = document.querySelector("#update-task-name");
  const taskDescInput = document.querySelector("#update-task-desc");
  const taskTypeInput = document.querySelector("#update-task-type");
  const taskGradeInput = document.querySelector("#update-task-grade");

  searchInput.value = "";
  dateInput.value = "";
  subjectInput.value = "";
  taskNameInput.value = "";
  taskDescInput.value = "";
  taskTypeInput.value = "";
  taskGradeInput.value = "";
};

const handleUpdateTask = async (task, taskId) => {
  console.log("TASK", task);
  console.log("TASKID", taskId);
  const response = await fetch(`${SERVER_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const responseJSON = await response.json();
  clearUpdateTaskForm();
  console.log(responseJSON);
  alert("La nueva task ha sido actualizada con exito!");
};

const validateUpdateTaskForm = () => {
  const dateInput = document.querySelector("#update-task-date");
  const subjectInput = document.querySelector("#update-task-subject");
  const taskNameInput = document.querySelector("#update-task-name");
  const taskDescInput = document.querySelector("#update-task-desc");
  const taskTypeInput = document.querySelector("#update-task-type");
  const taskGradeInput = document.querySelector("#update-task-grade");

  const task = {
    date: dateInput.value,
    subject: subjectInput.value,
    taskName: taskNameInput.value,
    taskDesc: taskDescInput.value,
    taskType: taskTypeInput.value,
    taskGrade: taskGradeInput.value,
  };

  const validation = {
    error: true,
    message: null,
  };

  if (subjectInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "La Materia no puede estar vacía :(";
    return { validation, task };
  }

  if (taskNameInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "El nombre de la asignacion no puede estar vacío :(";
    return { validation, task };
  }

  if (taskTypeInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "El Tipo de la asignacion no puede estar vacío :(";
    return { validation, task };
  }

  let udpateTaskID = document.querySelector("#udpateTaskID");

  return { validation, task, taskId: udpateTaskID.value };
};

const initUpdateTaskForm = ({ task }) => {
  // get form fields
  const dateInput = document.querySelector("#update-task-date");
  const subjectInput = document.querySelector("#update-task-subject");
  const taskNameInput = document.querySelector("#update-task-name");
  const taskDescInput = document.querySelector("#update-task-desc");
  const taskTypeInput = document.querySelector("#update-task-type");
  const taskGradeInput = document.querySelector("#update-task-grade");

  console.log(task);
  console.log(taskNameInput);
  console.log(task.TaskName);
  var date = new Date(task.TaskDate);
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0"); // Añadir 1 al mes ya que los meses empiezan desde 0
  var day = String(date.getDate() + 1).padStart(2, "0");
  console.log(`${year}-${month}-${day}`);
  var formattedDate = `${year}-${month}-${day}`;
  dateInput.value = formattedDate;
  subjectInput.value = task.SubjectName;
  taskNameInput.value = task.TaskName;
  taskDescInput.value = task.TaskDesc;
  taskTypeInput.value = task.TaskType;
  taskGradeInput.value = task.TaskGrade;

  let udpateTaskID = document.querySelector("#udpateTaskID");
  udpateTaskID.value = task.ID;
};

const handleFetchOneTask = async ({ id }) => {
  const result = await fetch(`${SERVER_URL}/tasks/${id}`);
  const resultJSON = await result.json();
  // console.log(resultJSON);
  initUpdateTaskForm({ task: resultJSON.data });
};

const handleGetOneTask = () => {
  // gather form task id input
  const searchTaskIdInput = document.querySelector("#task-id");
  handleFetchOneTask({ id: parseInt(searchTaskIdInput.value, 10) });
};

// CREATE Task LOGIC
// clear create activity form
const clearCreateTaskForm = () => {
  const dateInput = document.querySelector("#create-task-date");
  const subjectInput = document.querySelector("#create-task-subject");
  const taskNameInput = document.querySelector("#create-task-name");
  const taskDescInput = document.querySelector("#create-task-desc");
  const taskTypeInput = document.querySelector("#create-task-type");
  const taskGradeInput = document.querySelector("#create-task-grade");

  dateInput.value = "";
  subjectInput.value = "";
  taskNameInput.value = "";
  taskDescInput.value = "";
  taskTypeInput.value = "";
  taskGradeInput.value = "";
};

// validate create task form
const validateCreateTaskForm = () => {
  const dateInput = document.querySelector("#create-task-date");
  const subjectInput = document.querySelector("#create-task-subject");
  const taskNameInput = document.querySelector("#create-task-name");
  const taskDescInput = document.querySelector("#create-task-desc");
  const taskTypeInput = document.querySelector("#create-task-type");
  const taskGradeInput = document.querySelector("#create-task-grade");

  const task = {
    date: dateInput.value,
    subject: subjectInput.value,
    taskName: taskNameInput.value,
    taskDesc: taskDescInput.value,
    taskType: taskTypeInput.value,
    taskGrade: taskGradeInput.value || 0,
  };

  const validation = {
    error: true,
    message: null,
  };

  if (subjectInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "La Materia no puede estar vacía :(";
    return { validation, task };
  }

  if (taskNameInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "El nombre de la asignación no puede estar vacía :(";
    return { validation, task };
  }

  if (taskTypeInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "El tipo de asignación no puede estar vacío :(";
    return { validation, task };
  }

  return { validation, task };
};

const handleCreateTask = async (task) => {
  const response = await fetch(`${SERVER_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const responseJSON = await response.json();
  clearCreateTaskForm();
  console.log(responseJSON);
  alert("La nueva asignación ha sido creada con exito!");
};

//UPDATE ACTIVITY LOGIC
// validate update activity form
// clear create activity form
const clearUpdateActivityForm = () => {
  const searchInput = document.querySelector("#activity-id");
  const dateInput = document.querySelector("#update-activity-date");
  const subjectInput = document.querySelector("#update-activity-subject");
  const activityNameInput = document.querySelector("#update-activity-name");
  const activityDescInput = document.querySelector("#update-activity-desc");
  const activityTypeInput = document.querySelector("#update-activity-type");
  const activityGradeInput = document.querySelector("#update-activity-grade");

  searchInput.value = "";
  dateInput.value = "";
  subjectInput.value = "";
  activityNameInput.value = "";
  activityDescInput.value = "";
  activityTypeInput.value = "";
  activityGradeInput.value = "";
};

const handleUpdateActivity = async (activity, activityId) => {
  console.log("ACTIVITY", activity);
  const response = await fetch(`${SERVER_URL}/activities/${activityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });
  const responseJSON = await response.json();
  clearUpdateActivityForm();
  console.log(responseJSON);
  alert("La nueva actividad ha sido actualizada con exito!");
};

const validateUpdateActivityForm = () => {
  const dateInput = document.querySelector("#update-activity-date");
  const subjectInput = document.querySelector("#update-activity-subject");
  const activityNameInput = document.querySelector("#update-activity-name");
  const activityDescInput = document.querySelector("#update-activity-desc");
  const activityTypeInput = document.querySelector("#update-activity-type");
  const activityGradeInput = document.querySelector("#update-activity-grade");

  const activity = {
    date: dateInput.value,
    subject: subjectInput.value,
    activityName: activityNameInput.value,
    activityDesc: activityDescInput.value,
    activityType: activityTypeInput.value,
    activityGrade: activityGradeInput.value,
  };

  const validation = {
    error: true,
    message: null,
  };

  if (subjectInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "La Materia no puede estar vacía :(";
    return { validation, activity };
  }

  if (activityNameInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "El nombre de la Actividad no puede estar vacío :(";
    return { validation, activity };
  }

  if (activityTypeInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "El Tipo de la Actividad no puede estar vacío :(";
    return { validation, activity };
  }

  let udpateActivityID = document.querySelector("#udpateActivityID");

  return { validation, activity, activityId: udpateActivityID.value };
};

const initUpdateActivityForm = ({ activity }) => {
  // get form fields
  const dateInput = document.querySelector("#update-activity-date");
  const subjectInput = document.querySelector("#update-activity-subject");
  const activityNameInput = document.querySelector("#update-activity-name");
  const activityDescInput = document.querySelector("#update-activity-desc");
  const activityTypeInput = document.querySelector("#update-activity-type");
  const activityGradeInput = document.querySelector("#update-activity-grade");

  console.log(activity);
  console.log(activityNameInput);
  console.log(activity.ActivityName);
  var date = new Date(activity.ActivityDate);
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0"); // Añadir 1 al mes ya que los meses empiezan desde 0
  var day = String(date.getDate() + 1).padStart(2, "0");
  console.log(`${year}-${month}-${day}`);
  var formattedDate = `${year}-${month}-${day}`;
  dateInput.value = formattedDate;
  subjectInput.value = activity.SubjectName;
  activityNameInput.value = activity.ActivityName;
  activityDescInput.value = activity.ActivityDesc;
  activityTypeInput.value = activity.ActivityType;
  activityGradeInput.value = activity.ActivityGrade;

  let udpateActivityID = document.querySelector("#udpateActivityID");
  udpateActivityID.value = activity.ID;
};

const handleFetchOneActivity = async ({ id }) => {
  const result = await fetch(`${SERVER_URL}/activities/${id}`);
  const resultJSON = await result.json();
  // console.log(resultJSON);
  initUpdateActivityForm({ activity: resultJSON.data });
};

const handleGetOneActivity = () => {
  // gather form task id input
  const searchActivityIdInput = document.querySelector("#activity-id");
  handleFetchOneActivity({ id: parseInt(searchActivityIdInput.value, 10) });
};

// CREATE ACTIVITY LOGIC
// clear create activity form
const clearCreateActivityForm = () => {
  const dateInput = document.querySelector("#create-activity-date");
  const subjectInput = document.querySelector("#create-activity-subject");
  const activityNameInput = document.querySelector("#create-activity-name");
  const activityDescInput = document.querySelector("#create-activity-desc");
  const activityTypeInput = document.querySelector("#create-activity-type");
  const activityGradeInput = document.querySelector("#create-activity-grade");

  dateInput.value = "";
  subjectInput.value = "";
  activityNameInput.value = "";
  activityDescInput.value = "";
  activityTypeInput.value = "";
  activityGradeInput.value = "";
};

// validate create activity form
const validateCreateActivityForm = () => {
  const dateInput = document.querySelector("#create-activity-date");
  const subjectInput = document.querySelector("#create-activity-subject");
  const activityNameInput = document.querySelector("#create-activity-name");
  const activityDescInput = document.querySelector("#create-activity-desc");
  const activityTypeInput = document.querySelector("#create-activity-type");
  const activityGradeInput = document.querySelector("#create-activity-grade");

  const activity = {
    date: dateInput.value,
    subject: subjectInput.value,
    activityName: activityNameInput.value,
    activityDesc: activityDescInput.value,
    activityType: activityTypeInput.value,
    activityGrade: activityGradeInput.value || 0,
  };

  const validation = {
    error: true,
    message: null,
  };

  if (subjectInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "La Materia no puede estar vacía :(";
    return { validation, activity };
  }

  if (activityNameInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "El nombre de la Actividad no puede estar vacío :(";
    return { validation, activity };
  }

  if (activityTypeInput.value.trim().length == 0) {
    validation.error = false;
    validation.message = "El Tipo de la Actividad no puede estar vacío :(";
    return { validation, activity };
  }

  return { validation, activity };
};

const handleCreateActivity = async (activity) => {
  const response = await fetch(`${SERVER_URL}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });
  const responseJSON = await response.json();
  clearCreateActivityForm();
  console.log(responseJSON);
  alert("La nueva actividad ha sido creada con exito!");
};

const handleNavLinkActive = (navLinks) => {
  navLinks.forEach((navLink) => {
    navLink.classList.remove("active");
  });
};

const handleSearchButtonClick = ({ navLinkName }) => {
  switch (navLinkName) {
    case NAV_LINK_MAP.navLinkUpdateActivity:
      // udpate activity logic
      handleGetOneActivity();
      break;
    case NAV_LINK_MAP.navLinkUpdateTask:
      // update task logic
      handleGetOneTask();
      break;
  }
};

const initAppSearchForm = ({ templateId, navLinkName }) => {
  // console.log(templateId, navLinkName)
  const searchTemplateButton = document.querySelector(
    `#${templateId}SearchButton`
  );
  // console.log(searchTemplateButton)
  // console.log('search button', searchTemplateButton)
  searchTemplateButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearchButtonClick({ navLinkName: navLinkName });
  });
};

const handleFormButtonClick = ({ navLinkName }) => {
  switch (navLinkName) {
    case NAV_LINK_MAP.navLinkCreateActivity:
      // create activity logic
      const { validation: createActivityValidation, activity: createActivity } =
        validateCreateActivityForm();
      if (!createActivityValidation.error) {
        alert(createActivityValidation.message);
        return;
      }
      handleCreateActivity(createActivity);
      break;
    case NAV_LINK_MAP.navLinkUpdateActivity:
      // udpate activity logic
      const {
        validation: updateActivityValidation,
        activity: updateActivity,
        activityId,
      } = validateUpdateActivityForm();
      console.log(updateActivityValidation, updateActivity);
      if (!updateActivityValidation.error) {
        alert(updateActivityValidation.message);
        return;
      }
      handleUpdateActivity(updateActivity, activityId);
      break;
    case NAV_LINK_MAP.navLinkCreateTask:
      // create task logic
      const { validation: createTaskValidation, task: newTask } =
        validateCreateTaskForm();
      if (!createTaskValidation.error) {
        alert(createTaskValidation.message);
        return;
      }
      handleCreateTask(newTask);
      break;
    case NAV_LINK_MAP.navLinkUpdateTask:
      // update task logic
      const {
        validation: updateTaskValidation,
        task,
        taskId,
      } = validateUpdateTaskForm();
      console.log(updateTaskValidation, task);
      if (!updateTaskValidation.error) {
        alert(updateTaskValidation.message);
        return;
      }
      handleUpdateTask(task, taskId);
      break;
  }
};

const initAppForm = ({ templateId, navLinkName }) => {
  // search button for udpdate tabs
  if (
    templateId === NAV_LINK_MAP.navLinkUpdateActivity ||
    templateId === NAV_LINK_MAP.navLinkUpdateTask
  ) {
    initAppSearchForm({
      templateId: templateId,
      navLinkName: templateId,
    });
  }

  // main form button for create/update tasks/activities
  const createTemplateButton = document.querySelector(`#${templateId}Button`);
  createTemplateButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleFormButtonClick({ navLinkName: navLinkName });
  });
};

// init the nav ribbon to listen the click event and render the templates dynamically
const handleNavLinkClick = (link, navLink) => {
  link.addEventListener("click", (e) => {
    handleNavLinkActive(navLink);
    link.classList.add("active");
    const appFormContainer = document.getElementById("form-container");
    const template = document.querySelector(`#${NAV_LINK_MAP[e.target.id]}`);
    const templateContent = document.importNode(template.content, true);
    appFormContainer.removeChild(appFormContainer.firstElementChild);
    appFormContainer.insertAdjacentElement(
      "afterbegin",
      templateContent.firstElementChild
    );
    // console.log(NAV_LINK_MAP[e.target.id])
    // app form
    if (NAV_LINK_MAP[e.target.id] === NAV_LINK_MAP.navLinkActivitiesList) {
      handleFetchActivities();
      return;
    }

    if (NAV_LINK_MAP[e.target.id] === NAV_LINK_MAP.navLinkTasksList) {
      handleFetchTasks();
      return;
    }

    initAppForm({
      templateId: NAV_LINK_MAP[e.target.id],
      navLinkName: NAV_LINK_MAP[e.target.id],
    });
  });
};

// render create template as default in the app
const renderCreateActivityTemplate = () => {
  const appFormContainer = document.querySelector("#form-container");
  const template = document.querySelector("#createActivityTemplate");
  const templateContent = document.importNode(template.content, true);
  // render content into app
  appFormContainer.insertAdjacentElement(
    "afterbegin",
    templateContent.firstElementChild
  );
  // init rendered content
  initAppForm({
    templateId: "createActivityTemplate",
    navLinkName: NAV_LINK_MAP.navLinkCreateActivity,
  });
};

const initNav = () => {
  const navLinks = document.querySelectorAll("#main-nav .nav-link");
  navLinks.forEach((link) => handleNavLinkClick(link, navLinks));
  renderCreateActivityTemplate();
};

const initApp = () => {
  initNav();
};

window.onload = initApp;
