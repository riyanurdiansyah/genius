const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="drop-zone"></div></body></html>`, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

function emulateDrop() {
    const w = document.createElement('div');
    w.className = 'canvas-element';
    
    // Simulating componentTemplates['table-datatable']()
    const content = `
    <button id="btn" onclick="window.DT_test.sayHi()">Click Me</button>
    <script>
    window['DT_test'] = { sayHi: () => { window._testVar = "Hello from script!"; } };
    <\/script>
    `.replace(/\\<\/script>/g, '</script>');
    
    w.innerHTML = content;
    document.getElementById('drop-zone').appendChild(w);

    // Re-execute scripts
    w.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    // Test execution
    try {
        document.getElementById('btn').click();
        console.log("Result after click:", window._testVar);
    } catch(e) {
        console.error("Error during click:", e);
    }
}

emulateDrop();
