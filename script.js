const terminalBody = document.getElementById("terminal-body");
const mainNick = document.getElementById("main-nick");
const speed = 20; // czas wpisywania w ms

const output = {
    commands: [
        "Available commands:",
        "- commands",
        "- about",
        "- links",
        "- clear"
    ],
    about: [
        "bluvs's coding skills",
        "Python, HTML, CSS, Javascript, Typescript"
    ],
    links: [
        '<a href="https://youtube.com" target="_blank">YouTube</a>',
        '<a href="https://github.com" target="_blank">GitHub</a>'
    ]
};

// ======== Typing + Backspace effect for main nick ========
const nickname = "bluvs";
const typingDelay = 150;  // ms między literkami
const backspaceDelay = 100; // ms między literkami podczas backspace
const pauseAfterTyping = 1500; // ms pauza po wpisaniu

function typeNick() {
    mainNick.textContent = "";
    let i = 0;

    // Typing
    function typeLetter() {
        if (i < nickname.length) {
            mainNick.textContent += nickname[i];
            i++;
            setTimeout(typeLetter, typingDelay);
        } else {
            setTimeout(deleteLetter, pauseAfterTyping);
        }
    }

    // Backspace
    function deleteLetter() {
        if (i > 0) {
            mainNick.textContent = mainNick.textContent.slice(0, -1);
            i--;
            setTimeout(deleteLetter, backspaceDelay);
        } else {
            setTimeout(typeLetter, 500); // restart pętli
        }
    }

    typeLetter();
}

typeNick();

// ======== Terminal typing functions ========
function createLine(html = "") {
    const div = document.createElement("div");
    div.className = "line";
    div.innerHTML = html;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    return div;
}

function typeText(el, text, i = 0, done) {
    if (i < text.length) {
        el.innerHTML += text[i];
        setTimeout(() => typeText(el, text, i + 1, done), speed);
    } else if (done) done();
}

function typeLines(lines, i = 0, done) {
    if (i >= lines.length) {
        if (done) done();
        return;
    }
    if (lines[i].startsWith("<a")) {
        createLine(lines[i]);
        typeLines(lines, i + 1, done);
    } else {
        const line = createLine();
        typeText(line, lines[i], 0, () => typeLines(lines, i + 1, done));
    }
}

function createInput() {
    const wrapper = document.createElement("div");
    wrapper.className = "input-line";
    wrapper.innerHTML = `
        <span class="prompt">user</span>:<span class="path">~</span>$ 
        <input type="text" autocomplete="off">
    `;
    terminalBody.appendChild(wrapper);

    const input = wrapper.querySelector("input");
    input.focus();

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            const value = input.value.trim();
            wrapper.remove();

            createLine(
                `<span class="prompt">user</span>:<span class="path">~</span>$ ${value}`
            );

            handleCommand(value);
        }
    });
}

function handleCommand(cmd) {
    if (cmd === "clear") {
        terminalBody.innerHTML = "";
        startTerminal();
        return;
    }

    if (output[cmd]) {
        if (cmd === "links") {
            output[cmd].forEach(line => createLine(line));
            createInput();
        } else {
            typeLines(output[cmd], 0, createInput);
        }
    } else {
        typeLines(["command not found"], 0, createInput);
    }
}

function startTerminal() {
    typeLines(["Type 'commands' to see available commands."], 0, createInput);
}

startTerminal();
