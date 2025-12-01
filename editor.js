/* editor.js */

// Function to run the Python code in the editor
function runCode() {
    const codeArea = document.getElementById('code-editor');
    const outputArea = document.getElementById('code-output');
    outputArea.innerHTML = ''; // Clear previous output
    outputArea.style.color = 'var(--color-text)'; // Reset text color

    // This is a custom function to capture Brython's print output
    function custom_print(...args) {
        // Convert args to a string, handling multiple arguments
        // str() is Brython's standard string conversion, so we need to access it from the global window
        const output = args.map(arg => window.str(arg)).join(' '); 
        // Append output to the HTML div, adding a newline
        outputArea.innerHTML += output + '<br>';
    }

    // Get the code from the textarea
    const userCode = codeArea.value;

    try {
        // Run the code using Brython's built-in `run_script`
        brython({
            src: userCode,
            locals: {
                // Pass our custom_print function into the execution scope
                __builtins__: {
                    print: custom_print,
                    // Re-include other useful builtins for compatibility
                    len: window.len, 
                    str: window.str, 
                    int: window.int,
                    float: window.float,
                    range: window.range,
                    input: window.input // Keep standard input for interactive prompts
                }
            },
            debug: 0 // Set to 1 or 2 for more debug info
        });

    } catch (error) {
        // Display Python errors in the output area
        outputArea.style.color = 'var(--color-primary)';
        // Brython errors are usually wrapped in error.msg
        outputArea.innerHTML += '🚨 **ERROR:** ' + (error.msg || error) + '<br>';
    }
}

// Attach the runCode function to the button click (done in HTML)
// Initialize Brython on load (needed for all pages using it)
document.addEventListener('DOMContentLoaded', () => {
    // Only run brython setup if the element exists (e.g., on lesson.html and project pages)
    if (document.getElementById('brython-setup')) {
        brython();
    }
});