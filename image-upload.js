const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function readStoredImages(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
        return [];
    }
}

function saveImages(key, images) {
    try {
        localStorage.setItem(key, JSON.stringify(images));
        return true;
    } catch (error) {
        return false;
    }
}

function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            "\"": "&quot;"
        }[character];
    });
}

function renderUploadPreviews(uploader, images) {
    const previewGrid = uploader.querySelector(".upload-preview-grid");
    previewGrid.innerHTML = "";

    images.forEach(function(image, index) {
        const preview = document.createElement("figure");
        preview.className = "upload-preview";
        const safeName = escapeHtml(image.name);
        preview.innerHTML = `<img src="${image.dataUrl}" alt="Uploaded image: ${safeName}"><figcaption><span title="${safeName}">${safeName}</span><button type="button" data-remove-index="${index}" aria-label="Remove ${safeName}">&times;</button></figcaption>`;
        previewGrid.appendChild(preview);
    });

    uploader.classList.toggle("has-images", images.length > 0);
}

function initializeUploader(uploader) {
    const input = uploader.querySelector('input[type="file"]');
    const dropzone = uploader.querySelector(".upload-dropzone");
    const clearButton = uploader.querySelector(".upload-clear");
    const storageKey = uploader.dataset.uploadKey;
    const uploadLimit = Number(uploader.dataset.uploadLimit || 6);
    let images = readStoredImages(storageKey);

    renderUploadPreviews(uploader, images);

    function addFiles(fileList) {
        const files = Array.from(fileList).filter(function(file) {
            return file.type.startsWith("image/");
        });
        const availableSlots = Math.max(uploadLimit - images.length, 0);

        if (!files.length) {
            window.alert("Please choose an image file.");
            return;
        }

        if (!availableSlots) {
            window.alert(`You can upload up to ${uploadLimit} images in this section.`);
            return;
        }

        const filesToRead = files.slice(0, availableSlots);
        filesToRead.forEach(function(file) {
            if (file.size > MAX_IMAGE_SIZE) {
                window.alert(`${file.name} is larger than 5 MB and was skipped.`);
                return;
            }

            const reader = new FileReader();
            reader.addEventListener("load", function() {
                images.push({
                    name: file.name,
                    size: file.size,
                    dataUrl: reader.result
                });

                if (!saveImages(storageKey, images)) {
                    images.pop();
                    window.alert("This image could not be saved in the browser. Try a smaller image.");
                    return;
                }

                renderUploadPreviews(uploader, images);
            });
            reader.readAsDataURL(file);
        });

        input.value = "";
    }

    input.addEventListener("change", function() {
        addFiles(input.files);
    });

    ["dragenter", "dragover"].forEach(function(eventName) {
        dropzone.addEventListener(eventName, function(event) {
            event.preventDefault();
            dropzone.classList.add("is-dragging");
        });
    });

    ["dragleave", "drop"].forEach(function(eventName) {
        dropzone.addEventListener(eventName, function(event) {
            event.preventDefault();
            dropzone.classList.remove("is-dragging");
        });
    });

    dropzone.addEventListener("drop", function(event) {
        addFiles(event.dataTransfer.files);
    });

    uploader.querySelector(".upload-preview-grid").addEventListener("click", function(event) {
        const removeButton = event.target.closest("[data-remove-index]");
        if (!removeButton) {
            return;
        }

        images.splice(Number(removeButton.dataset.removeIndex), 1);
        saveImages(storageKey, images);
        renderUploadPreviews(uploader, images);
    });

    clearButton.addEventListener("click", function() {
        images = [];
        localStorage.removeItem(storageKey);
        renderUploadPreviews(uploader, images);
    });
}

document.querySelectorAll(".image-uploader").forEach(initializeUploader);
