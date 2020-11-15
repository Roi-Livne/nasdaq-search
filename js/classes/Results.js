class Results {
    constructor(element) {
        this.ref = element;
        this.companyCompareList;
        this.createUl();
    }

    createUl() {
        let ul = document.createElement("ul");
        ul.classList.add("results__list");
        this.ul = ul;
        this.ref.appendChild(this.ul);
    }

    decideIncOrDec(company, perc) {
        if (company.changes >= 0) {
            perc.classList.add('background-green');
            perc.classList.add('text-green');
            perc.innerHTML = "(+" + company.changes + "%)";
        } else {
            perc.classList.add('background-red');
            perc.classList.add('text-red');
            perc.innerHTML = "(" + company.changes + "%)";
        }
    }

    displayResults(list, searchInput) {
        this.companiesList = list;
        let currentList = this.ul.querySelectorAll('*');
        currentList.forEach(item => item.remove());
        console.log(list);
        list.map((listItem) => {
            let item = document.createElement("li");
            let link = document.createElement("a");
            let infoDiv = document.createElement("div");
            let text = document.createElement("p");
            let perc = document.createElement("p");
            let compImg = document.createElement("img");
            let compareBtn = document.createElement("button");

            infoDiv.classList.add("info");
            compareBtn.innerHTML = "Compare";
            compareBtn.value = listItem.symbol;
            compareBtn.addEventListener("click", (event) => {
                this.showCompany((event.target.value))
                console.log(event.target);
                event.target.disabled = true;
            });

            compImg.onerror = removeImg;
            compImg.src = listItem.image;
            compImg.alt = "Company Image";
            link.appendChild(compImg);

            function removeImg() {
                compImg.src = '../img/defaultImg.jpg'
            }
            text.innerHTML = `${listItem.companyName} (${listItem.symbol})`;
            text.innerHTML = this.highlightText(searchInput, text.innerHTML.toString());

            perc.classList.add('perc');
            this.decideIncOrDec(listItem, perc);
            link.href = `../company.html?symbol=${listItem.symbol}`;
            link.appendChild(text);
            item.appendChild(link);
            item.classList.add('result');
            infoDiv.appendChild(perc);
            infoDiv.appendChild(compareBtn)
            item.appendChild(infoDiv);
            this.ul.appendChild(item);
        })
        this.updateCompareButtons();
    }

    highlightText(searchInput, text) {
        let startIndex = text.toUpperCase().indexOf(searchInput.toUpperCase());
        let first = text.slice(0, startIndex);
        let input = text.slice(startIndex, startIndex + searchInput.length);
        let last = text.slice(startIndex + searchInput.length, text.length);

        return first + `<span class="highlight">` + input + `</span>` + last;
    }

    showCompany(id) {
        let company;
        for (let i = 0; i < this.companiesList.length; i++) {
            if (this.companiesList[i].symbol === id) {
                company = this.companiesList[i];
                break;
            }
        }
        console.log(company);
        this.addToCompareList(company)
    }

    onCompare(callback) {
        this.addToCompareList = callback;
    }

    updateCompareButtons() {
        console.log(this.companyCompareList);
        if (this.companyCompareList) {
            let compButtonsList = this.ul.querySelectorAll("button");
            let compareListString = this.companyCompareList.toString();
            console.log(compButtonsList)
            for (let i = 0; i < compButtonsList.length; i++) {
                if (!compareListString.includes(compButtonsList[i].value)) compButtonsList[i].disabled = false;
                else compButtonsList[i].disabled = true;
            }
        }
    }
}

