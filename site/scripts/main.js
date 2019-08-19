(function() {
    // Scroll to element
    document.querySelectorAll('.js-scroll').forEach((element) => {
        element.addEventListener('click', (event) => {
            event.preventDefault();

            const target = element.href.split('#').slice(-1).pop();

            document.querySelector(`[name='${ target }']`).scrollIntoView({ behavior: 'smooth' });
        }, false);
    });

    // Lightbox
    const lightboxes = document.querySelectorAll('.js-lightbox');

    for (const lightbox of lightboxes) {
        lightbox.addEventListener('click', (event) => {
            lightbox.classList.toggle('looks__item--lightbox');
        });
    }

    // Send form submit
    const form = document.querySelector('.js-form');
    const formTitle = document.querySelector('.js-title');
    const messageThanks = document.querySelector('.js-thanks');
    const messageError = document.querySelector('.js-error');
    const sendButton = document.querySelector('.js-send');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        let data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        sendButton.classList.toggle('button--disable');
        messageError.classList.replace('visible', 'hidden');
        messageThanks.classList.replace('visible', 'hidden');

        if (grecaptcha.getResponse()) {
            send(data);
        } else {
            sendButton.classList.toggle('button--disable');
            messageError.classList.replace('hidden', 'visible');
        }
    });

    async function send(data) {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        try {
            const response = await fetch('https://us-central1-rafael-brinker-project.cloudfunctions.net/email', {
                method: 'POST',
                headers,
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            form.classList.replace('opaque', 'transparent');
            formTitle.classList.replace('visible', 'hidden');
            messageThanks.classList.replace('hidden', 'visible');
        } catch (error) {
            console.error(error);
            sendButton.classList.toggle('button--disable');
            messageError.classList.replace('hidden', 'visible');
        } finally {
            console.info('Finally');
        }
    }
})();
