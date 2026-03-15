const uid = "tab123";
const htmlString = `
<script>
(function(){
    const ID = '${uid}';
    let tabs = [
        { id: 't1', label: 'Tab One' },
        { id: 't2', label: 'Tab Two' }
    ];
    let activeId = 't1';
    let nextId = 3;

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    
    function rNav() {
        // mock logic
    }
})();
<\/script>`;
const scriptCode = htmlString.replace(/<script>/, '').replace(/<\/script>/, '').replace(/\\<\/script>/, '');
try {
    eval(scriptCode);
    console.log("No syntax errors");
} catch(e) {
    console.error("Syntax Error", e);
}
