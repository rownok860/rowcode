
        // DOM Elements
        const htmlEditor = document.getElementById('html-editor');
        const cssEditor = document.getElementById('css-editor');
        const jsEditor = document.getElementById('js-editor');
        const tabs = document.querySelectorAll('.tab');
        const saveBtn = document.getElementById('save-btn');
        const runBtn = document.getElementById('run-btn');
        const clearBtn = document.getElementById('clear-btn');
        const formatBtn = document.getElementById('format-btn');
        const toast = document.getElementById('toast');
        const currentFile = document.getElementById('current-file');
        const floatingBtnContainer = document.getElementById('floating-btn-container');
        const closeFloatingBtn = document.getElementById('close-floating-btn');

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all editors
                document.querySelectorAll('.editor-wrapper textarea').forEach(editor => {
                    editor.style.display = 'none';
                });
                
                // Show the selected editor
                const tabType = tab.getAttribute('data-tab');
                document.getElementById(`${tabType}-editor`).style.display = 'block';
                currentFile.textContent = `${tabType === 'html' ? 'index' : tabType}.${tabType}`;
            });
        });

        // Save code to localStorage
        function saveCode() {
            const codeData = {
                html: htmlEditor.value,
                css: cssEditor.value,
                js: jsEditor.value,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('rowCodeData', JSON.stringify(codeData));
            
            // Show toast notification
            showToast('Code saved successfully!');
        }

        // Run code - redirect to preview page
        function runCode() {
            // Save code first
            saveCode();
            
            // Open preview in new tab
            window.open('preview.html', '_blank');
            
            showToast('Opening preview...');
        }

        // Clear all editors
        function clearCode() {
            if (confirm('Are you sure you want to clear all code?')) {
                htmlEditor.value = '';
                cssEditor.value = '';
                jsEditor.value = '';
                showToast('All editors cleared');
            }
        }

        // Format code
        function formatCode() {
            const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
            const editor = document.getElementById(`${activeTab}-editor`);
            
            let formattedCode = editor.value;
            
            if (activeTab === 'html') {
                formattedCode = formattedCode
                    .replace(/\s+/g, ' ')
                    .replace(/>\s+</g, '>\n<')
                    .replace(/\s*>\s*/g, '>\n');
            } else if (activeTab === 'css') {
                formattedCode = formattedCode
                    .replace(/\s*{\s*/g, ' {\n  ')
                    .replace(/\s*;\s*/g, ';\n  ')
                    .replace(/\s*}\s*/g, '\n}\n\n');
            } else if (activeTab === 'js') {
                formattedCode = formattedCode
                    .replace(/\s*{\s*/g, ' {\n  ')
                    .replace(/\s*}\s*/g, '\n}\n')
                    .replace(/\s*;\s*/g, ';\n  ');
            }
            
            editor.value = formattedCode;
            showToast('Code formatted');
        }

        // Show toast notification
        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }

        // Load saved code
        function loadCode() {
            const savedCode = localStorage.getItem('rowCodeData');
            if (savedCode) {
                const codeData = JSON.parse(savedCode);
                htmlEditor.value = codeData.html || htmlEditor.value;
                cssEditor.value = codeData.css || cssEditor.value;
                jsEditor.value = codeData.js || jsEditor.value;
            }
        }

        // Event listeners
        saveBtn.addEventListener('click', saveCode);
        runBtn.addEventListener('click', runCode);
        clearBtn.addEventListener('click', clearCode);
        formatBtn.addEventListener('click', formatCode);
        closeFloatingBtn.addEventListener('click', () => {
            floatingBtnContainer.style.display = 'none';
        });

        // Auto-save on input with debounce
        let timeout;
        [htmlEditor, cssEditor, jsEditor].forEach(editor => {
            editor.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(saveCode, 1500);
            });
        });

        // Load saved code on startup
        loadCode();

        // PWA Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        // Handle app installation
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install prompt (you can customize this)
            setTimeout(() => {
                if (deferredPrompt && confirm('Install RowCode for a better experience?')) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        deferredPrompt = null;
                    });
                }
            }, 3000);
        });
