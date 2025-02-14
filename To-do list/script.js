const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const categorySelect = document.getElementById("category");
const filterSelect = document.getElementById("filter");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const clearAllButton = document.getElementById("clear-all");
const colorPicker = document.getElementById("color-picker");
const darkModeButton = document.getElementById("dark-mode-toggle");

// Dark mode toggle
darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Simpan & muat tugas dari local storage
function saveTask() {
    const tasks = [];
    document.querySelectorAll("#list-container li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").innerText.split(" (")[0], // Ambil hanya teks tugas
            completed: li.classList.contains("completed"),
            category: li.dataset.category,
            color: li.style.backgroundColor
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTask() {
    listContainer.innerHTML = ""; // Kosongkan daftar sebelum memuat ulang
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach(task => addTask(task.text, task.completed, task.color, task.category, false));
    updateCounter();
}

// Tambah tugas baru
function addTask(taskText = null, completed = false, taskColor = null, taskCategory = null, save = true) {
    if (!taskText) {
        taskText = inputBox.value.trim();
        taskColor = colorPicker.value;
        taskCategory = categorySelect.value;

        if (!taskText) {
            alert("Silahkan masukkan tugas!");
            return;
        }
    }

    const li = document.createElement("li");
    li.style.backgroundColor = taskColor;
    li.classList.add("task-item");
    li.dataset.category = taskCategory;

    li.innerHTML = `
        <label style="flex: 1; display: flex; align-items: center;">
            <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
            <span class="task-text">${taskText} <small>(${taskCategory})</small></span>
        </label>
        <div class="button-group">
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">❌</button>
        </div>
    `;

    if (completed) {
        li.classList.add("completed");
    }

    listContainer.appendChild(li);
    inputBox.value = "";

    if (save) saveTask();
    updateCounter();

    // Event Listener untuk checkbox
    const checkBox = li.querySelector(".task-checkbox");
    checkBox.addEventListener("change", function () {
        li.classList.toggle("completed", checkBox.checked);
        saveTask();
        updateCounter();
        filterTasks();
    });

    // Edit Tugas
    li.querySelector(".edit-btn").addEventListener("click", function () {
        let taskTextEl = li.querySelector(".task-text");
        let fullText = taskTextEl.innerText;
        
        let taskText = fullText.split(" (")[0]; // Ambil hanya teks tugas tanpa kategori
        let newText = prompt("Edit tugas:", taskText);

        if (newText) {
            taskTextEl.innerHTML = `${newText} <small>(${li.dataset.category})</small>`; // Gunakan kategori lama
            saveTask();
        }
    });

    // Hapus Tugas
    li.querySelector(".delete-btn").addEventListener("click", function () {
        if (confirm("Hapus tugas ini?")) {
            li.remove();
            saveTask();
            updateCounter();
        }
    });

    filterTasks();
}

// Filter Tugas
function filterTasks() {
    const filterValue = filterSelect.value;
    document.querySelectorAll(".task-item").forEach(li => {
        const category = li.dataset.category;
        if (filterValue === "all" || category === filterValue) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

// Update Counter
function updateCounter() {
    const totalTasks = document.querySelectorAll(".task-item").length;
    const completedTasks = document.querySelectorAll(".task-item.completed").length;
    const uncompletedTasks = totalTasks - completedTasks;
    completedCounter.innerText = completedTasks;
    uncompletedCounter.innerText = uncompletedTasks;
}

// Event Listener
filterSelect.addEventListener("change", filterTasks);
clearAllButton.addEventListener("click", () => {
    if (confirm("Hapus semua tugas?")) {
        listContainer.innerHTML = "";
        localStorage.removeItem("tasks");
        updateCounter();
    }
});

loadTask();