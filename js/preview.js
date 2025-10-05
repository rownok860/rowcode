
        // Load and render the saved code
        function renderPreview() {
            const previewContent = document.getElementById('preview-content');
            const savedCode = localStorage.getItem('rowCodeData');
            
            if (!savedCode) {
                previewContent.innerHTML = `
                    <div class="error-message">
                        <h3>No Code Found</h3>
                        <p>Please go back to the editor and save your code first.</p>
                        <a href="index.html" class="btn" style="margin-top: 15px; display: inline-block;">
                            <i class="fas fa-code"></i>
                            Open Editor
                        </a>
                    </div>
                `;
                return;
            }
            
            try {
                const codeData = JSON.parse(savedCode);
                
                // Create a sandboxed iframe for the preview
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.minHeight = 'calc(100vh - 70px)';
                iframe.style.border = 'none';
                
                previewContent.innerHTML = '';
                previewContent.appendChild(iframe);
                
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                iframeDoc.open();
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>RowCode Preview</title>
                        <style>${codeData.css || ''}</style>
                    </head>
                    <body>
                        ${codeData.html || '<div style="padding: 20px; text-align: center; color: #7f8c8d;"><h2>No HTML Content</h2><p>Add some HTML in the editor to see your preview here.</p></div>'}
                        <script>${codeData.js || ''}<\/script>
                    </body>
                    </html>
                `);
                iframeDoc.close();
                
            } catch (error) {
                previewContent.innerHTML = `
                    <div class="error-message">
                        <h3>Error Rendering Preview</h3>
                        <p>There was an error displaying your code. Please check for syntax errors.</p>
                        <p style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">${error.message}</p>
                    </div>
                `;
            }
        }
        
        // Render preview when page loads
        document.addEventListener('DOMContentLoaded', renderPreview);
        
        // Listen for storage changes (if code is updated in editor)
        window.addEventListener('storage', function(e) {
            if (e.key === 'rowCodeData') {
                renderPreview();
            }
        });
        
        // Add Font Awesome for icons
        const faScript = document.createElement('script');
        faScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
        document.head.appendChild(faScript);
