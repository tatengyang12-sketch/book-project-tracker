let projects = [];

function addProject() {
  let title = document.getElementById("bookTitle").value;
  let character = document.getElementById("mainCharacter").value;
  let size = document.getElementById("bookSize").value;
let pages = document.getElementById("pageCount").value;
let targetDate = document.getElementById("targetDate").value;
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
  targetDate: targetDate,
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
document.getElementById("targetDate").value = "";
document.getElementById("bookStatus").value = "Idea";
document.getElementById("bookNotes").value = "";}

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
<p><strong>Target Date:</strong> ${project.targetDate || "No date yet"}</p>
<p><strong>Notes:</strong></p>
<textarea class="card-notes" onchange="updateProjectNotes(${project.id}, this.value)">${project.notes || ""}</textarea>

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
function updateProjectNotes(id, newNotes) {
  for (let project of projects) {
    if (project.id === id) {
      project.notes = newNotes;
    }
  }

  saveProjects();
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
function exportBackup() {
  if (projects.length === 0) {
    alert("There are no projects to back up yet.");
    return;
  }

  let data = JSON.stringify(projects, null, 2);

  let file = new Blob([data], {
    type: "application/json"
  });

  let link = document.createElement("a");

  link.href = URL.createObjectURL(file);
  link.download = "book-projects-backup.json";
  link.click();

  URL.revokeObjectURL(link.href);
}
function importBackup(event) {
  let file = event.target.files[0];

  if (!file) {
    return;
  }

  let reader = new FileReader();

  reader.onload = function() {
    try {
      let importedProjects = JSON.parse(reader.result);

      if (!Array.isArray(importedProjects)) {
        alert("This backup file does not look right.");
        return;
      }

      let shouldImport = confirm("Importing this backup will replace your current projects. Do you want to continue?");

      if (!shouldImport) {
        return;
      }

      projects = importedProjects;

      saveProjects();
      displayProjects();

      alert("Backup imported successfully!");
    } catch (error) {
      alert("Something went wrong. Please choose a valid backup file.");
    }
  };

  reader.readAsText(file);

  event.target.value = "";
}

function loadProjects() {
  let savedProjects = localStorage.getItem("bookProjects");

  if (savedProjects !== null) {
    projects = JSON.parse(savedProjects);
  }

  displayProjects();
}

loadProjects();