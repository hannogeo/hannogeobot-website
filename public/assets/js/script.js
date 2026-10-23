import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const extraCommands = document.getElementById('extra-commands');
  const mainGrid = document.getElementById('main-grid');
  const loader = document.getElementById('loader');

  const createCard = (cmd) => {
    const div = document.createElement('div');
    div.className = 'command-card';
    div.innerHTML = `
      <div class="cmd-header">
        <span class="cmd-name" ${cmd.aliases ? `data-aliases="${cmd.aliases}"` : ''}>${cmd.name}</span>
        ${cmd.args ? `<span class="cmd-args">${cmd.args}</span>` : ''}
      </div>
      <div class="cmd-desc">${cmd.description}</div>
    `;
    return div;
  };

  // Real-time listener for commands from Firebase
  const q = query(collection(db, "commands"), orderBy("order", "asc"));

  onSnapshot(q, (snapshot) => {
    mainGrid.innerHTML = '';
    extraCommands.innerHTML = '';

    snapshot.forEach((doc) => {
      const cmd = doc.data();
      const card = createCard(cmd);
      if (cmd.category === 'main') {
        mainGrid.appendChild(card);
      } else {
        extraCommands.appendChild(card);
      }
    });

    // Fade out loader once data arrives
    if (loader && !loader.classList.contains('fade-out')) {
      loader.classList.add('fade-out');
      setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
  });
});
