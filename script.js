const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert("Thank you! Your message has been received.");

        this.reset();

    });
}

document.querySelectorAll('a[href$=".html"]').forEach(function(link) {
    link.addEventListener("click", function(event) {
        const destination = new URL(this.href, window.location.href);

        if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) {
            return;
        }

        event.preventDefault();
        document.body.classList.add("page-leave");

        window.setTimeout(function() {
            window.location.href = destination.href;
        }, 220);
    });
});

document.querySelectorAll(".clickable-card[data-href]").forEach(function(card) {
    function openCard() {
        const destination = card.dataset.href;

        if (destination) {
            window.location.href = destination;
        }
    }

    card.addEventListener("click", function(event) {
        if (event.target.closest("a, button, input, textarea")) {
            return;
        }

        openCard();
    });

    card.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCard();
        }
    });
});

document.querySelectorAll(".service-visual").forEach(function(visual) {
    visual.addEventListener("pointermove", function(event) {
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        visual.style.setProperty("--visual-shift-x", `${x * 8}px`);
        visual.style.setProperty("--visual-shift-y", `${y * 8}px`);
    });

    visual.addEventListener("pointerleave", function() {
        visual.style.removeProperty("--visual-shift-x");
        visual.style.removeProperty("--visual-shift-y");
    });
});

document.querySelectorAll(".chart-controls button").forEach(function(button) {
    button.addEventListener("click", function() {
        const values = this.dataset.chartValues.split(",");
        const chart = this.closest(".metric-card").querySelectorAll(".chart-bars i");

        chart.forEach(function(bar, index) {
            bar.style.height = `${values[index]}%`;
        });
    });
});

document.querySelectorAll(".detail-scene[data-tilt]").forEach(function(scene) {
    scene.addEventListener("pointermove", function(event) {
        const bounds = scene.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        scene.style.transform = `rotateY(${x * 18 - 6}deg) rotateX(${y * -16 + 4}deg)`;
    });

    scene.addEventListener("pointerleave", function() {
        scene.style.transform = "rotateY(-11deg) rotateX(6deg)";
    });
});
