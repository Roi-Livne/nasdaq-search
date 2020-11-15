class Marquee {
    constructor(element) {
        this.url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock-screener?marketCapMoreThan=1000000000&betaMoreThan=1&volumeMoreThan=10000&sector=Technology&exchange=NASDAQ&dividendMoreThan=0&limit=100`
        this.ref = element;
        this.createUl();
        // this.url = `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=1000000000&betaMoreThan=1&volumeMoreThan=10000&sector=Technology&exchange=NASDAQ&dividendMoreThan=0&limit=100&apikey=fe9adb3772e4502d2febd20ebc85da9e`
    }

    createUl() {
        let ul = document.createElement("ul");
        ul.classList.add("marquee__list");
        this.ul = ul;
        this.ref.appendChild(this.ul);
    }

    createContent(list) {
        list.map(async (listItem) => {
            let item = document.createElement("li");
            let link = document.createElement("a");

            link.innerHTML = `${listItem.symbol} <span class = "price">$${listItem.price}</span>`;
            link.href = `../nasdaq-search/company.html?symbol=${listItem.symbol}`;
            item.appendChild(link);
            this.ul.appendChild(item)
        })
    }

    async createMarquee() {
        try {
            let res = await fetch(this.url);
            if (!res.ok) throw new Error(res);
            let data = await res.json();
            console.log(data)
            this.createContent(data);
        } catch (error) {
            console.log(error);
        }
    }


}