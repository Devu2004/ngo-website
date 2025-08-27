

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Navbar scroll effect with performance optimization
let ticking = false
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const navbar = document.querySelector(".navbar")
      if (window.scrollY > 50) {
        navbar.classList.add("shadow")
      } else {
        navbar.classList.remove("shadow")
      }
      ticking = false
    })
    ticking = true
  }
})

/**
 * Donation Management Module
 */

const DonationManager = {
  // Bootstrap modal instance
  bootstrap: window.bootstrap,

  // Predefined donation amounts
  amounts: [500, 1000, 2500, 5000],

  // Initialize donation modal
  init() {
    this.createModal()
  },

  // Create donation modal HTML
createModal() {
  const donateModal = `
    <div class="modal fade" id="donateModal" tabindex="-1" aria-labelledby="donateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="donateModalLabel">Support Kids Gardens Play School</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">Your donation will help us build a permanent home for our school and provide quality education to underprivileged children.</p>
            
            <div class="row g-3 mb-3">
              ${this.amounts
                .map(
                  (amount) => `
                <div class="col-6">
                  <button class="btn btn-outline-primary w-100" onclick="DonationManager.selectAmount(${amount})">₹${amount.toLocaleString()}</button>
                </div>
              `,
                )
                .join("")}
            </div>
            
            <div class="mb-3">
              <label for="customAmount" class="form-label">Custom Amount (₹)</label>
              <input type="number" class="form-control" id="customAmount" placeholder="Enter amount" min="1">
            </div>
            
            <div class="mb-3">
              <label for="donorName" class="form-label">Your Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="donorName" placeholder="Enter your name" required>
            </div>
            
            <div class="mb-3">
              <label for="donorEmail" class="form-label">Email Address <span class="text-danger">*</span></label>
              <input type="email" class="form-control" id="donorEmail" placeholder="Enter your email" required>
            </div>

            <div class="mb-3">
              <label for="donorPhone" class="form-label">Phone Number <span class="text-danger">*</span></label>
              <input 
                type="tel" 
                class="form-control" 
                id="donorPhone" 
                placeholder="Enter your phone number" 
                pattern="[0-9]{10}" 
                required>
              <div class="form-text">Enter a valid 10-digit phone number</div>
            </div>

          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-warning" onclick="DonationManager.process()">
              <i class="fas fa-heart me-2"></i>Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  // Remove existing modal if present
  const existingModal = document.getElementById("donateModal")
  if (existingModal) {
    existingModal.remove()
  }

  // Add modal to DOM
  document.body.insertAdjacentHTML("beforeend", donateModal)
},


  // Show donation modal
  show() {
    this.createModal()
    const modal = new this.bootstrap.Modal(document.getElementById("donateModal"))
    modal.show()
  },

  // Select predefined amount
  selectAmount(amount) {
    const customAmountInput = document.getElementById("customAmount")
    if (customAmountInput) {
      customAmountInput.value = amount
      customAmountInput.focus()
    }
  },

  // Validate donation form
  validateForm() {
    const amount = document.getElementById("customAmount")?.value
    const name = document.getElementById("donorName")?.value?.trim()
    const email = document.getElementById("donorEmail")?.value?.trim()

    const errors = []

    if (!amount || Number.parseFloat(amount) <= 0) {
      errors.push("Please enter a valid donation amount.")
    }

    if (!name) {
      errors.push("Please enter your name.")
    }

    if (!email) {
      errors.push("Please enter your email address.")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please enter a valid email address.")
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: { amount: Number.parseFloat(amount), name, email },
    }
  },

  // Process donation
  process() {
    const validation = this.validateForm()

    if (!validation.isValid) {
      NotificationManager.show(validation.errors.join("\n"), "error")
      return
    }

    const { amount, name, email } = validation.data

    // Simulate donation processing
    NotificationManager.show(
      `Thank you ${name}! Your donation of ₹${amount.toLocaleString()} will make a real difference in these children's lives. You will receive a confirmation email at ${email}.`,
      "success",
    )

    // Close modal
    const modal = this.bootstrap.Modal.getInstance(document.getElementById("donateModal"))
    if (modal) {
      modal.hide()
    }

    // Send notification email
    this.sendNotificationEmail(name, email, amount)
  },

  // Send email notification (placeholder for real implementation)
  sendNotificationEmail(name, email, amount) {
    const emailData = {
      to: "saachifoundetion@gmail.com",
      subject: `New Donation Received - ₹${amount.toLocaleString()}`,
      body: `
        New donation received:
        
        Donor Name: ${name}
        Email: ${email}
        Amount: ₹${amount.toLocaleString()}
        Date: ${new Date().toLocaleDateString("en-IN")}
        Time: ${new Date().toLocaleTimeString("en-IN")}
        
        Please follow up with the donor for payment processing.
      `,
    }

    console.log("Email notification prepared:", emailData)
  },
}

/**
 * Gallery Management Module
 */

const GalleryManager = {
  // Configuration
  config: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    storageKey: "galleryImages",
  },

  // Initialize gallery
  init() {
    this.loadImagesFromStorage()
    this.setupDragAndDrop()
  },

  // Handle photo upload
  handleUpload(event) {
    const files = Array.from(event.target.files)
    const validFiles = this.validateFiles(files)

    if (validFiles.length === 0) {
      NotificationManager.show(
        "No valid images selected. Please choose JPEG, PNG, GIF, or WebP files under 5MB.",
        "warning",
      )
      return
    }

    let processedCount = 0
    const totalFiles = validFiles.length

    validFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const imageData = e.target.result
        const imageId = this.generateId()
        this.saveImageToStorage(imageData, imageId)
        this.addImageToGallery(imageData, imageId)

        processedCount++
        if (processedCount === totalFiles) {
          NotificationManager.show(`${totalFiles} photo${totalFiles > 1 ? "s" : ""} uploaded successfully!`, "success")
        }
      }

      reader.onerror = () => {
        NotificationManager.show(`Failed to process ${file.name}`, "error")
      }

      reader.readAsDataURL(file)
    })

    // Clear input
    event.target.value = ""
  },

  // Validate uploaded files
  validateFiles(files) {
    return files.filter((file) => {
      const isValidType = this.config.allowedTypes.includes(file.type)
      const isValidSize = file.size <= this.config.maxFileSize

      if (!isValidType) {
        NotificationManager.show(`${file.name} is not a supported image format.`, "warning")
      }

      if (!isValidSize) {
        NotificationManager.show(`${file.name} is too large. Maximum size is 5MB.`, "warning")
      }

      return isValidType && isValidSize
    })
  },

  addImageToGallery(imageData, imageId) {
    const galleryContainer = document.getElementById("galleryContainer")
    if (!galleryContainer) return

    const photoCard = `
      <div class="col-lg-4 col-md-6 fade-in" data-image-id="${imageId}">
        <div class="gallery-item position-relative">
          <img src="${imageData}" 
               alt="User uploaded photo" 
               class="img-fluid rounded shadow-sm hover-lift" 
               style="width: 100%; height: 250px; object-fit: cover;"
               loading="lazy">
          <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" 
                  onclick="GalleryManager.deleteImage('${imageId}')"
                  style="opacity: 0.8; z-index: 10;"
                  title="Delete Image">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `

    galleryContainer.insertAdjacentHTML("beforeend", photoCard)
  },

  saveImageToStorage(imageData, imageId) {
    try {
      const savedImages = JSON.parse(localStorage.getItem(this.config.storageKey) || "[]")
      savedImages.push({
        data: imageData,
        timestamp: Date.now(),
        id: imageId,
      })
      localStorage.setItem(this.config.storageKey, JSON.stringify(savedImages))
    } catch (error) {
      console.error("Failed to save image to storage:", error)
      NotificationManager.show("Failed to save image. Storage might be full.", "error")
    }
  },

  loadImagesFromStorage() {
    try {
      const savedImages = JSON.parse(localStorage.getItem(this.config.storageKey) || "[]")
      savedImages.forEach((image) => {
        this.addImageToGallery(image.data, image.id)
      })
    } catch (error) {
      console.error("Failed to load images from storage:", error)
    }
  },

  deleteImage(imageId) {
    try {
      // Remove from DOM
      const imageElement = document.querySelector(`[data-image-id="${imageId}"]`)
      if (imageElement) {
        imageElement.style.animation = "fadeOut 0.3s ease-out"
        setTimeout(() => {
          imageElement.remove()
        }, 300)
      }

      // Remove from localStorage
      const savedImages = JSON.parse(localStorage.getItem(this.config.storageKey) || "[]")
      const updatedImages = savedImages.filter((image) => image.id !== imageId)
      localStorage.setItem(this.config.storageKey, JSON.stringify(updatedImages))

      NotificationManager.show("Image deleted successfully!", "success")
    } catch (error) {
      console.error("Failed to delete image:", error)
      NotificationManager.show("Failed to delete image.", "error")
    }
  },

  // Setup drag and drop functionality
  setupDragAndDrop() {
    const uploadArea = document.querySelector(".upload-area")
    if (!uploadArea) return
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, this.preventDefaults, false)
    })
    ;["dragenter", "dragover"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, () => this.highlight(uploadArea), false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, () => this.unhighlight(uploadArea), false)
    })

    uploadArea.addEventListener("drop", (e) => this.handleDrop(e), false)
  },

  // Prevent default drag behaviors
  preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  },

  // Highlight drop area
  highlight(element) {
    element.style.backgroundColor = "#e3f2fd"
    element.style.borderColor = "#1976d2"
  },

  // Remove highlight from drop area
  unhighlight(element) {
    element.style.backgroundColor = "#f8f9fa"
    element.style.borderColor = "#4a90e2"
  },

  // Handle file drop
  handleDrop(e) {
    const files = Array.from(e.dataTransfer.files)
    this.handleUpload({ target: { files, value: "" } })
  },

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },
}

/**
 * Notification Management Module
 */

const NotificationManager = {
  // Show notification
  show(message, type = "info") {
    // For now, using alert - can be enhanced with toast notifications
    alert(message)
  },
}

/**
 * Social Sharing Module
 */

const SocialManager = {
  // Share story functionality
  shareStory() {
    const shareData = {
      title: "Kids Gardens Play School: Shining Light of Hope",
      text: "Help us build a permanent home for underprivileged children. Every donation makes a difference!",
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch((err) => {
        console.error("Error sharing:", err)
        this.fallbackShare(shareData)
      })
    } else {
      this.fallbackShare(shareData)
    }
  },

  // Fallback sharing method
  fallbackShare(shareData) {
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          NotificationManager.show("Story details copied to clipboard! You can now paste and share it.", "success")
        })
        .catch(() => {
          this.legacyCopyToClipboard(shareText)
        })
    } else {
      this.legacyCopyToClipboard(shareText)
    }
  },

  // Legacy clipboard copy method
  legacyCopyToClipboard(text) {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"
    document.body.appendChild(textArea)
    textArea.select()

    try {
      document.execCommand("copy")
      NotificationManager.show("Story details copied to clipboard! You can now paste and share it.", "success")
    } catch (err) {
      console.error("Failed to copy text:", err)
      NotificationManager.show("Unable to copy to clipboard. Please copy the URL manually.", "error")
    }

    document.body.removeChild(textArea)
  },
}

/**
 * Global Functions (for backward compatibility)
 */

// Expose functions globally for HTML onclick handlers
window.handleDonate = () => DonationManager.show()
window.handlePhotoUpload = (event) => GalleryManager.handleUpload(event)
window.shareStory = () => SocialManager.shareStory()
window.GalleryManager = GalleryManager

/**
 * Application Initialization
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  GalleryManager.init()

  // Initialize Bootstrap tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const bootstrap = window.bootstrap // Declare bootstrap variable here
  ;[...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Add custom styles for animations
  if (!document.getElementById("custom-animations")) {
    const style = document.createElement("style")
    style.id = "custom-animations"
    style.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
      
      .fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(style)
  }
})
