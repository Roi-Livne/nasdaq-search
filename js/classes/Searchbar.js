class Searchbar {
    constructor(element) {
        this.ref = element;
    }

    onSearch(callback) {
        this.load = callback;
    }

    debounce(func, wait) {
        let timeout;

        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    debounceSearch = this.debounce(() => {
        let searchInput = this.searchbar.value;
        this.searchInput = searchInput;
        let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`;
        this.fetchResultsList(url);

        let currQuery = new URLSearchParams(window.location.search);
        currQuery.set('query', searchInput);
        let newPath = window.location.pathname + "?" + currQuery.toString();
        history.replaceState(null, '', newPath);
    }, 700)

    makeBar() {
        let bar = document.createElement("input");
        bar.type = "search";
        bar.name = "searchbar";
        bar.classList.add("searchbar__bar");
        bar.addEventListener("keyup", this.debounceSearch)
        this.searchbar = bar;
        this.ref.prepend(bar);

        const QUERYSTRING = new URLSearchParams(window.location.search);
        const QUERY = QUERYSTRING.get('query');
        if (QUERY) {
            bar.value = QUERY;
            this.searchInput = QUERY.toString();
            this.fetchResultsList(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${QUERY.toString()}&limit=10&exchange=NASDAQ`)
        }

    }

    async fetchResultsList(url) {
        try {
            this.loader.classList.add('show');
            let res = await fetch(url);
            if (!res.ok) throw (res);
            let data = await res.json();
            this.fetchAllProfs(data)
        } catch (error) {
            console.log(error);
        }
    }

    async fetchAllProfs(list) {
        let allSymbols = list.map(listItem => listItem.symbol).toString();
        let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/profile/${allSymbols}`;
        // let url = `https://financialmodelingprep.com/api/v3/profile/${allSymbols}&apikey=fe9adb3772e4502d2febd20ebc85da9e`;
        try {
            let res = await fetch(url);
            if (!res.ok) throw (res);
            let data = await res.json();
            this.list = data;
            this.load(this.list, this.searchInput);
        } catch (error) {
            console.log(error);
        }
        this.loader.classList.remove('show');

    }

    makeButton() {
        let btn = document.createElement("button");
        btn.innerHTML = "Search";
        btn.classList.add("searchbar__search-btn");
        this.button = btn;
        btn.addEventListener("click", () => {
            let searchInput = this.searchbar.value;
            this.searchInput = searchInput;
            let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`;
            this.fetchResultsList(url);
        })
        this.ref.prepend(btn);
    }

    makeLoader() {
        let loader = document.createElement("div");
        loader.classList.add("lds-ellipsis");
        loader.classList.add("loader");
        for (let i = 0; i < 4; i++) {
            let d = document.createElement("div");
            loader.appendChild(d);
        }
        this.loader = loader;
        this.ref.appendChild(loader);
    }

    createSearchbar() {
        this.makeLoader();
        this.makeButton();
        this.makeBar();
    }
}