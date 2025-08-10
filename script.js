document.addEventListener('DOMContentLoaded', () => {
    const smallBtn = document.getElementById('smallSizeBtn');
    const largeBtn = document.getElementById('largeSizeBtn');
    const displayText = document.getElementById('displayText');
    const container = document.querySelector('.paper-size-section');

    function activateSmall() {
        displayText.style.display = 'block';
        smallBtn.classList.add('active');
        largeBtn.classList.remove('active');
        displayText.textContent = 'يعرض في 2 ورقة';
        container.classList.add('cards-small-text');
        container.classList.remove('cards-large-text');
    }

    function activateLarge() {
        displayText.style.display = 'block';
        largeBtn.classList.add('active');
        smallBtn.classList.remove('active');
        displayText.textContent = 'يعرض في 4 ورقة';
        container.classList.add('cards-large-text');
        container.classList.remove('cards-small-text');
    }

    smallBtn.addEventListener('click', activateSmall);
    largeBtn.addEventListener('click', activateLarge);

    // ===== Edit Questions Feature =====
    function attachModifyListener(button) {
        button.addEventListener('click', () => {
            const section = button.closest('section');
            if (section.nextElementSibling && section.nextElementSibling.classList.contains('edit-section')) {
                return; // already in edit mode
            }

            // Clone section for editing
            const editSection = section.cloneNode(true);
            editSection.classList.add('edit-section');

            // Remove old modify button
            const header = editSection.querySelector('.custom-header');
            header.querySelectorAll('.modify').forEach(b => b.remove());

            // Make texts editable (but not inputs or images)
            editSection.querySelectorAll('.question-cell, h5, p, td').forEach(el => {
                if (!el.querySelector('input') && !el.querySelector('img')) {
                    el.contentEditable = true;
                    el.style.backgroundColor = '#fffbe6';
                }
            });

            // Create save / undo / cancel buttons in the same spot as modify button
            const btnContainer = document.createElement('div');
            btnContainer.classList.add('d-flex', 'align-items-center', 'gap-2');

            const saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.className = 'btn d-flex align-items-center gap-2 modify';
            saveBtn.innerHTML = `<i class="fa-solid fa-check"></i> حفظ`;

            const undoBtn = document.createElement('button');
            undoBtn.type = 'button';
            undoBtn.className = 'btn d-flex align-items-center gap-2 modify';
            undoBtn.innerHTML = `<i class="fa-solid fa-rotate-left"></i> تراجع`;

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn d-flex align-items-center gap-2 modify';
            cancelBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> إلغاء`;

            btnContainer.append(saveBtn, undoBtn, cancelBtn);
            header.appendChild(btnContainer);

            // Store original editable content for undo
            const originalContent = Array.from(editSection.querySelectorAll('[contenteditable]'))
                .map(el => el.innerHTML);

            // Insert edit section after the original
            section.insertAdjacentElement('afterend', editSection);

            // Save changes
            saveBtn.addEventListener('click', () => {
                btnContainer.remove();
                editSection.querySelectorAll('[contenteditable]').forEach(el => {
                    el.removeAttribute('contenteditable');
                    el.style.backgroundColor = '';
                });

                // Apply edits to original section
                section.innerHTML = editSection.innerHTML;

                // Re-add modify button in original
                const origHeader = section.querySelector('.custom-header');
                if (origHeader && !origHeader.querySelector('.modify')) {
                    const modifyBtn = document.createElement('button');
                    modifyBtn.type = 'button';
                    modifyBtn.className = 'btn d-flex align-items-center gap-2 modify';
                    modifyBtn.innerHTML = `<i class="fa-solid fa-pen"></i> تعديل`;
                    origHeader.appendChild(modifyBtn);
                    attachModifyListener(modifyBtn);
                }

                editSection.remove();
            });

            // Undo changes (restore saved editable text values)
            undoBtn.addEventListener('click', () => {
                const editableEls = editSection.querySelectorAll('[contenteditable]');
                editableEls.forEach((el, i) => {
                    el.innerHTML = originalContent[i];
                });
            });

            // Cancel edit
            cancelBtn.addEventListener('click', () => {
                editSection.remove();
            });
        });
    }

    // Attach listeners to all modify buttons initially
    document.querySelectorAll('.modify').forEach(attachModifyListener);
});
