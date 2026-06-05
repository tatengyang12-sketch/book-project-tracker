let projects = [];

function addProject() {
  let title = document.getElementById("bookTitle").value;
  let character = document.getElementById("mainCharacter").value;
  let size = document.getElementById("bookSize").value;
  let pages = document.getElementById("pageCount").value;
  let status = document.getElementById("bookStatus").value;
  let notes = document.getElementById("bookNotes").value;

  if (title === "") {
    alert("Please enter a book title.");
    return;
  }

  let newProject = {
    id: Date.now(),
    title: title,
    character: character,
    size: size,
    pages: pages,
    status: status,
    notes: notes
  };

  projects.push(newProject);

  saveProjects();
  displayProjects();

  document.getElementById("bookTitle").value = "";
  document.getElementById("mainCharacter").value = "";
  document.getElementById("bookSize").value = "8.5 x 8.5";
  document.getElementById("pageCount").value = "";
  document.getElementById("bookStatus").value = "Idea";
  document.getElementById("bookNotes").value = "";
}

function displayProjects() {
      updateStats();

  let projectList = document.getElementById("projectList");

  projectList.innerHTML = "";
  let searchText = document.getElementById("searchInput").value.toLowerCase();
  let statusFilter = document.getElementById("statusFilter").value;

  for (let project of projects) {
    if (!project.title.toLowerCase().includes(searchText)) {
      continue;
    }
    if (statusFilter !== "All" && project.status !== statusFilter) {
      continue;
    }
    let projectCard = document.createElement("div");
    projectCard.className = "project-card";

    projectCard.innerHTML = `
      <h3>${project.title}</h3>
      <p><strong>Main Character:</strong> ${project.character}</p>
      <p><strong>Book Size:</strong> ${project.size || "Not added yet"}</p>
      <p><strong>Page Count:</strong> ${project.pages}</p>
      <p><strong>Notes:</strong> ${project.notes || ""}</p>

      <p><strong>Status:</strong></p>
      <select class="card-status" onchange="updateProjectStatus(${project.id}, this.value)">
        <option value="Idea" ${project.status === "Idea" ? "selected" : ""}>Idea</option>
        <option value="Writing" ${project.status === "Writing" ? "selected" : ""}>Writing</option>
        <option value="Drawing" ${project.status === "Drawing" ? "selected" : ""}>Drawing</option>
        <option value="Editing" ${project.status === "Editing" ? "selected" : ""}>Editing</option>
        <option value="Ready for KDP" ${project.status === "Ready for KDP" ? "selected" : ""}>Ready for KDP</option>
        <option value="Published" ${project.status === "Published" ? "selected" : ""}>Published</option>
      </select>

      <button class="delete-button" onclick="deleteProject(${project.id})">Delete</button>
    `;

    projectList.appendChild(projectCard);
  }
}

function updateProjectStatus(id, newStatus) {
  for (let project of projects) {
    if (project.id === id) {
      project.status = newStatus;
    }
  }

  saveProjects();
  updateStats();
}

function updateStats() {
  let total = projects.length;

  let ideaCount = projects.filter(function(project) {
    return project.status === "Idea";
  }).length;

  let writingCount = projects.filter(function(project) {
    return project.status === "Writing";
  }).length;

  let drawingCount = projects.filter(function(project) {
    return project.status === "Drawing";
  }).length;

  let editingCount = projects.filter(function(project) {
    return project.status === "Editing";
  }).length;

  let readyCount = projects.filter(function(project) {
    return project.status === "Ready for KDP";
  }).length;

  let publishedCount = projects.filter(function(project) {
    return project.status === "Published";
  }).length;

  let stats = document.getElementById("stats");

  stats.innerHTML = `
    <p><strong>Total Projects:</strong> ${total}</p>
    <p><strong>Idea:</strong> ${ideaCount}</p>
    <p><strong>Writing:</strong> ${writingCount}</p>
    <p><strong>Drawing:</strong> ${drawingCount}</p>
    <p><strong>Editing:</strong> ${editingCount}</p>
    <p><strong>Ready for KDP:</strong> ${readyCount}</p>
    <p><strong>Published:</strong> ${publishedCount}</p>
  `;
}

function deleteProject(id) {
  projects = projects.filter(function(project) {
    return project.id !== id;
  });

  saveProjects();
  displayProjects();
}

function saveProjects() {
  localStorage.setItem("bookProjects", JSON.stringify(projects));
}

function loadProjects() {
  let savedProjects = localStorage.getItem("bookProjects");

  if (savedProjects !== null) {
    projects = JSON.parse(savedProjects);
  }

  displayProjects();
}

loadProjects();