/* =========================================
   ТІЛАШАР — НЕГІЗГІ БАСҚАРУ ЖҮЙЕСІ
   script.js
========================================= */

"use strict";

/* ---------- 1. ТАПСЫРМАЛАР БӨЛІМДЕРІ ---------- */

const sections = {
    breathing: {
        title: "Тыныс алу жаттығулары",
        icon: "🌬️",
        tasks: [
            "Тыныс алуды бақылау",
            "Мұрынмен тыныс алу",
            "Бірқалыпты дем шығару",
            "Демді ұзарту",
            "Тыныс пен қозғалысты үйлестіру"
        ]
    },

    articulation: {
        title: "Артикуляциялық жаттығулар",
        icon: "👄",
        tasks: [
            "Түтікше",
            "Сағат",
            "Тіс тазалау",
            "Тәтті тосап",
            "Әткеншек",
            "Футбол"
        ]
    },

    vocabulary: {
        title: "Сөздік қорды дамыту",
        icon: "📚",
        tasks: [
            "Заттарды ата",
            "Суреттерді сәйкестендір",
            "Заттардың қызметін анықта",
            "Қарама-қарсы сөздер",
            "Тақырыптық сөздер",
            "Сөйлемді толықтыр"
        ]
    },

    understanding: {
        title: "Сөйлеуді түсіну",
        icon: "🧠",
        tasks: [
            "Қарапайым нұсқаулар",
            "Суретті көрсет",
            "Сөз бен суретті сәйкестендір",
            "Иә немесе жоқ",
            "Күнделікті әрекеттер",
            "Кеңістікті түсіну",
            "Сұрақтарға жауап бер",
            "Екі кезеңді нұсқау"
        ]
    },

    speech: {
        title: "Сөйлеуді қалыптастыру",
        icon: "💬",
        tasks: [
            "Буындарды қайталау",
            "Сөздерді қайталау",
            "Сөз тіркестерін құрау",
            "Қарапайым сөйлемдер",
            "Сурет бойынша сөйлеу",
            "Сұраққа жауап беру",
            "Қысқа әңгіме",
            "Диалог құрастыру"
        ]
    },

    reading: {
        title: "Оқу және жазу",
        icon: "✍️",
        tasks: [
            "Әріптерді тану",
            "Әріп пен дыбысты сәйкестендіру",
            "Буындарды оқу",
            "Сөздерді оқу",
            "Сөзді құрастыру",
            "Жоғалған әріпті тап",
            "Сөйлемді оқу",
            "Сөйлемді толықтыр",
            "Сөздерді жазу",
            "Қысқа мәтінді оқу",
            "Мәтін бойынша сұрақтар",
            "Сөйлемді көшіріп жазу"
        ]
    },

    logorhythmics: {
        title: "Логоритмика",
        icon: "🎵",
        tasks: [
            "Қимыл мен сөз",
            "Ырғақты қайталау",
            "Музыкамен қозғалу",
            "Қимылды үйлестіру"
        ]
    }
};


/* ---------- 2. ДЕРЕКТЕРДІ САҚТАУ ---------- */

const STORAGE_KEY = "tilashar_data";

let appData = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "{}"
);

appData.completed ||= {};
appData.scores ||= {};
appData.bonuses ||= {};
appData.unlocked ||= {};
appData.speechCard ||= {};


function saveData() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appData)
    );
}


/* ---------- 3. БЕТТЕР АРАСЫНДА ӨТУ ---------- */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
        window.scrollTo(0, 0);
    }
}


/* ---------- 4. НЕГІЗГІ МӘЗІР ---------- */

function openSection(sectionId) {
    const section = sections[sectionId];

    if (!section) return;

    const title = document.getElementById("sectionTitle");
    const list = document.getElementById("tasksList");

    if (!title || !list) return;

    title.textContent = section.title;
    list.innerHTML = "";

    section.tasks.forEach((task, index) => {
        const taskId = `${sectionId}_${index + 1}`;

        const completed = !!appData.completed[taskId];

        const card = document.createElement("button");

        card.className = "task-card";
        card.innerHTML = `
            <span class="task-number">${index + 1}</span>
            <span class="task-name">${task}</span>
            <span class="task-status">
                ${completed ? "✓" : "→"}
            </span>
        `;

        card.addEventListener("click", () => {
            openExercise(sectionId, index);
        });

        list.appendChild(card);
    });

    showPage("tasksPage");
}


/* ---------- 5. ТАПСЫРМАНЫ АШУ ---------- */

let currentSection = null;
let currentTaskIndex = null;

function openExercise(sectionId, index) {
    currentSection = sectionId;
    currentTaskIndex = index;

    const section = sections[sectionId];
    const taskName = section.tasks[index];

    document.getElementById("exerciseTitle").textContent =
        taskName;

    document.getElementById("exerciseSubtitle").textContent =
        section.title;

    document.getElementById("exerciseFeedback").textContent = "";

    document.getElementById("exerciseResult").textContent = "";

    showPage("exercisePage");

    /*
      Жеке тапсырмалардың кодтары келесі файлдарда
      қосылады. Әр тапсырманың өзіндік мазмұны,
      мақсаты, нұсқаулығы және бағалау жүйесі болады.
    */

    if (typeof loadIndividualExercise === "function") {
        loadIndividualExercise(sectionId, index);
    }
}


/* ---------- 6. ТАПСЫРМАНЫ АЯҚТАУ ---------- */

function completeExercise() {
    if (!currentSection || currentTaskIndex === null) return;

    const taskId = `${currentSection}_${currentTaskIndex + 1}`;

    const alreadyCompleted = !!appData.completed[taskId];

    const scoreInput = document.getElementById("taskScore");

    const score = scoreInput
        ? Math.max(0, Math.min(100, Number(scoreInput.value) || 0))
        : 0;

    appData.scores[taskId] = score;

    if (!alreadyCompleted) {
        appData.completed[taskId] = true;
        appData.bonuses[taskId] = 10;
    }

    saveData();

    const result = document.getElementById("exerciseResult");

    if (result) {
        result.textContent = alreadyCompleted
            ? "Нәтиже жаңартылды!"
            : "Тапсырма орындалды! +10 бонус";
    }

    updateResults();
    updateRewards();
}


/* ---------- 7. НӘТИЖЕЛЕР ---------- */

function getAllTaskIds() {
    const ids = [];

    Object.entries(sections).forEach(([sectionId, section]) => {
        section.tasks.forEach((_, index) => {
            ids.push(`${sectionId}_${index + 1}`);
        });
    });

    return ids;
}


function updateResults() {
    const allTasks = getAllTaskIds();

    const completed = allTasks.filter(
        id => appData.completed[id]
    );

    const totalBonus = Object.values(appData.bonuses)
        .reduce((sum, value) => sum + Number(value || 0), 0);

    const totalScore = Object.values(appData.scores)
        .reduce((sum, value) => sum + Number(value || 0), 0);

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText("completedCount", completed.length);
    setText("uncompletedCount", allTasks.length - completed.length);
    setText("totalBonus", totalBonus);
    setText("totalScore", totalScore);

    const statistics = document.getElementById("sectionStatistics");

    if (statistics) {
        statistics.innerHTML = "";

        Object.entries(sections).forEach(([id, section]) => {
            const done = section.tasks.filter(
                (_, index) => appData.completed[`${id}_${index + 1}`]
            ).length;

            const row = document.createElement("div");

            row.className = "statistics-row";

            row.innerHTML = `
                <span>${section.title}</span>
                <strong>${done}/${section.tasks.length}</strong>
            `;

            statistics.appendChild(row);
        });
    }

    const bonusScale = document.getElementById("bonusScale");

    if (bonusScale) {
        bonusScale.textContent = `${totalBonus} бонус`;
    }
}


/* ---------- 8. СЫЙЛЫҚТАР ---------- */

const rewards = [
    { id: "puzzle", title: "Пазл", bonus: 100, icon: "🧩" },
    { id: "color", title: "Түстер ойыны", bonus: 150, icon: "🎨" },
    { id: "difference", title: "Айырмашылықты тап", bonus: 200, icon: "🔍" },
    { id: "memory", title: "Есте сақтау ойыны", bonus: 250, icon: "🧠" },
    { id: "objects", title: "Жасырын заттар", bonus: 300, icon: "🎁" },
    { id: "balloons", title: "Шарларды жар", bonus: 350, icon: "🎈" }
];


function getTotalBonus() {
    return Object.values(appData.bonuses)
        .reduce((sum, value) => sum + Number(value || 0), 0);
}


function updateRewards() {
    const container = document.getElementById("rewardsContainer");

    if (!container) return;

    const total = getTotalBonus();

    const bonusDisplay = document.getElementById("rewardsBonus");

    if (bonusDisplay) {
        bonusDisplay.textContent = total;
    }

    container.innerHTML = "";

    rewards.forEach(reward => {
        const unlocked = total >= reward.bonus;

        const card = document.createElement("div");

        card.className = "reward-card";

        card.innerHTML = `
            <div class="reward-icon">${reward.icon}</div>
            <h3>${reward.title}</h3>
            <p>${reward.bonus} бонус қажет</p>
            <button ${unlocked ? "" : "disabled"}>
                ${unlocked ? "Ойынды бастау" : "🔒 Құлыптаулы"}
            </button>
        `;

        if (unlocked) {
            card.querySelector("button").addEventListener("click", () => {
                openRewardGame(reward.id);
            });
        }

        container.appendChild(card);
    });
}


/* ---------- 9. СЫЙЛЫҚ ОЙЫНЫ ---------- */

function openRewardGame(gameId) {
    const container = document.getElementById("rewardGameContainer");

    if (!container) return;

    container.innerHTML = "";

    const title = document.createElement("h2");

    const gameNames = {
        puzzle: "Пазл",
        color: "Түстер ойыны",
        difference: "Айырмашылықты тап",
        memory: "Есте сақтау ойыны",
        objects: "Жасырын заттар",
        balloons: "Шарларды жар"
    };

    title.textContent = gameNames[gameId] || "Сыйлық ойыны";

    container.appendChild(title);

    const message = document.createElement("p");

    message.textContent =
        "Бұл ойынның жеке интерактивті коды келесі кезеңде енгізіледі.";

    container.appendChild(message);
}


/* ---------- 10. КАМЕРА ---------- */

let cameraStream = null;

async function startCamera() {
    const preview = document.getElementById("cameraPreview");

    if (!navigator.mediaDevices?.getUserMedia) {
        alert("Бұл браузер камераны қолдамайды.");
        return;
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        preview.srcObject = cameraStream;
        await preview.play();

    } catch (error) {
        alert("Камераға рұқсат берілмеді немесе камера қолжетімсіз.");
    }
}


function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    const preview = document.getElementById("cameraPreview");

    if (preview) preview.srcObject = null;
}


/* ---------- 11. МИКРОФОН ---------- */

let microphoneStream = null;
let mediaRecorder = null;
let audioChunks = [];

async function startMicrophone() {
    try {
        microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        if (!window.MediaRecorder) {
            alert("Бұл браузерде дыбыс жазу қолжетімсіз.");
            return;
        }

        audioChunks = [];

        mediaRecorder = new MediaRecorder(microphoneStream);

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, {
                type: "audio/webm"
            });

            const audioURL = URL.createObjectURL(audioBlob);

            const audio = document.createElement("audio");

            audio.controls = true;
            audio.src = audioURL;

            const status = document.getElementById("micStatus");

            if (status) {
                status.innerHTML = "";
                status.appendChild(audio);
            }
        };

        mediaRecorder.start();

        const status = document.getElementById("micStatus");

        if (status) status.textContent = "Дыбыс жазылып жатыр...";

    } catch (error) {
        alert("Микрофонға рұқсат берілмеді.");
    }
}


function stopMicrophone() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }

    if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
        microphoneStream = null;
    }
}


/* ---------- 12. ВИДЕО ЖҮКТЕУ ---------- */

const videoUpload = document.getElementById("videoUpload");

if (videoUpload) {
    videoUpload.addEventListener("change", event => {
        const file = event.target.files[0];

        if (!file) return;

        const video = document.getElementById("exerciseVideo");

        if (video) {
            if (video.dataset.objectUrl) {
                URL.revokeObjectURL(video.dataset.objectUrl);
            }

            const url = URL.createObjectURL(file);

            video.dataset.objectUrl = url;
            video.src = url;
            video.controls = true;
            video.load();
        }
    });
}


/* ---------- 13. ТАПСЫРМАДАН ШЫҒУ ---------- */

function leaveExercise() {
    stopCamera();
    stopMicrophone();

    showPage("tasksPage");

    if (currentSection) {
        openSection(currentSection);
    }
}


/* ---------- 14. ЛОГОПЕДИЯЛЫҚ КАБИНЕТ ---------- */

function openCabinet() {
    showPage("cabinetPage");

    renderSpeechCard();
    renderDynamics();
}


function renderSpeechCard() {
    const container = document.getElementById("speechCardContainer");

    if (!container) return;

    const fields = [
        ["fullName", "Аты-жөні"],
        ["age", "Жасы"],
        ["diagnosis", "Қорытынды / диагноз"],
        ["date", "Сабақ күні"],
        ["communication", "Қарым-қатынас ерекшелігі"],
        ["observations", "Бақылау"],
        ["conclusion", "Логопед қорытындысы"]
    ];

    container.innerHTML = "";

    fields.forEach(([key, label]) => {
        const wrapper = document.createElement("label");

        wrapper.className = "speech-field";

        const title = document.createElement("span");
        title.textContent = label;

        const input = document.createElement(
            key === "observations" || key === "conclusion"
                ? "textarea"
                : "input"
        );

        input.value = appData.speechCard[key] || "";

        input.addEventListener("change", () => {
            appData.speechCard[key] = input.value;
            saveData();
        });

        wrapper.append(title, input);
        container.appendChild(wrapper);
    });
}


function renderDynamics() {
    const container = document.getElementById("dynamicsContainer");

    if (!container) return;

    const completed = Object.keys(appData.completed).length;

    container.textContent =
        `Орындалған тапсырмалар саны: ${completed}`;
}


/* ---------- 15. БАРЛЫҚ ФУНКЦИЯЛАРДЫ ҚОЛЖЕТІМДІ ЕТУ ---------- */

window.showPage = showPage;
window.openSection = openSection;
window.openExercise = openExercise;
window.completeExercise = completeExercise;
window.leaveExercise = leaveExercise;
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.startMicrophone = startMicrophone;
window.stopMicrophone = stopMicrophone;
window.openCabinet = openCabinet;
window.updateResults = updateResults;
window.updateRewards = updateRewards;
window.openRewardGame = openRewardGame;


/* ---------- 16. БАСТАПҚЫ ІСКЕ ҚОСУ ---------- */

document.addEventListener("DOMContentLoaded", () => {
    updateResults();
    updateRewards();
});
