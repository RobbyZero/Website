document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.createElement('div');
  wrapper.id = 'goat-wrapper';
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.zIndex = '9999';
  wrapper.style.pointerEvents = 'none'; 
  wrapper.style.display = 'none';  
  document.body.appendChild(wrapper);

  const goat = document.createElement('div');
  goat.id = 'goat-pet';
  Object.assign(goat.style, {
    position: 'absolute',
    width: '64px',
    height: '64px',
    pointerEvents: 'none',
    transition: 'transform 0.2s ease',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  });

  const goatImg = document.createElement('img');
  goatImg.src = 'goat.png'; 
  goatImg.style.width = '100%';
  goatImg.style.height = '100%';
  goat.appendChild(goatImg);
  wrapper.appendChild(goat);

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

  let goatVisible = false; 
  let goatAsleep = false;
  let mealsEaten = 0;
  let sleepTimer;

  toggleLink.addEventListener('click', function (e) {
    e.preventDefault(); 
    goatVisible = !goatVisible;
    wrapper.style.display = goatVisible ? 'block' : 'none';
    wrapper.style.pointerEvents = goatVisible ? 'auto' : 'none';

    if (goatVisible) {
      wrapper.classList.add('hide-cursor');
    } else {
      wrapper.classList.remove('hide-cursor');
    }
  });

  function putGoatToSleep() {
    goatAsleep = true;
    goatImg.src = 'goat-sleep.png'; 
    speechBubble.textContent = "zzz...";
    speechBubble.style.opacity = '1';
    goat.classList.add('sleeping');

    clearInterval(messageInterval);

    setTimeout(() => {
      goatAsleep = false;
      goatImg.src = 'goat.png'; 
      speechBubble.style.opacity = '0';
      goat.classList.remove('sleeping');

      startMessageInterval();
    }, 5000);
  }

  let lastX = 0, lastY = 0;
  let isEating = false, isDragging = false;
  let offsetX = 0, offsetY = 0;
  let isFoodHeld = false; 

  let messageInterval; 

  function startMessageInterval() {
    messageInterval = setInterval(() => {
      if (!goatVisible || goatAsleep) return;
      const msg = messages[Math.floor(Math.random() * messages.length)];
      speechBubble.textContent = msg;
      speechBubble.style.opacity = '1';
      setTimeout(() => {
        speechBubble.style.opacity = '0';
      }, 3000);
    }, 10000);
  }

  const messages = ["Meh.", "BAH!", "*SCREAMS*", "MEH!", "Bah."];

  startMessageInterval(); 

  document.addEventListener('mousemove', (e) => {
    if (!goatVisible || goatAsleep) return;

    clearTimeout(sleepTimer);

    const x = e.clientX, y = e.clientY;
    const velocityX = x - lastX;

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
      goat.classList.add('eating'); 
      mealsEaten++;

      if (mealsEaten >= 3) {
        mealsEaten = 0;
        putGoatToSleep();
      }
    }

    if ((!isFoodHeld || !isNearBowl) && isEating) {
      isEating = false;
      goat.classList.remove('eating'); 
    }

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

    sleepTimer = setTimeout(() => {
      if (!goatAsleep) {
        putGoatToSleep(); 
      }
    }, 5000); 
  });

  foodBowl.addEventListener('mousedown', (e) => {
    isFoodHeld = true;
    isDragging = true;
    offsetX = e.clientX - foodBowl.offsetLeft;
    offsetY = e.clientY - foodBowl.offsetTop;
    foodBowl.style.transform = 'translateX(10px)';
    e.preventDefault(); 
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    isFoodHeld = false; 
    foodBowl.style.transform = '';
  });
});
