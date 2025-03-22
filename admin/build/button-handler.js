/**
 * קובץ זה מטפל בכל הלחצנים בממשק ניהול הצ'אטבוט
 * כל הפונקציות והמאזינים מוגדרים כאן
 */

// הוספת הפונקציות לחלון הגלובלי
window.editFAQ = editFAQ;
window.updateFAQ = updateFAQ;
window.closeEditForm = closeEditForm;
window.deleteFAQ = deleteFAQ;
window.handleLogoFile = handleLogoFile;
window.uploadLogo = uploadLogo;
window.updatePreviewColors = updatePreviewColors;
window.updateProjectColors = updateProjectColors;

// טעינת הקובץ כאשר ה-DOM טעון במלואו
document.addEventListener('DOMContentLoaded', function() {
    // הוספת לוגיקת האתחול לחלון הגלובלי
    window.projectData = null;
    window.apiKey = null;
    
    initializeButtons();
    initializeMenuLinks();
    initializeFAQHandlers();
    initializeAppearance();
    initializeSettings();
    getProjectData();
});

// פונקציה לאתחול כל הלחצנים בממשק
function initializeButtons() {
    // פעולות מהירות בדף הבית
    const quickActionButtons = document.querySelectorAll('.quick-actions button');
    if (quickActionButtons) {
        quickActionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                if (buttonText.includes('הוסף שאלה')) {
                    navigateToTab('faq');
                    document.getElementById('faq-question').focus();
                } else if (buttonText.includes('הגדרות בוט')) {
                    navigateToTab('settings');
                } else if (buttonText.includes('קבל קוד להטמעה')) {
                    navigateToTab('settings');
                    document.getElementById('widget-code').select();
                }
            });
        });
    }

    // כפתור העתקת קוד ההטמעה
    const copyCodeButton = document.querySelector('#settings button');
    if (copyCodeButton) {
        copyCodeButton.addEventListener('click', function() {
            const widgetCode = document.getElementById('widget-code');
            widgetCode.select();
            document.execCommand('copy');
            alert('הקוד הועתק ללוח');
        });
    }

    // כפתורי שמירת הגדרות
    const saveSettingsButton = document.querySelector('#settings button');
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function() {
            saveSettings();
        });
    }
}

// פונקציה לאתחול ניווט התפריט
function initializeMenuLinks() {
    const menuLinks = document.querySelectorAll('.menu-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            if (!tabId) return;

            menuLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            link.classList.add('active');
            const tabElement = document.getElementById(tabId);
            if (tabElement) {
                tabElement.classList.add('active');
                if (tabId === 'appearance') {
                    loadAppearanceSettings();
                } else if (tabId === 'faq') {
                    loadFAQs();
                }
            }
        });
    });
}

// פונקציה לניווט לטאב מסוים
function navigateToTab(tabId) {
    const tabLink = document.querySelector(`.menu-link[data-tab="${tabId}"]`);
    if (tabLink) {
        tabLink.click();
    }
}

// פונקציות לטיפול בשאלות נפוצות
function initializeFAQHandlers() {
    // הוספת שאלה חדשה
    const addFaqButton = document.getElementById('add-faq-btn');
    if (addFaqButton) {
        addFaqButton.addEventListener('click', addFAQ);
    }

    // חיפוש וסינון שאלות
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
        faqSearch.addEventListener('input', loadFAQs);
    }

    const faqFilter = document.getElementById('faq-filter');
    if (faqFilter) {
        faqFilter.addEventListener('change', loadFAQs);
    }
}

// פונקציה להוספת שאלה נפוצה
function addFAQ() {
    const question = document.getElementById('faq-question')?.value;
    const answer = document.getElementById('faq-answer')?.value;
    const category = document.getElementById('faq-category')?.value;
    const keywords = document.getElementById('faq-keywords')?.value.split(',').map(k => k.trim());

    if (!question || !answer) {
        alert('נא למלא את השאלה והתשובה');
        return;
    }

    try {
        // שמירת השאלה במערך המקומי
        const newFaq = {
            _id: Date.now().toString(),
            question,
            answer,
            category: category || 'general',
            keywords,
            language: 'he'
        };

        // טעינת השאלות הקיימות מהאחסון המקומי
        let faqs = JSON.parse(localStorage.getItem('chatbot_faqs') || '[]');
        faqs.push(newFaq);
        localStorage.setItem('chatbot_faqs', JSON.stringify(faqs));

        // ניקוי הטופס
        document.getElementById('faq-question').value = '';
        document.getElementById('faq-answer').value = '';
        document.getElementById('faq-category').value = '';
        document.getElementById('faq-keywords').value = '';

        // טעינה מחדש של השאלות
        loadFAQs();
        updateEmbedCode();
        alert('השאלה נוספה בהצלחה');

    } catch (error) {
        console.error("Error adding FAQ:", error);
        alert('שגיאה בהוספת השאלה');
    }
}

// פונקציה לעריכת שאלה קיימת
function editFAQ(faqId) {
    try {
        // טעינת השאלות מהאחסון המקומי
        const faqs = JSON.parse(localStorage.getItem('chatbot_faqs') || '[]');
        const faq = faqs.find(f => f._id === faqId);

        if (!faq) {
            throw new Error('השאלה לא נמצאה');
        }

        // יצירת טופס עריכה
        const editForm = document.createElement('div');
        editForm.className = 'edit-form-container';
        editForm.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
        
        editForm.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; width: 500px; max-width: 90%;">
                <h2 style="text-align: right;">עריכת שאלה</h2>
                <div class="form-group">
                    <label for="edit-question">שאלה</label>
                    <input type="text" id="edit-question" value="${faq.question}">
                </div>
                <div class="form-group">
                    <label for="edit-answer">תשובה</label>
                    <textarea id="edit-answer" rows="4">${faq.answer}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-category">קטגוריה</label>
                    <select id="edit-category">
                        <option value="general" ${faq.category === 'general' ? 'selected' : ''}>כללי</option>
                        <option value="products" ${faq.category === 'products' ? 'selected' : ''}>מוצרים</option>
                        <option value="shipping" ${faq.category === 'shipping' ? 'selected' : ''}>משלוחים</option>
                        <option value="returns" ${faq.category === 'returns' ? 'selected' : ''}>החזרות</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-keywords">מילות מפתח</label>
                    <input type="text" id="edit-keywords" value="${faq.keywords?.join(', ') || ''}">
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button onclick="closeEditForm()">ביטול</button>
                    <button class="success" onclick="updateFAQ('${faqId}')">שמור שינויים</button>
                </div>
            </div>
        `;

        document.body.appendChild(editForm);

    } catch (error) {
        console.error("Error loading FAQ details:", error);
        alert('שגיאה בטעינת פרטי השאלה');
    }
}

// פונקציה לסגירת טופס העריכה
function closeEditForm() {
    document.querySelector('.edit-form-container')?.remove();
}

// פונקציה לעדכון שאלה לאחר עריכה
function updateFAQ(faqId) {
    try {
        const question = document.getElementById('edit-question')?.value;
        const answer = document.getElementById('edit-answer')?.value;
        const category = document.getElementById('edit-category')?.value;
        const keywords = document.getElementById('edit-keywords')?.value.split(',').map(k => k.trim());

        if (!question || !answer) {
            alert('נא למלא את השאלה והתשובה');
            return;
        }

        // עדכון השאלה באחסון המקומי
        let faqs = JSON.parse(localStorage.getItem('chatbot_faqs') || '[]');
        const faqIndex = faqs.findIndex(f => f._id === faqId);
        
        if (faqIndex === -1) {
            throw new Error('השאלה לא נמצאה');
        }

        faqs[faqIndex] = {
            ...faqs[faqIndex],
            question,
            answer,
            category,
            keywords
        };

        localStorage.setItem('chatbot_faqs', JSON.stringify(faqs));
        closeEditForm();
        loadFAQs();
        updateEmbedCode();
        alert('השאלה עודכנה בהצלחה');

    } catch (error) {
        console.error("Error updating FAQ:", error);
        alert('שגיאה בעדכון השאלה');
    }
}

// פונקציה למחיקת שאלה
function deleteFAQ(faqId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק שאלה זו?')) {
        return;
    }

    try {
        // מחיקת השאלה מהאחסון המקומי
        let faqs = JSON.parse(localStorage.getItem('chatbot_faqs') || '[]');
        faqs = faqs.filter(f => f._id !== faqId);
        localStorage.setItem('chatbot_faqs', JSON.stringify(faqs));

        loadFAQs();
        updateEmbedCode();
        alert('השאלה נמחקה בהצלחה');

    } catch (error) {
        console.error("Error deleting FAQ:", error);
        alert('שגיאה במחיקת השאלה');
    }
}

// פונקציה לטעינת השאלות הקיימות
function loadFAQs() {
    try {
        // טעינת השאלות מהאחסון המקומי
        let faqs = JSON.parse(localStorage.getItem('chatbot_faqs') || '[]');
        const searchQuery = document.getElementById('faq-search')?.value || '';
        const categoryFilter = document.getElementById('faq-filter')?.value || '';

        // סינון לפי חיפוש
        if (searchQuery) {
            faqs = faqs.filter(faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // סינון לפי קטגוריה
        if (categoryFilter) {
            faqs = faqs.filter(faq => faq.category === categoryFilter);
        }

        const faqContainer = document.getElementById('faq-list');
        if (!faqContainer) return;

        // הצגת השאלות
        faqContainer.innerHTML = '';
        if (faqs.length > 0) {
            faqs.forEach(faq => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.innerHTML = `
                    <h3>${faq.question}</h3>
                    <p>${faq.answer}</p>
                    <div class="faq-actions">
                        <button onclick="editFAQ('${faq._id}')">ערוך</button>
                        <button class="danger" onclick="deleteFAQ('${faq._id}')">מחק</button>
                    </div>
                `;
                faqContainer.appendChild(faqItem);
            });
        } else {
            faqContainer.innerHTML = '<p style="text-align: center; padding: 20px;">לא נמצאו שאלות נפוצות</p>';
        }

    } catch (error) {
        console.error("Error loading FAQs:", error);
        alert('שגיאה בטעינת השאלות');
    }
}

// פונקציות לטיפול בעיצוב
function initializeAppearance() {
    const logoUpload = document.getElementById('logo-upload');
    const logoFile = document.getElementById('logo-file');
    const uploadBtn = document.getElementById('upload-logo-btn');
    const colorPreviews = document.querySelectorAll('.color-preview');
    const customColor = document.getElementById('custom-color');
    const applyColorBtn = document.getElementById('apply-color-btn');

    if (logoUpload && logoFile) {
        // Logo upload functionality
        logoUpload.addEventListener('click', () => logoFile.click());
        
        logoUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            logoUpload.style.borderColor = '#3498db';
        });
        
        logoUpload.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            logoUpload.style.borderColor = '#ddd';
        });
        
        logoUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            logoUpload.style.borderColor = '#ddd';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleLogoFile(file);
            }
        });

        logoFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleLogoFile(file);
            }
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            const file = logoFile.files[0];
            if (!file) {
                alert('נא לבחור תמונה תחילה');
                return;
            }
            await uploadLogo(file);
        });
    }

    // Color picker functionality
    if (colorPreviews) {
        colorPreviews.forEach(preview => {
            preview.addEventListener('click', () => {
                const color = preview.getAttribute('data-color');
                if (customColor) customColor.value = color;
                updatePreviewColors(color);
            });
        });
    }

    if (customColor) {
        customColor.addEventListener('input', (e) => {
            updatePreviewColors(e.target.value);
        });
    }

    if (applyColorBtn) {
        applyColorBtn.addEventListener('click', async () => {
            if (customColor) {
                await updateProjectColors(customColor.value);
            }
        });
    }
}

// פונקציה לטיפול בקובץ לוגו שהועלה
function handleLogoFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('נא להעלות קובץ תמונה בלבד');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const logoPreview = document.getElementById('logo-preview');
        const previewLogo = document.getElementById('preview-logo');
        
        logoPreview.src = e.target.result;
        logoPreview.style.display = 'block';
        
        previewLogo.src = e.target.result;
        previewLogo.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// פונקציה להעלאת הלוגו לשרת
async function uploadLogo(file) {
    if (!window.projectData?._id) {
        alert('אנא המתן לטעינת הנתונים');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('logo', file);
        formData.append('projectId', window.projectData._id);

        const baseUrl = window.location.origin;
        const apiUrl = baseUrl.replace('http:', 'https:');
        
        const response = await fetch(`${apiUrl}/api/projects/upload-logo`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('שגיאה בהעלאת הלוגו');
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'שגיאה בהעלאת הלוגו');
        }

        alert('הלוגו הועלה בהצלחה');
        
    } catch (error) {
        console.error("Error uploading logo:", error);
        alert(error.message || 'שגיאה בהעלאת הלוגו');
    }
}

// פונקציה לעדכון צבעים בתצוגה מקדימה
function updatePreviewColors(color) {
    const previewHeader = document.getElementById('preview-header');
    const previewUserMessage = document.getElementById('preview-user-message');
    const previewSendBtn = document.getElementById('preview-send-btn');
    
    if (previewHeader) previewHeader.style.backgroundColor = color;
    if (previewUserMessage) previewUserMessage.style.backgroundColor = color;
    if (previewSendBtn) previewSendBtn.style.backgroundColor = color;
}

// פונקציה לעדכון צבעי הפרויקט
async function updateProjectColors(color) {
    if (!window.projectData?._id) {
        alert('אנא המתן לטעינת הנתונים');
        return;
    }

    try {
        const baseUrl = window.location.origin;
        const apiUrl = baseUrl.replace('http:', 'https:');
        
        const response = await fetch(`${apiUrl}/api/projects/${window.projectData._id}/appearance`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                primaryColor: color
            })
        });

        if (!response.ok) {
            throw new Error('שגיאה בעדכון הצבעים');
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'שגיאה בעדכון הצבעים');
        }

        alert('הצבעים עודכנו בהצלחה');
        
    } catch (error) {
        console.error("Error updating colors:", error);
        alert(error.message || 'שגיאה בעדכון הצבעים');
    }
}

// פונקציה לטעינת נתוני הפרויקט
async function getProjectData() {
    try {
        const savedApiKey = localStorage.getItem('chatbot_api_key');
        if (!savedApiKey) {
            showLoginForm();
            return;
        }

        const baseUrl = window.location.origin;
        const apiUrl = baseUrl.replace('http:', 'https:');
        
        window.apiKey = savedApiKey;
        const response = await fetch(`${apiUrl}/api/projects/api-key/${savedApiKey}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'שגיאה בטעינת נתוני הפרויקט');
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'שגיאה בטעינת נתוני הפרויקט');
        }

        window.projectData = result.data;
        
        // עדכון קוד ההטמעה
        const widgetCodeElem = document.getElementById('widget-code');
        if (widgetCodeElem) {
            const widgetUrl = `${apiUrl}/chatbot.js`;
            widgetCodeElem.value = `<script src="${widgetUrl}?key=${savedApiKey}"><\/script>`;
        }

        // טעינת נתונים ראשונית
        loadFAQs();
        loadAppearanceSettings();

    } catch (error) {
        console.error("Error:", error);
        localStorage.removeItem('chatbot_api_key');
        alert(error.message || "שגיאה בטעינת נתוני הפרויקט");
        showLoginForm();
    }
}

// פונקציה לטעינת הגדרות עיצוב
function loadAppearanceSettings() {
    if (!window.projectData) return;

    try {
        // Load logo if exists
        if (window.projectData.logo) {
            const logoPreview = document.getElementById('logo-preview');
            const previewLogo = document.getElementById('preview-logo');
            
            if (logoPreview) {
                logoPreview.src = window.projectData.logo;
                logoPreview.style.display = 'block';
            }
            
            if (previewLogo) {
                previewLogo.src = window.projectData.logo;
                previewLogo.style.display = 'block';
            }
        }

        // Load colors
        if (window.projectData.primaryColor) {
            const customColor = document.getElementById('custom-color');
            if (customColor) {
                customColor.value = window.projectData.primaryColor;
                updatePreviewColors(window.projectData.primaryColor);
            }
        }
        
    } catch (error) {
        console.error("Error loading appearance settings:", error);
    }
}

// פונקציות להגדרות
function initializeSettings() {
    const botName = document.getElementById('bot-name');
    const welcomeMessage = document.getElementById('welcome-message');
    const fallbackMessage = document.getElementById('fallback-message');
    const autoShow = document.getElementById('auto-show');
    const saveHistory = document.getElementById('save-history');
    
    // טעינת הגדרות קיימות
    const settings = JSON.parse(localStorage.getItem('chatbot_settings') || '{}');
    
    if (botName) botName.value = settings.botName || 'Support Bot';
    if (welcomeMessage) welcomeMessage.value = settings.welcomeMessage || 'Hello! How can I help you today?';
    if (fallbackMessage) fallbackMessage.value = settings.fallbackMessage || "I'm sorry, I don't understand that question. Could you try asking something else?";
    if (autoShow) autoShow.checked = settings.autoShow !== false;
    if (saveHistory) saveHistory.checked = settings.saveHistory !== false;
}

// פונקציה לשמירת הגדרות
function saveSettings() {
    const botName = document.getElementById('bot-name')?.value;
    const welcomeMessage = document.getElementById('welcome-message')?.value;
    const fallbackMessage = document.getElementById('fallback-message')?.value;
    const autoShow = document.getElementById('auto-show')?.checked;
    const saveHistory = document.getElementById('save-history')?.checked;
    
    const settings = {
        botName,
        welcomeMessage,
        fallbackMessage,
        autoShow,
        saveHistory
    };
    
    localStorage.setItem('chatbot_settings', JSON.stringify(settings));
    updateEmbedCode();
    alert('ההגדרות נשמרו בהצלחה');
}

// פונקציה לעדכון קוד ההטמעה
function updateEmbedCode() {
    const faqs = JSON.parse(localStorage.getItem('chatbot_faqs') || '[]');
    const settings = JSON.parse(localStorage.getItem('chatbot_settings') || '{}');
    
    // יצירת קוד ה-JavaScript להטמעה
    const embedCode = `
    <script>
        // נתוני הצ'אטבוט
        const chatbotData = {
            faqs: ${JSON.stringify(faqs)},
            settings: ${JSON.stringify(settings)}
        };

        // קוד הצ'אטבוט
        (function() {
            // כאן יהיה הקוד של הצ'אטבוט
            // הוא ישתמש בנתונים מ-chatbotData
        })();
    <\/script>
    `;

    // עדכון קוד ההטמעה בממשק
    const widgetCodeElem = document.getElementById('widget-code');
    if (widgetCodeElem) {
        widgetCodeElem.value = embedCode;
    }
}

// פונקציה להצגת טופס התחברות
function showLoginForm() {
    const existingForm = document.querySelector('.login-form-container');
    if (existingForm) {
        existingForm.remove();
    }

    const loginFormHtml = `
        <div class="login-form-container" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;">
            <div style="background: white; padding: 30px; border-radius: 10px; width: 350px;">
                <h2 style="text-align: right;">יצירת צ'אטבוט חדש</h2>
                <div class="form-group">
                    <label for="project-name">שם המוצר/אתר</label>
                    <input type="text" id="project-name" placeholder="הזן שם">
                </div>
                <div class="form-group">
                    <label for="project-language">שפה</label>
                    <select id="project-language">
                        <option value="he">עברית</option>
                        <option value="en">אנגלית</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="project-color">צבע ראשי</label>
                    <input type="color" id="project-color" value="#3498db">
                </div>
                <button id="create-project-btn" style="width: 100%; margin-top: 10px;">צור צ'אטבוט</button>
            </div>
        </div>
    `;
    
    const loginFormContainer = document.createElement('div');
    loginFormContainer.innerHTML = loginFormHtml;
    document.body.appendChild(loginFormContainer);
    
    document.getElementById('create-project-btn').addEventListener('click', createNewProject);
}

// פונקציה ליצירת פרויקט חדש
async function createNewProject() {
    try {
        const projectName = document.getElementById('project-name').value;
        const projectColor = document.getElementById('project-color').value;
        const projectLanguage = document.getElementById('project-language').value;
        
        if (!projectName) {
            alert("נא להזין שם למוצר/אתר");
            return;
        }

        const baseUrl = window.location.origin;
        const apiUrl = baseUrl.replace('http:', 'https:');

        // יצירת הפרויקט
        const projectResponse = await fetch(`${apiUrl}/api/projects/create-default`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: projectName,
                primaryColor: projectColor,
                language: projectLanguage
            })
        });

        if (!projectResponse.ok) {
            const errorData = await projectResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'שגיאה ביצירת פרויקט');
        }

        const projectResult = await projectResponse.json();
        if (!projectResult.success) {
            throw new Error(projectResult.message || 'שגיאה לא ידועה');
        }

        // שמירת ה-API key
        localStorage.setItem('chatbot_api_key', projectResult.data.apiKey);
        window.apiKey = projectResult.data.apiKey;

        // יצירת שאלות ברירת מחדל
        const faqResponse = await fetch(`${apiUrl}/api/faq/create-default`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId: projectResult.data.projectId,
                language: projectLanguage
            })
        });

        if (!faqResponse.ok) {
            const errorData = await faqResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'שגיאה ביצירת שאלות ברירת מחדל');
        }

        const faqResult = await faqResponse.json();
        if (!faqResult.success) {
            throw new Error(faqResult.message || 'שגיאה ביצירת שאלות ברירת מחדל');
        }

        // טעינה מחדש של הדף
        window.location.reload();