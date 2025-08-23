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

// Donate functionality
const bootstrap = window.bootstrap // Declare the bootstrap variable

function handleDonate() {
  const donateModal = `
        <div class="modal fade" id="donateModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Support Kids Gardens Play School</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Your donation will help us build a permanent home for our school and provide quality education to underprivileged children.</p>
                        <div class="row g-3">
                            <div class="col-6">
                                <button class="btn btn-outline-primary w-100" onclick="selectAmount(500)">₹500</button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-outline-primary w-100" onclick="selectAmount(1000)">₹1,000</button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-outline-primary w-100" onclick="selectAmount(2500)">₹2,500</button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-outline-primary w-100" onclick="selectAmount(5000)">₹5,000</button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <label for="customAmount" class="form-label">Custom Amount (₹)</label>
                            <input type="number" class="form-control" id="customAmount" placeholder="Enter amount">
                        </div>
                        <div class="mt-3">
                            <label for="donorName" class="form-label">Your Name</label>
                            <input type="text" class="form-control" id="donorName" placeholder="Enter your name">
                        </div>
                        <div class="mt-3">
                            <label for="donorEmail" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="donorEmail" placeholder="Enter your email">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="processDonation()">Donate Now</button>
                    </div>
                </div>
            </div>
        </div>
    `

  // Remove existing modal if any
  const existingModal = document.getElementById("donateModal")
  if (existingModal) {
    existingModal.remove()
  }

  // Add modal to body
  document.body.insertAdjacentHTML("beforeend", donateModal)

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("donateModal"))
  modal.show()
}

function selectAmount(amount) {
  document.getElementById("customAmount").value = amount
}

function processDonation() {
  const amount = document.getElementById("customAmount").value
  const name = document.getElementById("donorName").value
  const email = document.getElementById("donorEmail").value

  if (!amount || amount <= 0) {
    alert("Please enter a valid donation amount.")
    return
  }

  if (!name || !email) {
    alert("Please fill in your name and email address.")
    return
  }

  // In a real implementation, this would integrate with a payment gateway
  alert(
    `Thank you ${name}! Your donation of ₹${amount} will make a real difference in these children's lives. You will receive a confirmation email at ${email}.`,
  )

  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("donateModal"))
  modal.hide()

  // Send email notification (in real implementation)
  sendDonationEmail(name, email, amount)
}

function sendDonationEmail(name, email, amount) {
  const emailData = {
    to: "saachifoundetion@gmail.com",
    subject: `New Donation Received - ₹${amount}`,
    body: `
            New donation received:
            
            Donor Name: ${name}
            Email: ${email}
            Amount: ₹${amount}
            Date: ${new Date().toLocaleDateString()}
            
            Please follow up with the donor for payment processing.
        `,
  }

  // In a real implementation, this would send via email service
  console.log("Email notification sent:", emailData)
}

// Share story functionality
function shareStory() {
  const shareData = {
    title: "Kids Gardens Play School: Shining Light of Hope",
    text: "Help us build a permanent home for underprivileged children. Every donation makes a difference!",
    url: window.location.href,
  }

  if (navigator.share) {
    navigator.share(shareData)
  } else {
    // Fallback for browsers that don't support Web Share API
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Story details copied to clipboard! You can now paste and share it.")
      })
    } else {
      // Final fallback
      const textArea = document.createElement("textarea")
      textArea.value = shareText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("Story details copied to clipboard! You can now paste and share it.")
    }
  }
}

// Photo upload functionality
function handlePhotoUpload(event) {
  const files = event.target.files
  const galleryContainer = document.getElementById("galleryContainer")

  Array.from(files).forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const photoCard = `
                    <div class="col-md-4 fade-in">
                        <div class="card border-0 shadow-sm">
                            <img src="${e.target.result}" alt="User uploaded photo" class="card-img-top" style="height: 250px; object-fit: cover;">
                            <div class="card-body">
                                <p class="card-text">
                                    <small class="text-muted">Uploaded by community member</small>
                                </p>
                                <button class="btn btn-sm btn-outline-danger" onclick="removePhoto(this)">
                                    <i class="fas fa-trash me-1"></i>Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `

        galleryContainer.insertAdjacentHTML("beforeend", photoCard)
      }

      reader.readAsDataURL(file)
    }
  })

  // Clear the input
  event.target.value = ""

  // Show success message
  showNotification("Photos uploaded successfully!", "success")
}

function removePhoto(button) {
  const photoCard = button.closest(".col-md-4")
  photoCard.style.animation = "fadeOut 0.3s ease-out"
  setTimeout(() => {
    photoCard.remove()
  }, 300)
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  notification.style.cssText = "top: 100px; right: 20px; z-index: 9999; min-width: 300px;"
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(notification)

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 3000)
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.classList.add("shadow")
  } else {
    navbar.classList.remove("shadow")
  }
})

// Add fade-out animation for photo removal
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
`
document.head.appendChild(style)

// Initialize tooltips and popovers if needed
document.addEventListener("DOMContentLoaded", () => {
  // Initialize any Bootstrap components that need it
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
})