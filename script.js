document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const tasksCounter = document.getElementById("tasks-counter");
    const clearCompletedBtn = document.getElementById("clear-completed-btn");
    const clearAllBtn = document.getElementById("clear-all-btn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function updateCounter() {
        if (tasksCounter) {
            const activeTasksCount = tasks.filter(task => !task.completed).length;
            tasksCounter.textContent = '';
        }
    }

    function renderTasks() {
        if (!taskList) return;
        taskList.innerHTML = "";

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "active") return !task.completed;
            if (currentFilter === "completed") return task.completed;
            return true;
        });

        filteredTasks.forEach((task) => {
            const index = tasks.findIndex(t => t.id === task.id);

            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", () => {
                tasks[index].completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const text = document.createElement("span");
            text.textContent = task.title;
            text.style.flex = "1";
            text.style.margin = "0 10px";

            if (task.completed) {
                text.style.textDecoration = "line-through";
                text.style.color = "#64748b";
            }

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.style.background = "#dc2626";

            deleteButton.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            li.append(checkbox, text, deleteButton);
            taskList.appendChild(li);
        });

        updateCounter();
    }

    // تفعيل أزرار الفلترة
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                currentFilter = button.getAttribute("data-filter");
                renderTasks();
            });
        });
    }

    // تفعيل زر مسح المهام المكتملة
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener("click", () => {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
        });
    }

    // تفعيل زر مسح كل المهام
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", () => {
            if (tasks.length === 0) return;
            if (confirm("Are you sure you want to delete all tasks?")) {
                tasks = [];
                saveTasks();
                renderTasks();
            }
        });
    }

    // تفعيل نموذج إضافة مهمة جديدة
    if (taskForm) {
        taskForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const title = taskInput.value.trim();
            if (!title) return;

            tasks.push({
                id: crypto.randomUUID(),
                title: title,
                completed: false
            });

            saveTasks();
            renderTasks();
            taskInput.value = "";
            taskInput.focus();
        });
    }
    renderTasks();
});