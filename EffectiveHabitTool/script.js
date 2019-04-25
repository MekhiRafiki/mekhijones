function loadRoleGoals() {
  currRGs = [];
  if (!localStorage.RG) {
    // default to empty array
    localStorage.RG = JSON.stringify(currRGs)
  } else {
    // Populate Roles and Goals
    currRGs = JSON.parse(localStorage.RG);
    populateRGs(currRGs);
  }
  /* Roles -> Goals Area */
  const rolesPane = document.getElementById("roles");
  rolesPane.addEventListener("click", event=>{
    event.preventDefault();

    if(event.target.id === "goalSubmit"){
      currRGs = JSON.parse(localStorage.RG);
      const newGoal = event.path[2].getElementsByTagName('textarea')[0].value;
      // find and Add to localStorage
      roleName = event.path[2].getElementsByTagName('h3')[0].innerHTML;
      role = currRGs.find(function(element){
        return roleName == element.role;
      });
      role.goals.push(newGoal);
      localStorage.RG = JSON.stringify(currRGs);
      console.log(currRGs);

      populateRGs(currRGs);

    } else if (event.target.id === "goalsClear"){
      currRGs = JSON.parse(localStorage.RG);
      roleName = event.path[2].getElementsByTagName('h3')[0].innerHTML;
      role = currRGs.find(function(element){
        return roleName == element.role;
      });
      role.goals = [];
      localStorage.RG = JSON.stringify(currRGs);
      populateRGs(currRGs);

    } else if(event.target.id === "goalComplete"){
      // This isn't called currently
      const role = event.path[3].getElementsByTagName('h3')[0].innerHTML;
      const completed_goal = event.path[1].getElementsByTagName('h4')[0].innerHTML;
      currRGs = JSON.parse(localStorage.RG);
      for(var i = 0; i < currRGs.length; i++){
        if(currRGs[i].role === role){
          console.log("Found the role");
          goals = currRGs[i].goals;
          console.log(goals);
          console.log(completed_goal);

          for(var j = 0; j < goals.length; j++){
            if(goals[j] === completed_goal){
              console.log("found the goal")
              goals.splice(j, 1);
              break;
            }
          }
          break;
        }
      }
      localStorage.RG = JSON.stringify(currRGs);
      console.log(currRGs);
      populateRGs(currRGs);
    }
  });
}


function loadWeeklyPriority() {
  currWPs = [];
  if (!localStorage.WP) {
    // default to empty array
    localStorage.WP = JSON.stringify([])
  } else {
    currWPs = JSON.parse(localStorage.WP);
    populateWPs(currWPs);
  }
  /* Weekly Priority Area */
  const prioritySubmitBtn = document.getElementById("prioritySubmit");

  prioritySubmitBtn.addEventListener("click", event =>{
    event.preventDefault();
    if(event.target.type === "submit"){
        const priorityInput = document.getElementById("newPriorityText");

        /* Add to Local Storage */
        var newWP = {
          wp: priorityInput.value
        }
        currWPs.push(newWP);
        localStorage.WP = JSON.stringify(currWPs);

        priorityInput.value = "";
        populateWPs(currWPs);
    }
  });

  /* Specific Priority Action */
  const priorityListDiv = document.getElementById("PriorityListDiv")
  priorityListDiv.addEventListener("click", event=>{
    event.preventDefault();
    if(event.path[0].id === "PriorityComplete"){
      const wp_name = event.path[1].getElementsByTagName('h4')[0].innerHTML;

      if(event.path[0].id === "PriorityComplete"){
        if (!localStorage.CT) {
          // default to empty array
          localStorage.CT = JSON.stringify([]);
        } else {
          // Populate the UL
          completedTasks = JSON.parse(localStorage.CT);
          completedTasks.push(wp_name);
          localStorage.CT = JSON.stringify(completedTasks);
        }
      }


      currWPs = JSON.parse(localStorage.WP);
      for (var i = 0; i < currWPs.length; i++){
        if (currWPs[i].wp === wp_name){
          currWPs.splice(i, 1);
          break;
        }
      }
      localStorage.WP = JSON.stringify(currWPs);
      populateWPs(currWPs);
    }

  });
}

function loadTaskSubmit(){
  currTasks = [];
  if (!localStorage.T) {
    // default to empty array
    localStorage.T = JSON.stringify(currTasks)
  } else {
    // Populate the UL
    currTasks = JSON.parse(localStorage.T);
    populateCurrTasks(currTasks);
  }

  /* Task Submission Area */
  const taskSubmitBtn = document.getElementById("taskSubmit");
  taskSubmitBtn.addEventListener("click", event =>{
    event.preventDefault();
    if(event.target.type === "submit"){
        const tasksInput = document.getElementById("newTaskText");
        /* Add to Local Storage */
        var newTask = {
          task: tasksInput.value
        }
        currTasks.push(newTask);

        localStorage.T = JSON.stringify(currTasks);

        tasksInput.value = ""; // Clear the screen

        populateCurrTasks(currTasks);
    }
  });

  /* Specific Task Action Area */
  const taskList = document.getElementById("TaskListDiv");
  taskList.addEventListener("click", event =>{
    event.preventDefault();
    const taskName = event.path[1].getElementsByTagName('h4')[0].innerHTML;

    // Add in a queue for completed Tasks
    if(event.path[0].id === "TaskComplete"){
      if (!localStorage.CT) {
        // default to empty array
        localStorage.CT = JSON.stringify([]);
      } else {
        // Populate the UL
        completedTasks = JSON.parse(localStorage.CT);
        completedTasks.push(taskName);
        localStorage.CT = JSON.stringify(completedTasks);
      }
    }
    currTasks = JSON.parse(localStorage.T);
    for (var i = 0; i < currTasks.length; i++){
      if (currTasks[i].task === taskName){
        currTasks.splice(i, 1);
        break;
      }
    }
    localStorage.T = JSON.stringify(currTasks);
    populateCurrTasks(currTasks);
  });
}

function populateCurrTasks(currTasks){
  const tasksList = document.getElementById("taskList");
  taskList.innerHTML = "";
  currTasks.forEach(function(element){
    var node = createTaskElement(element.task)
    tasksList.appendChild(node);
  });
}

function populateWPs(currWPs){
  const priorityList = document.getElementById("priorityList");
  priorityList.innerHTML = "";
  currWPs.forEach(function(element){
    var node = createWeeklyPriorityElement(element.wp)
    priorityList.appendChild(node);
  });
}

function populateRGs(currRGs){
  const RGList = document.getElementById("Roles2GoalsList");
  RGList.innerHTML = "";

  currRGs.forEach(function(element){
    RGList.appendChild(createRGElement(element))
  });

}
function createRGElement(element){
  return tag("div", {class: "RoleGoal"}, [
    tag("h3", {}, element.role),
    tag("ul", {id: "goalsForRole"}, createGoals(element.goals)),
    tag("div", {class: "roleGoalAdd"}, [
      tag("textarea", {id:"newGoal", type: "text", style: "width:80%"}, []),
      tag("button", {class:"btn", id: "goalSubmit"},[
        tag("i", {class:"fa fa-check"}, [])
      ]),
      tag("button", {class:"btn", id:"goalsClear"},[
        tag("i", {class:"fa fa-close"}, [])
      ])
    ])
  ])
}
function createTaskElement(task){
  return tag("li", {class: "specificTask", draggable:"true"}, [
    tag("h4", {class: "taskHeader"}, task),
    tag("img", {class: "statusBtn", src: "assets/CheckMark.png", alt:"Complete", height: "15", width: "15", id: "TaskComplete"}, []),
    tag("img", {class: "statusBtn", src: "assets/X-out.png", alt:"Cancel", height: "15", width: "15"}, [])
  ])
}
function createWeeklyPriorityElement(priority){
  return tag("div", {class: "specificTask"}, [
    tag("h4", {class: "taskHeader"}, priority),
    tag("img", {class: "statusBtn", src: "assets/CheckMark.png", alt:"Complete", height: "15", width: "15", id: "PriorityComplete"}, []),
    tag("img", {class: "statusBtn", src: "assets/X-out.png", alt:"Cancel", height: "15", width: "15"}, [])
  ])
}
function createGoalElement(goal){
  return tag("div", {class: "specificTask"}, [
    tag("h4", {}, goal)
  ])
}

function createGoals(goals){
  toReturn = [];
  goals.forEach(function(goal){
    var node = createGoalElement(goal)
    toReturn.push(node);
  });
  return toReturn;
}

/*
  Draggable Code
  Thanks to! https://codepen.io/retrofuturistic/pen/tlbHE
*/
var dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

  this.classList.add('dragElem');
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('over');

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    //alert(this.outerHTML);
    //dragSrcEl.innerHTML = this.innerHTML;
    //this.innerHTML = e.dataTransfer.getData('text/html');
    this.parentNode.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin',dropHTML);
    var dropElem = this.previousSibling;
    addDnDHandlers(dropElem);

  }
  this.classList.remove('over');
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.
  this.classList.remove('over');

  /*[].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });*/
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);

}

/*
  Thanks for form Template from W3!!

*/
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function newRole(){
  const newRoleName = document.getElementById("NewRoleField").value;
  document.getElementById("NewRoleField").value = "";
  let roles = JSON.parse(localStorage.RG);

  var newRole = {
    role: newRoleName,
    goals: []
  };
  roles.push(newRole);

  localStorage.RG = JSON.stringify(roles);

  populateRGs(roles);
  closeForm();
}

/* Credit to CS42 Piazza Assignment*/
/* Creates and returns an HTMLElement representing a tag of the given name.
 * attrs is an object, where the key-value pairs represent HTML attributes to
 * set on the tag. contents is an array of strings/HTMLElements (or just
 * a single string/HTMLElement) that will be contained within the tag.
 *
 * Examples:
 * tag('p', {}, 'A simple paragraph') => <p>A simple paragraph</p>
 * tag('a', {href: '/about'}, 'About') => <a href="/about">About</a>
 *
 * tag('ul', {}, tag('li', {}, 'First item')) => <ul><li>First item</li></ul>
 *
 * tag('div', {}, [
 *   tag('h1', {'class': 'headline'}, 'JavaScript'),
 *   ' is awesome, ',
 *   tag('span', {}, 'especially in CS42.')
 * ])
 * => <div>
 *      <h1 class="headline">JavaScript</h1>
 *      is awesome,
 *      <span>especially in CS42.</span>
 *    </div>
 */
function tag(name, attrs, contents) {
  const element = document.createElement(name)
  for (const name in attrs) {
    element.setAttribute(name, attrs[name])
  }

  // If contents is a single string or HTMLElement, make it an array of one
  // element; this guarantees that contents is an array below.
  if (!(contents instanceof Array)) {
    contents = [contents]
  }

  contents.forEach(piece => {
    if (piece instanceof HTMLElement) {
      element.appendChild(piece)
    } else {
      // must create a text node for a raw string
      element.appendChild(document.createTextNode(piece))
    }
  })

  return element
}

function load() {
  //localStorage.clear(); // Testing Purposes
  loadRoleGoals();
  loadWeeklyPriority();
  loadTaskSubmit();

  var tasks = document.querySelectorAll('.specificTask');
  [].forEach.call(tasks, addDnDHandlers);
}

window.onload = load;
