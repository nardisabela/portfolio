document.addEventListener('DOMContentLoaded', function() {
    // Game state
    const state = {
        isBusy: false
    };
    
    // Character System with customizable positions
    const character = {
        element: document.getElementById('character'),
        images: {
            idle: 'img/bonus/idle.png',
            reading: 'img/bonus/reading.png',
            drinking: 'img/bonus/drinking.png',
            working: 'img/bonus/working.png'
        },
        positions: {
            idle: { x: 300, y: 50 },
            reading: { x: 401, y: 125 },
            drinking: { x: 100, y: 110 },
            working: { x: 599, y: 102 }
        },
        currentState: 'idle'
    };

    // Audio elements - now pointing to your sounds folder
    const sounds = {
        click: new Audio('sound/bonus/click.mp3'), // Optional if you have it
        reading: new Audio('sound/bonus/sketching.mp3'),
        drinking: new Audio('sound/bonus/coffee.mp3'),
        working: new Audio('sound/bonus/typing.mp3')
    };

    // Initialize character element
    character.element.style.position = 'absolute';
    character.element.style.width = '100px';
    character.element.style.height = '140px';
    character.element.style.left = `${character.positions.idle.x}px`;
    character.element.style.bottom = `${character.positions.idle.y}px`;
    character.element.style.transition = 'left 1s ease-out, bottom 1s ease-out';
    character.element.style.backgroundImage = `url('${character.images.idle}')`;
    character.element.style.backgroundSize = 'contain';
    character.element.style.backgroundRepeat = 'no-repeat';
    character.element.style.backgroundPosition = 'center';
    character.element.style.zIndex = '10';

    // DOM elements
    const objects = document.querySelectorAll('.object');

    // Move character to a specific position
    function moveCharacterTo(newState, callback) {
        const targetPos = character.positions[newState];
        
        character.element.style.left = `${targetPos.x}px`;
        character.element.style.bottom = `${targetPos.y}px`;
        
        // Only change the image after the movement is complete
        character.element.addEventListener('transitionend', function onTransitionEnd() {
            character.element.removeEventListener('transitionend', onTransitionEnd);
            character.currentState = newState;
            character.element.style.backgroundImage = `url('${character.images[newState]}')`;
            if (callback) callback();
        }, { once: true });
    }

    // Stop all sounds
    function stopAllSounds() {
        Object.values(sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    // Return character to idle position
    function returnToIdle() {
        const idlePos = character.positions.idle;
        character.element.style.left = `${idlePos.x}px`;
        character.element.style.bottom = `${idlePos.y}px`;
        character.currentState = 'idle';
        character.element.style.backgroundImage = `url('${character.images.idle}')`;
        state.isBusy = false;
        
        // Stop all sounds when returning to idle
        stopAllSounds();
    }

    // Improved sound playing function
    function playSound(soundName) {
        if (sounds[soundName]) {
            // Stop and rewind if already playing
            sounds[soundName].pause();
            sounds[soundName].currentTime = 0;
            
            // Play and catch any errors
            sounds[soundName].play().catch(e => {
                console.error('Sound playback failed:', e);
                // Implement fallback or user gesture requirement handling
            });
        }
    }

    // Perform an action
    function performAction(action) {
        if (state.isBusy) return;
        state.isBusy = true;
        
        let soundToPlay = '';
        let newState = 'idle';

        switch(action) {
            case 'work':
                soundToPlay = 'working';
                newState = 'working';
                break;
            case 'drink-coffee':
                soundToPlay = 'drinking';
                newState = 'drinking';
                break;
            case 'read':
                soundToPlay = 'reading';
                newState = 'reading';
                break;
            default:
                state.isBusy = false;
                return;
        }

        // Move to action position (image will change after movement)
        moveCharacterTo(newState, () => {
            playSound(soundToPlay);
            
            // Stay at action position for sound duration or fixed time
            setTimeout(returnToIdle, 5000); // Adjust time as needed
        });
    }

    // Set up object click handlers with touch support
    objects.forEach(object => {
        object.addEventListener('click', function() {
            // iOS requires this to be triggered from a user gesture
            document.body.addEventListener('touchstart', function handler() {
                // Preload sounds on first interaction
                Object.values(sounds).forEach(sound => {
                    sound.load();
                });
                document.body.removeEventListener('touchstart', handler);
            });
            
            const action = this.getAttribute('data-action');
            performAction(action);
        });
    });

    // EXPOSED FUNCTION: Update position for a specific state
    window.updateCharacterPosition = function(stateName, x, y) {
        character.positions[stateName] = { x, y };
        console.log(`Updated ${stateName} position to (${x}, ${y})`);
    };

    // EXPOSED FUNCTION: Preload all sounds
    window.preloadSounds = function() {
        Object.values(sounds).forEach(sound => {
            sound.load();
        });
    };
});