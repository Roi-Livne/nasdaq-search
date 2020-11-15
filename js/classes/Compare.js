class Compare {
    constructor(element) {
        this.ref = element;

        this.count = 0;
        this.companyList = [];
        this.createLayout();
    }

    createLayout() {
        let list = document.createElement("div");
        list.classList.add("compare__list");

        let btn = document.createElement("a");
        btn.classList.add("compare__button");
        btn.classList.add("disabled");
        btn.disabled = true;
        btn.innerHTML = 'Compare';

        this.ref.appendChild(list);
        this.ref.appendChild(btn);

        this.list = list;
        this.btn = btn;
    }

    addCompany(company) {
        this.count++;
        this.companyList.push(company.symbol);

        this.btn.innerHTML = `Compare ${this.count} Companies`
        this.btn.href = `../compare.html?symbols=${this.companyList.toString()}`;
        if (this.btn.disabled) {
            this.btn.disabled = false;
            this.btn.classList.remove('disabled')
        }

        let wrapper = document.createElement("a");
        wrapper.classList.add("company");
        wrapper.value = company.symbol;

        let sym = document.createElement("p");
        sym.classList.add("symbol");
        sym.innerHTML = company.symbol;

        let rem = document.createElement("p");
        rem.classList.add("remove");
        rem.innerHTML = 'x';

        wrapper.appendChild(sym);
        wrapper.appendChild(rem);
        this.list.appendChild(wrapper);

        wrapper.addEventListener("click", (event) => {
            if (event.target.classList.contains("company")) this.removeCompany(event.target);
            else this.removeCompany(event.target.parentNode)
        })
    }

    removeCompany(companyRef) {
        let symbol = companyRef.value;
        let list = this.list.querySelectorAll('.company');

        for (let i = 0; i < list.length; i++) {
            if (list[i].value === symbol) {
                this.list.removeChild(companyRef);
                this.companyList.splice(i, 1);
                break;
            }
        }

        this.count--;
        if (this.count > 0) {
            this.btn.innerHTML = `Compare ${this.count} Companies`
            this.btn.href = `../compare.html?symbols=${this.companyList.toString()}`;
        } else {
            this.btn.innerHTML = `Compare`
            this.btn.disabled = true;
            this.btn.classList.add('disabled')
            this.btn.removeAttribute("href");
        }
        this.updateCompares();
    }

    onRemove(callback) {
        this.updateCompares = callback;
    }
}