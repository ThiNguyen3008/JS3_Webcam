// Select DOM elements
const videoPlayer = document.querySelector('.player');
const photoCanvas = document.querySelector('.photo');
const context = photoCanvas.getContext('2d');
const photoStrip = document.querySelector('.strip');
const soundEffect = document.querySelector('.snap');

// Function to initialize video stream
async function initializeVideo() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log(mediaStream);
    videoPlayer.srcObject = mediaStream;
    videoPlayer.play();
  } catch (error) {
    console.error('Error accessing webcam:', error);
  }
}

// Function to paint video frames onto the canvas
function renderVideoToCanvas() {
  const { videoWidth: width, videoHeight: height } = videoPlayer;
  photoCanvas.width = width;
  photoCanvas.height = height;

  setInterval(() => {
    context.drawImage(videoPlayer, 0, 0, width, height);
    // Capture pixel data
    const pixelData = context.getImageData(0, 0, width, height);
    context.putImageData(pixelData, 0, 0);
  }, 16);
}

// Function to capture a photo
function capturePhoto() {
  // Play the sound effect
  soundEffect.currentTime = 0;
  soundEffect.play();

  // Get data from the canvas and create a downloadable link
  const imageData = photoCanvas.toDataURL('image/jpeg');
  const downloadLink = document.createElement('a');
  downloadLink.href = imageData;
  downloadLink.setAttribute('download', 'captured_image.jpg');
  downloadLink.innerHTML = `<img src="${imageData}" alt="Captured Image" />`;
  photoStrip.insertBefore(downloadLink, photoStrip.firstChild);
}

// Start video stream and setup event listener
initializeVideo();
videoPlayer.addEventListener('canplay', renderVideoToCanvas);
