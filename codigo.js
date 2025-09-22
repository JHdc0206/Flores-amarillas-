// ----------------- Preguntas -----------------
const questions = [
  {
    q: "¿Dónde es nuestra casa, donde se muere, donde se casa a las bandidas?",
    options: ["Bambu", "Icono", "Jora"],
    answer: "Bambu",
  },
  {
    q: "¿Cómo te saludaría si te encuentro?",
    options: [
      "Hola buenas tardes señorita",
      "hola mi real cachuda, con cuernos mas grandes que un alce, migajera como paloma",
      "Buenas tardes dama",
    ],
    answer: "hola mi real cachuda, con cuernos mas grandes que un alce, migajera como paloma",
  },
  {
    q: "¿Qué trago me gusta más?",
    options: ["Oldtime", "Passpord", "Blue Label de Johnnie Walker"],
    answer: "Passpord",
  },
  {
    q: "¿Qué me gusta más?",
    options: ["Las góticas nalgonas", "Las abulitas como la mis de Comu", "Las opresoras"],
    answer: "Las góticas nalgonas",
  },
  {
    q: "¿Qué día cumplo años?",
    options: ["06", "02", "24"],
    answer: "06",
  },
  {
    q: "¿Es un musculo del manguito rotador?",
    options: ["Supra espinoso", "Sartorio", "Musculo extensor del dedo gordo"],
    answer: "Supra espinoso",
  },
];

// ----------------- Estado -----------------
let current = 0;
const total = questions.length;

// ----------------- Elementos DOM -----------------
const startBtn = document.getElementById("startBtn");
const welcomeEl = document.getElementById("welcome");
const quizEl = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const progressBarEl = document.getElementById("progress-bar");
const progressCountEl = document.getElementById("progress-count");
const progressTotalEl = document.getElementById("progress-total");
const finalEl = document.getElementById("final");
const surpriseEl = document.getElementById("surpriseMessage");
const musicEl = document.getElementById("bgMusic");

// Inicializar contador total
progressTotalEl.textContent = total;

// ----------------- Listeners -----------------
startBtn.addEventListener("click", () => {
  welcomeEl.classList.add("hidden");
  quizEl.classList.remove("hidden");
  current = 0;
  showQuestion();
  updateProgress();
});

// ----------------- Funciones -----------------
function showQuestion() {
  const q = questions[current];
  questionEl.textContent = q.q;

  // Limpiar opciones
  optionsEl.innerHTML = "";

  // Crear botones de opciones
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(opt, btn));
    optionsEl.appendChild(btn);
  });

  // Reset feedback
  feedbackEl.textContent = "";
  feedbackEl.className = "";
}

function handleAnswer(selected, btn) {
  if (selected === questions[current].answer) {
    // Correcto
    feedbackEl.textContent = "✅ ¡Correcto!";
    feedbackEl.className = "feedback-correct";

    // Animar salida solo del contenido (pregunta + opciones)
    questionEl.classList.add("fade-out");
    optionsEl.classList.add("fade-out");

    setTimeout(() => {
      questionEl.classList.remove("fade-out");
      optionsEl.classList.remove("fade-out");

      current++;
      if (current < total) {
        showQuestion();
        updateProgress();

        // animar entrada
        questionEl.classList.add("fade-in");
        optionsEl.classList.add("fade-in");
        setTimeout(() => {
          questionEl.classList.remove("fade-in");
          optionsEl.classList.remove("fade-in");
        }, 560);

      } else {
        // final
        updateProgress(true);
        showFinal();
      }
    }, 520);

  } else {
    // Incorrecto
    feedbackEl.textContent = "❌ Sigue intentando como en tu relación.";
    feedbackEl.className = "feedback-wrong";
    // pequeño shake en el botón incorrecto
    btn.classList.add("shake");
    setTimeout(() => btn.classList.remove("shake"), 500);
  }
}

function updateProgress(final = false) {
  const progress = final ? 100 : Math.round((current / total) * 100);
  progressBarEl.style.width = progress + "%";
  // contador "X de Y" muestra current (si no final) como 1-based
  progressCountEl.textContent = final ? total : Math.min(current, total);
}

// ----------------- Final & lluvia -----------------
function showFinal() {
  quizEl.classList.add("hidden");
  finalEl.classList.remove("hidden");

  // intenta reproducir la música (si el navegador lo permite)
  try { musicEl.currentTime = 0; musicEl.play().catch(()=>{}); } catch(e){}

  // iniciar lluvia infinita de pétalos diagonales
  // creamos interval y guardamos referencia en window para que no quede duplicado si vuelve a iniciar
  if (!window._petalInterval) {
    window._petalInterval = setInterval(() => createPetal(), 300);
  }

  // mostrar el mensaje sorpresa un poco después
  setTimeout(() => {
    surpriseEl.classList.remove("hidden");
    surpriseEl.classList.add("show-surprise");
  }, 1400);
}

// crea una petala con drift horizontal (usando variable CSS --tx)
function createPetal() {
  const petal = document.createElement("div");
  petal.className = "flower";

  // símbolos: priorizamos amarillos y florcitas
  const symbols = ["🌼", "💛", "🌸", "🌻"];
  petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  // tamaño aleatorio
  const size = Math.floor(14 + Math.random() * 28);
  petal.style.fontSize = size + "px";

  // posición horizontal inicial
  const left = Math.random() * 110; // puede empezar un poco fuera de pantalla
  petal.style.left = left + "vw";

  // drift horizontal (tx) en vw -> queremos ~30 grados aprox: vertical 100vh ~ horizontal ~60vw gives tan = 60/100 -> ~31 deg
  // variamos dirección y magnitud
  const driftSign = Math.random() > 0.5 ? 1 : -1;
  const driftVw = (20 + Math.random() * 60) * driftSign; // -80vw .. -20vw or 20..80vw
  petal.style.setProperty("--tx", driftVw + "vw");

  // duración (más grande -> más lento)
  const duration = 4 + Math.random() * 6;
  petal.style.animationDuration = duration + "s";

  document.body.appendChild(petal);

  // limpiar tras terminar (duración * 1000 + margen)
  setTimeout(() => {
    petal.remove();
  }, (duration + 0.5) * 1000);
}
// 🌼 Fondo de pétalos continuo
function createBackgroundPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  
  // Varias formas de pétalos
  const shapes = ["🌼", "💛", "🌸"];
  petal.textContent = shapes[Math.floor(Math.random() * shapes.length)];

  // Posición inicial
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.fontSize = 14 + Math.random() * 20 + "px";
  petal.style.animationDuration = 6 + Math.random() * 6 + "s";

  document.getElementById("petalBackground").appendChild(petal);

  setTimeout(() => petal.remove(), 12000);
}

// Generar pétalos cada 500ms siempre
setInterval(createBackgroundPetal, 500);
