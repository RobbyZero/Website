document.addEventListener("DOMContentLoaded", function () {
    // Create the wrapper for the goat and food bowl
    const wrapper = document.createElement('div');
    wrapper.id = 'goat-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.zIndex = '9999';
    wrapper.style.pointerEvents = 'none'; // pointer events off by default
    wrapper.style.display = 'none';  // Goat is inactive and hidden by default
    document.body.appendChild(wrapper);
  
    // Goat div setup
    const goat = document.createElement('div');
    goat.id = 'goat-pet';
    Object.assign(goat.style, {
      position: 'absolute',
      width: '64px',
      height: '64px',
      pointerEvents: 'none',
      transition: 'transform 0.2s ease', // Smooth transition for movement
      transform: 'translate(-50%, -50%)',
      zIndex: 20,
    });
    const goatImg = document.createElement('img');
    goatImg.src = 'goat.png'; // Ensure goat.png is in the correct directory
    goatImg.style.width = '100%';
    goatImg.style.height = '100%';
    goat.appendChild(goatImg);
    wrapper.appendChild(goat);
  
    // Food bowl setup
    const foodBowl = document.createElement('div');
    foodBowl.id = 'food-bowl';
    Object.assign(foodBowl.style, {
      position: 'absolute',
      width: '50px',
      height: '50px',
      background: 'url("hay.png") no-repeat center center',
      backgroundSize: 'cover',
      cursor: 'pointer',
      zIndex: 10,
      left: '200px',
      top: '200px',
      pointerEvents: 'auto',
      userSelect: 'none',
    });
    wrapper.appendChild(foodBowl);
  
    // Speech bubble setup
    const speechBubble = document.createElement('div');
    speechBubble.id = 'speech-bubble';
    Object.assign(speechBubble.style, {
      position: 'fixed',
      padding: '6px 10px',
      background: 'white',
      border: '2px solid #333',
      borderRadius: '10px',
      fontFamily: 'sans-serif',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.5s ease',
      zIndex: 25
    });
    wrapper.appendChild(speechBubble);
  
    // Toggle link (anchor)
    const toggleLink = document.createElement('a');
    toggleLink.href = '#';
    toggleLink.textContent = 'Toggle Goat';
    Object.assign(toggleLink.style, {
      position: 'fixed',
      bottom: '60px',
      right: '20px',
      fontSize: '14px',
      background: 'white',
      padding: '5px 10px',
      borderRadius: '6px',
      textDecoration: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: '10000',
    });
    document.body.appendChild(toggleLink);
  
    // Prevent default action when the link is clicked and toggle goat visibility
    let goatVisible = false;  // Initially set to false, so the goat is inactive
    toggleLink.addEventListener('click', function (e) {
      e.preventDefault();  // Prevents the anchor from navigating
      goatVisible = !goatVisible;
      wrapper.style.display = goatVisible ? 'block' : 'none';  // Toggle visibility
    });
  
    // Goat behavior (movement, eating, etc.)
    let lastX = 0, lastY = 0;
    let isEating = false, isDragging = false;
    let offsetX = 0, offsetY = 0;
    let isFoodHeld = false; // New flag for holding food
  
    document.addEventListener('mousemove', (e) => {
      if (!goatVisible) return;  // Only proceed if goat is visible
      const x = e.clientX, y = e.clientY;
      const velocityX = x - lastX;
  
      // Only flip the goat when it's not eating
      if (!isEating) {
        goat.style.transform = velocityX < 0 ? 
          'translate(-50%, -50%) scaleX(-1)' :
          'translate(-50%, -50%)';
      }
  
      lastX = x;
      lastY = y;
  
      if (!isDragging) {
        goat.style.left = `${x}px`;
        goat.style.top = `${y}px`;
      }
  
      speechBubble.style.left = `${x}px`;
      speechBubble.style.top = `${y - 70}px`;
  
      // Check if the goat is near the bowl and "eating" only if the food is held
      const bowlRect = foodBowl.getBoundingClientRect();
      const goatRect = goat.getBoundingClientRect();
  
      const isNearBowl = (
        goatRect.right > bowlRect.left &&
        goatRect.left < bowlRect.right &&
        goatRect.bottom > bowlRect.top &&
        goatRect.top < bowlRect.bottom
      );
  
      if (isFoodHeld && isNearBowl && !isEating) {
        isEating = true;
        goat.classList.add('eating'); // Start eating animation
      }
  
      if ((!isFoodHeld || !isNearBowl) && isEating) {
        isEating = false;
        goat.classList.remove('eating'); // Stop eating animation
      }
  
      // Dragging logic for food bowl
      if (isDragging) {
        foodBowl.style.left = `${x - offsetX}px`;
        foodBowl.style.top = `${y - offsetY}px`;
      }
  
      if (isEating) {
        const bowlX = foodBowl.offsetLeft + 25;
        const bowlY = foodBowl.offsetTop + 25;
        goat.style.left = `${bowlX}px`;
        goat.style.top = `${bowlY}px`;
        speechBubble.style.left = `${bowlX}px`;
        speechBubble.style.top = `${bowlY - 70}px`;
      }
    });
  
    foodBowl.addEventListener('mousedown', (e) => {
      isFoodHeld = true; // The food is now being held
      isDragging = true;
      offsetX = e.clientX - foodBowl.offsetLeft;
      offsetY = e.clientY - foodBowl.offsetTop;
      foodBowl.style.transform = 'translateX(10px)';
      e.preventDefault(); // Prevent text selection
    });
  
    document.addEventListener('mouseup', () => {
      isDragging = false;
      isFoodHeld = false; // The food is no longer held
      foodBowl.style.transform = '';
    });
  
    // Speech function
    const messages = ["Meh", "BAH!", "*SCREAMS*", "MEH!", "Bah."];
    setInterval(() => {
      if (!goatVisible) return; // Only show speech when the goat is visible
      const msg = messages[Math.floor(Math.random() * messages.length)];
      speechBubble.textContent = msg;
      speechBubble.style.opacity = '1';
      setTimeout(() => {
        speechBubble.style.opacity = '0';
      }, 3000);
    }, 10000);
  });
