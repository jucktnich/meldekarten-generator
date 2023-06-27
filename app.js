var entries = [];
const entryLength = 19;
var exportString = "";
const emptyObject = { "name": "", "firstName": "", "birthdate": "", "sex": "", "zip": "", "residency": "", "nationality": "", "street": "", "identityDisk": "", "district": "", "rcUnit": "", "place": "", "unit": "", "start": "" }

function isEmpty(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
        let val = obj[keys[i]]
        if (val && val != "" && val != undefined && val != null) return false
    }
    return true
}

function dateToStandard(date, includeTime = false) {
    const jsDate = new Date(date);
    if (jsDate == "Invalid Date") return ""
    const yyyy = jsDate.getFullYear();
    let mm = jsDate.getMonth() + 1;
    let dd = jsDate.getDate();
    let hh = jsDate.getHours();
    let minmin = jsDate.getMinutes();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hh < 10) hh = '0' + hh;
    if (minmin < 10) minmin = '0' + minmin;

    if (includeTime) return dd + '.' + mm + '.' + yyyy + ', ' + hh + ':' + minmin;
    return dd + '.' + mm + '.' + yyyy;
}

function importString(input) {
    getData()
    input = input.replace(/\n/g, ";");
    input = input.split(";");
    input.length = input.length - 1;
    for (let i = 0; i < input.length / entryLength; i++) {
        let entry = {};
        entry.name = input[i * entryLength + 0];
        entry.firstName = input[i * entryLength + 1];
        let birthdate = input[i * entryLength + 2];
        if (!birthdate) {
            entry.birthdate = ""
        } else {
            birthdate = birthdate.split(".")
            entry.birthdate = `${birthdate[2]}-${birthdate[1]}-${birthdate[0]}`;
        }
        entry.sex = input[i * entryLength + 3];
        entry.zip = input[i * entryLength + 4];
        entry.residency = input[i * entryLength + 5];
        entry.nationality = input[i * entryLength + 6];
        entry.street = input[i * entryLength + 7];
        entry.identityDisk = input[i * entryLength + 8];
        entry.district = input[i * entryLength + 9];
        entry.rcUnit = input[i * entryLength + 10];
        entry.place = input[i * entryLength + 11];
        entry.unit = input[i * entryLength + 12];
        let start = input[i * entryLength + 13];
        if (!start) {
            entry.start = ""
        } else {
            start = start.split(".")
            entry.start = `${start[2]}-${start[1]}-${start[0]}`;
        }
        entries.push(entry);
    }
    render()
}

function doExportString() {
    getData();
    let exportArray = [];
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let arrayForEntry = [];
        arrayForEntry[0] = entry.name;
        arrayForEntry[1] = entry.firstName;
        arrayForEntry[2] = dateToStandard(entry.birthdate);
        arrayForEntry[3] = entry.sex;
        arrayForEntry[4] = entry.zip;
        arrayForEntry[5] = entry.residency;
        arrayForEntry[6] = entry.nationality;
        arrayForEntry[7] = entry.street;
        arrayForEntry[8] = entry.identityDisk;
        arrayForEntry[9] = entry.district;
        arrayForEntry[10] = entry.rcUnit;
        arrayForEntry[11] = entry.place;
        arrayForEntry[12] = entry.unit;
        arrayForEntry[13] = dateToStandard(entry.start, true);
        let entryString = "";
        for (let j = 0; j < entryLength - 1; j++) {
            if (arrayForEntry[j] != undefined) entryString += arrayForEntry[j].replace(/;/g, ",") + ";";
            else entryString += ";";
        }
        exportArray.push(entryString);
    }
    let newExportString = "";
    for (let j = 0; j < exportArray.length; j++) {
        newExportString += exportArray[j] + "\n";
    }
    exportString = newExportString;
    document.getElementById("export-overlay").style.display = "inline";
}

function download() {
    let link = document.createElement("a");
    link.style.display = "none";
    link.textContent = "download";
    link.download = "meldekarten.csv";
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(exportString);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    document.getElementById("export-overlay").style.display = "none";
}

function copy() {
    navigator.clipboard.writeText(exportString);
    document.getElementById("export-overlay").style.display = "none";
}

function addEntry() {
    getData()
    entries.push(emptyObject);
    render()
    const entriesObj = document.getElementsByClassName("entry")
    scrollTo({
        top: entriesObj[entriesObj.length - 1].offsetTop,
        left: 0,
        behavior: "smooth"
    })
}

function deleteAllData() {
    document.getElementById("delete-all-overlay").style.display = "none";
    entries = [];
    render();
}

function openDeleteEntry(element) {
    document.getElementById("delete-entry-overlay").style.display = "inline";
    document.getElementById("delete-entry-button").onclick = function () {
        document.getElementById("delete-entry-overlay").style.display = "none";
        deleteEntry(element);
    }
}

function deleteEntry(element) {
    entries.splice(element, 1);
    render();
}

function getData() {
    let newEntries = []
    const DOMEntries = document.getElementsByClassName("entry")
    for (let entry of DOMEntries) {
        let entryObj = {};
        entryObj.name = entry.getElementsByClassName("name")[0].value;
        entryObj.firstName = entry.getElementsByClassName("first-name")[0].value;
        entryObj.birthdate = entry.getElementsByClassName("birthdate")[0].value;
        entryObj.zip = entry.getElementsByClassName("zip")[0].value;
        entryObj.residency = entry.getElementsByClassName("residency")[0].value;
        entryObj.nationality = entry.getElementsByClassName("nationality")[0].value;
        entryObj.street = entry.getElementsByClassName("street")[0].value;
        entryObj.identityDisk = entry.getElementsByClassName("identity-disk")[0].value;
        entryObj.district = entry.getElementsByClassName("district")[0].value;
        entryObj.rcUnit = entry.getElementsByClassName("rc-unit")[0].value;
        entryObj.place = entry.getElementsByClassName("place")[0].value;
        entryObj.unit = entry.getElementsByClassName("unit")[0].value;
        entryObj.start = entry.getElementsByClassName("start")[0].value;
        let sex = entry.querySelectorAll("input[name='sex']");
        for (i = 0; i < sex.length; i++) {
            if (sex[i].checked) entryObj.sex = sex[i].value
        }
        if (!isEmpty(entryObj)) newEntries.push(entryObj)
    }
    entries = newEntries
    localStorage.setItem("storedState", JSON.stringify(entries))
}

function render() {
    localStorage.setItem("storedState", JSON.stringify(entries))
    let renderEntries = entries
    if (entries.length === 0) renderEntries.push(emptyObject)
    let html = ""
    for (let i = 0; i < renderEntries.length; i++) {
        let entry = entries[i]
        let birthdateType = "date"
        if (entry.birthdate == "") birthdateType = "text"
        let startType = "datetime-local"
        if (entry.start == "") startType = "text"
        let maleChecked = "", femaleChecked = "", diverseChecked = ""
        switch (entry.sex) {
            case "m": maleChecked = "checked"; break;
            case "f": femaleChecked = "checked"; break;
            case "d": diverseChecked = "checked"
        }
        console.log
        html += `<div class="entry"><form>
        <div style="display: flex; justify-content: space-between;">
            <span>
                <input value="${entry.name.replace(/"/g, "&quot;")}" class="name" type="text" placeholder="Nachname">
                <input value="${entry.firstName.replace(/"/g, "&quot;")}" class="first-name" type="text" placeholder="Vorname">
            </span>
            <button type="button" onclick="openDeleteEntry(${i})" class="input-style not-printable">🗑️</button>
        </div>
        <input value="${entry.birthdate.replace(/"/g, "&quot;")}" class="birthdate" type="${birthdateType}" max="${new Date().toISOString().split('T')[0]}" placeholder="Geburtsdatum"
            onfocus="(this.type='date')" onblur="if(this.value==''){this.type='text'}">
        <fieldset id="fs-${i}" class="input-style" style="font-size: 21px;" aria-label="Geschlecht">
            <label aria-label="männlich"> <input value="m" type="radio" name="sex" ${maleChecked.replace(/"/g, "&quot;")}>♂</label>
            <label aria-label="weiblich"> <input value="f" type="radio" name="sex" ${femaleChecked.replace(/"/g, "&quot;")}>♀</label>
            <label aria-label="divers"> <input value="d" type="radio" name="sex" ${diverseChecked.replace(/"/g, "&quot;")}>⚧</label>
        </fieldset>
        <input value="${entry.nationality.replace(/"/g, "&quot;")}" class="nationality" type="text" placeholder="Nationalität">
        <br>
        <input value="${entry.street.replace(/"/g, "&quot;")}" class="street" type="text" placeholder="Straße">
        <input value="${entry.zip.replace(/"/g, "&quot;")}" class="zip" type="text" placeholder="PLZ" pattern="[0-9]{5}" inputmode="numeric">
        <input value="${entry.residency.replace(/"/g, "&quot;")}" class="residency" type="text" placeholder="Wohnort">
        <br>
        <input value="${entry.identityDisk.replace(/"/g, "&quot;")}" aria-label="Nummer der Erkennungsmarke" class="identity-disk" type="text" placeholder="Nr. der Erk.-Marke">
        <input value="${entry.district.replace(/"/g, "&quot;")}" class="district" type="text" placeholder="Kreisverband">
        <input value="${entry.rcUnit.replace(/"/g, "&quot;")}" class="rc-unit" type="text" placeholder="Gemeinschaft">
        <br>
        <input value="${entry.place.replace(/"/g, "&quot;")}" class="place" type="text" placeholder="Einsatzort">
        <input value="${entry.unit.replace(/"/g, "&quot;")}" class="unit" type="text" placeholder="Einsatzformation">
        <input value="${entry.start.replace(/"/g, "&quot;")}" class="start" type="${startType.replace(/"/g, "&quot;")}" placeholder="Einsatzbeginn"
            onfocus="(this.type='datetime-local')" onblur="if(this.value==''){this.type='text'}">
    </form></div>`
    }
    document.getElementById("entry-list").innerHTML = html
}

function printCard() {
    getData()
    let html = ""
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i]
        entry.residency = entry.zip + " " + entry.residency
        if (!entry.sex) entry.sex = "uk"
        html += `<div>
            <p class="name">${entry.name.replace(/</g, "&lt;")}</p>
            <p class="birthdate">${dateToStandard(entry.birthdate)}</p>
            <p class="residency">${entry.residency.replace(/</g, "&lt;")}</p>
            <p class="street">${entry.street.replace(/</g, "&lt;")}</p>
            <p class="district">${entry.district.replace(/</g, "&lt;")}</p>
            <p class="place">${entry.place.replace(/</g, "&lt;")}</p>
            <p class="start">${dateToStandard(entry.start, true)}</p>
            <p class="first-name">${entry.firstName.replace(/</g, "&lt;")}</p>
            <p class="${entry.sex.replace(/</g, "&lt;")}">&times;</p>
            <p class="nationality">${entry.nationality.replace(/</g, "&lt;")}</p>
            <p class="identity-disk">${entry.identityDisk.replace(/</g, "&lt;")}</p>
            <p class="rc-unit">${entry.rcUnit.replace(/</g, "&lt;")}</p>
            <p class="unit">${entry.unit.replace(/</g, "&lt;")}</p>
        </div>`
    }
    document.getElementById("print-area").innerHTML = html
    print()
}

document.getElementById("file-upload").addEventListener("change", function (e) {
    let file = document.getElementById("file-upload").files[0];
    (async () => {
        const fileContent = await file.text();
        document.getElementById("import-overlay").style.display = "none";
        importString(fileContent);
    })();
});
document.getElementById("add-string").addEventListener("click", function (e) {
    document.getElementById("import-overlay").style.display = "none";
    importString(document.getElementById("string-input").value);
    document.getElementById("string-input").value = "";
});

const overlays = document.getElementsByClassName("overlay");
for (let overlay of overlays) {
    overlay.addEventListener("click", (e) => {
        if (e.target.className === "overlay") e.target.style.display = "none";
    });
}

let lsItem = JSON.parse(localStorage.getItem("storedState"));
if (lsItem !== null && lsItem instanceof Array) {
    entries = lsItem;
}
render()
setInterval(getData, 1000)

async function registerServiceWorker () {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("./sw.js", {
                scope: "./",
            });
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};


registerServiceWorker();
