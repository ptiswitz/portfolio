document.addEventListener('DOMContentLoaded', () => {
    // --- SELECTORS ---
    const preloader = document.querySelector('.preloader');
    const loadingProgress = document.querySelector('.loading-progress');
    const pressSpacePrompt = document.querySelector('.press-space');
    const characterCard = document.querySelector('.character-card');
    const flipButtons = document.querySelectorAll('.flip-card');
    const characterSpriteContainer = document.getElementById('character-sprite');

function drawPixelHeartWithCount() {
const healthPotionContainer = document.getElementById('health-potion-display');
if (!healthPotionContainer) return;

healthPotionContainer.innerHTML = ''; // Clear any previous content

// Pixel art data for the heart (1 = filled pixel, 0 = empty)
const heartMatrix = [
[0, 1, 0, 1, 0],
[1, 1, 1, 1, 1],
[0, 1, 1, 1, 0],
[0, 0, 1, 0, 0]
];

const pixelSize = 5; // Size of each "pixel" in CSS pixels
const heartRows = heartMatrix.length;
const heartCols = heartMatrix[0].length;
const gapSize = 1; // Must match the 'gap' in .heart-art-container CSS

// Create the heart drawing area
const heartArtDiv = document.createElement('div');
heartArtDiv.className = 'heart-art-container';
heartArtDiv.style.gridTemplateColumns = `repeat(${heartCols}, ${pixelSize}px)`;
heartArtDiv.style.gridTemplateRows = `repeat(${heartRows}, ${pixelSize}px)`;

// Calculate width and height including gaps (but not the outer box-shadow border)
heartArtDiv.style.width = `${(heartCols * pixelSize) + ((heartCols - 1) * gapSize)}px`;
heartArtDiv.style.height = `${(heartRows * pixelSize) + ((heartRows - 1) * gapSize)}px`;

// Populate the grid with heart pixels
heartMatrix.forEach(row => {
row.forEach(cell => {
    const pixelDiv = document.createElement('div');
    if (cell === 1) {
    pixelDiv.className = 'heart-pixel';
    }
    // If cell is 0, it's an empty div, will show container's background (gap color)
    heartArtDiv.appendChild(pixelDiv);
});
});

// Create the count display
const countDiv = document.createElement('div');
countDiv.className = 'health-count';
countDiv.textContent = '3';

// Append to the main container
healthPotionContainer.appendChild(heartArtDiv);
healthPotionContainer.appendChild(countDiv);
}

    
    function handlePreloader() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2; // Slower, more "realistic" loading
        if (progress > 100) progress = 100;
        loadingProgress.style.width = `${progress}%`;

        if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
            if (preloader) preloader.style.display = 'none';
            if (pressSpacePrompt) pressSpacePrompt.style.display = 'block';
            initInteraction();
            drawPixelHeartWithCount(); // Draw heart with count
        }, 500); // Give a moment for 100% to show
        }
    }, 30); // Adjust interval for speed
    }

    function initInteraction() {
    const startHandler = (event) => {
        // Check if the click is not on a button/link inside the card already
        let target = event.target;
        let isInteractiveElement = false;
        while(target && target !== document.body) {
        if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('form-control')) {
            // If the preloader isn't dismissed yet, and we click an interactive element,
            // we still want to dismiss the prompt. But after that, let the element do its job.
            if (pressSpacePrompt && pressSpacePrompt.style.display !== 'none') {
                // continue to dismiss logic
            } else {
            isInteractiveElement = true; // It's an active element, don't block its default action by only dismissing prompt
            break;
            }
        }
        target = target.parentNode;
        }


        if (event.type === 'click' || (event.type === 'keydown' && event.code === 'Space')) {
            if (pressSpacePrompt && pressSpacePrompt.style.display !== 'none') {
            pressSpacePrompt.style.display = 'none';
            if (characterCard) {
                characterCard.classList.add('float-animation');
                characterCard.classList.add('displayed'); // Ensure card is not flipped
                characterSpriteContainer.classList.add('bobbing'); // Add bobbing animation
            }
            
            // Remove listeners only after the first interaction that dismisses the prompt
            document.removeEventListener('click', startHandler);
            document.removeEventListener('keydown', startHandler);
            } else if (event.type === 'keydown' && event.code === 'Space' && !isInteractiveElement) {
            // Allow space to flip card if not typing in a form field.
            const activeEl = document.activeElement;
            if (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA') {
                if (characterCard) characterCard.classList.toggle('flipped');
            }
            }
        }
    };
    document.addEventListener('click', startHandler);
    document.addEventListener('keydown', startHandler);
    }

    function setupCardFlip() {
    if (characterCard && flipButtons.length > 0) {
        flipButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering document click listener if prompt is still up
            characterCard.classList.toggle('flipped');
        });
        });
    }
    }

    // --- INITIALIZATION ---
    handlePreloader();
    setupCardFlip();
    // Pixel art and float animation are triggered after preloader / "press space".
});