const video = document.getElementById('camera');
const startButton = document.getElementById('startButton');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const imageGrid = document.getElementById('imageGrid');
const slots = [
  document.getElementById('slot1'),
  document.getElementById('slot2'),
  document.getElementById('slot3'),
  document.getElementById('slot4')
];
let currentSlot = 0;

// Request access to the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream; // Connect camera stream to video element
  })
  .catch(err => {
    console.error('Error accessing camera:', err);
    alert('Could not access the camera. Please allow permissions.');
  });

// Event listener for start button
startButton.addEventListener('click', () => {
  const images = [];
  let count = 0;

  // Hide the button during capture
  startButton.style.display = 'none';

  // Function to capture an image
  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/png');
    images.push(imageDataUrl);
    count++;

    if (count < 9) {
      // Capture next image after 1 second
      setTimeout(captureImage, 1000);
    } else {
      // All 9 images captured, hide video and show modal
      video.style.display = 'none';
      displayImages(images);
    }
  };

  // Start capturing
  captureImage();
});

// Function to display images in modal
function displayImages(images) {
  imageGrid.innerHTML = ''; // Clear any previous images
  images.forEach((imgSrc, index) => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.addEventListener('click', () => selectImage(imgSrc, index));
    imageGrid.appendChild(img);
  });
  modal.style.display = 'block';
}

// Function to select an image and place it in the next slot
function selectImage(imgSrc, index) {
  if (currentSlot < 4) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.width = '75%';
    img.style.height = '82%';
    img.style.objectFit = 'cover';
    slots[currentSlot].innerHTML = '';
    slots[currentSlot].appendChild(img);
    currentSlot++;
  }
}

// Close modal and restart video
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  video.style.display = 'block';
  startButton.style.display = 'block';
  imageGrid.innerHTML = ''; // Clear images
  currentSlot = 0;
  slots.forEach(slot => slot.innerHTML = ''); // Clear slots
});