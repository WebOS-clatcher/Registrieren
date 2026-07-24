class Register extends Layer {
    constructor() {
        super("Registrieren", "fa fa-user-plus", 500);

        const form = document.createElement("form");
        const info = document.createElement("p");
        info.style.fontSize = "16pt";

        const userForm = document.createElement("input");
        userForm.classList.add("textfield");
        userForm.classList.add("clatcher-width");
        userForm.classList.add("mb-15");
        userForm.type = "text";
        userForm.name = "username";
        userForm.minLength = "4";
        userForm.maxLength = "30";
        userForm.required = "true";
        userForm.placeholder = "Nutzername";

        const emailForm = document.createElement("input");
        emailForm.classList.add("textfield");
        emailForm.classList.add("clatcher-width");
        emailForm.classList.add("mb-15");
        emailForm.type = "email";
        emailForm.required = "true";
        emailForm.placeholder = "E-Mail";

        const passForm = document.createElement("input");
        passForm.classList.add("textfield");
        passForm.classList.add("clatcher-width");
        passForm.classList.add("mb-15");
        passForm.type = "password";
        passForm.required = "true";
        passForm.placeholder = "Passwort";

        const passForm2 = document.createElement("input");
        passForm2.classList.add("textfield");
        passForm2.classList.add("clatcher-width");
        passForm2.classList.add("mb-15");
        passForm2.type = "password";
        passForm2.required = "true";
        passForm2.placeholder = "Passwort wiederholen";

        const register = document.createElement("input");
        register.classList.add("clatcher-btn");
        register.type = "submit";
        register.value = "Registrieren";
        register.addEventListener("click", async e => {
            e.preventDefault();

            info.innerHTML = "";

            if(!form.checkValidity()) {
                info.style.color = "red";
                const error = document.createTextNode("Ungültige Eingabe!");
                info.appendChild(error);
                if(!userForm.checkValidity()) {
                    const userError = document.createTextNode("Username min. 4 max. 30 Zeichen");
                    info.appendChild(document.createElement("br"));
                    info.appendChild(userError);
                }
                if(!emailForm.checkValidity()) {
                    const emailError = document.createTextNode("Ungültige E-Mail Adresse");
                    info.appendChild(document.createElement("br"));
                    info.appendChild(emailError);
                }
                if(!passForm.checkValidity()) {
                    const pass1Error = document.createTextNode("Gib bitte ein Passwort ein!");
                    info.appendChild(document.createElement("br"));
                    info.appendChild(pass1Error);
                }
                if(!passForm2.checkValidity()) {
                    const pass2Error = document.createTextNode("Wiederhole dein Passwort!");
                    info.appendChild(document.createElement("br"));
                    info.appendChild(pass2Error);
                }
                if(passForm.value !== passForm2.value) {
                    const passError = document.createTextNode("Passwörter stimmen nicht überein!");
                    info.appendChild(document.createElement("br"));
                    info.appendChild(passError);
                }

                return;
            }

            await fetch("/clatcher/sign/up", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uname: userForm.value,
                    umail: emailForm.value,
                    upass1: passForm.value,
                    upass2: passForm2.value
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.code === 200)
                    document.dispatchEvent(options.events.onLogin);
                else {
                    info.style.color = "red";
                    info.textContent = data.info;
                }
            });
        });

        const reset = document.createElement("input");
        reset.classList.add("clatcher-btn");
        reset.type = "reset";
        reset.value = "Löschen";
        
        form.appendChild(info);
        form.appendChild(userForm);
        form.appendChild(emailForm);
        form.appendChild(passForm);
        form.appendChild(passForm2);

        const inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        inputGroup.appendChild(register);
        inputGroup.appendChild(reset);

        form.appendChild(inputGroup);

        this.onClose = () => {
            info.innerHTML = "";
            form.reset();
        };

        this.setBody(form);
    }
}

manager.registerLayer({
    layer: new Register(),
    where: options.layerVisibility.onlogout,
	type: options.layerType.system
});