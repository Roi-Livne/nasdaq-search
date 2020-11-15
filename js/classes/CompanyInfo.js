class CompanyInfo {
    constructor(element, symbol) {
        this.ref = element;
        this.symbol = symbol;
        this.companyRefs = {};
        this.companyInfo;
        this.historicalPriceChart;
        this.chartData;

        this.createLayout();
    }

    // *******************************************
    // *******************************************
    // LOAD COMPANY INFORMATION
    // *******************************************
    // *******************************************

    async load() {
        const COMPANY_URL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/profile/${this.symbol}`
        // const COMPANY_URL = `https://financialmodelingprep.com/api/v3/profile/${SYMBOL}?apikey=fe9adb3772e4502d2febd20ebc85da9e`

        try {
            this.companyRefs.loader.classList.add('show');
            let res = await fetch(COMPANY_URL);
            if (!res.ok) throw new Error(res);
            let data = await res.json();
            this.companyInfo = data[0];
            this.handleInfo(this.companyInfo);
        } catch (error) {
            console.log(error);
        }
    }

    handleInfo(company) {
        this.displayCompany(company);
        this.decideIncOrDec(company);
        setTimeout(() => {
            this.companyRefs.loader.classList.remove('show');
        }, 300);
    }

    displayCompany(company) {
        this.companyRefs.header.companyName.innerHTML = company.companyName;
        this.companyRefs.header.companySymbol.innerHTML = ` (${company.symbol})`;
        this.companyRefs.header.img.src = company.image;
        this.companyRefs.header.img.onerror = removeImg;
        function removeImg() {
            this.companyRefs.header.img.src = '../../img/defaultImg.jpg'
        }

        if (company.ceo !== "None") this.companyRefs.info.ceo.innerHTML = company.ceo;
        if (this.buildAddress(company)) this.companyRefs.info.location.innerHTML = this.buildAddress(company);
        this.companyRefs.desc.sector.innerHTML = company.sector;
        this.companyRefs.desc.desc.innerHTML = company.description;
        this.companyRefs.desc.website.innerHTML = company.website;
        this.companyRefs.desc.website.href = company.website;

        this.companyRefs.metrics.price.innerHTML = `$ ${company.price} `;
        this.companyRefs.metrics.changes.innerHTML = company.changes;
        this.companyRefs.metrics.perc.innerHTML = "(" + (company.changes * 100 / (company.price - company.changes)).toFixed(2) + "%)";
    }

    buildAddress(company) {
        let text = "";
        if (company.address) text += company.address + ", ";
        if (company.city) text += company.city + ", ";
        if (company.state) text += company.state + ", ";
        if (company.zip) text += company.zip + ", ";
        if (company.country) text += company.country + ", ";
        if (text.charAt(text.length - 2) === ',') text = text.slice(0, text.length - 2);
        return text;
    }

    decideIncOrDec(company) {
        if (company.changes >= 0) {
            this.companyRefs.metrics.metrics.classList.add('background-green');
            this.companyRefs.metrics.changes.classList.add('text-green');
            this.companyRefs.metrics.perc.classList.add('text-green');
            this.companyRefs.metrics.perc.innerHTML = "(+" + this.companyRefs.metrics.perc.innerHTML.slice(1);
        } else {
            this.companyRefs.metrics.metrics.classList.add('background-red');
            this.companyRefs.metrics.changes.classList.add('text-red');
            this.companyRefs.metrics.perc.classList.add('text-red');
            this.companyRefs.metrics.perc.innerHTML = "(" + this.companyRefs.metrics.perc.innerHTML.slice(1);
        }
    }

    // *******************************************
    // *******************************************
    // CHART CREATION
    // *******************************************
    // *******************************************

    async addChart() {
        this.historicalPriceChart = new Chart(this.companyRefs.chart.chart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Closing Stock Value',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',

                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',

                    ],
                    borderWidth: 1
                }]
            }
        });
        this.companyRefs.chart.filter.addEventListener("change", () => {
            this.fillChart(this.chartData);
        })
        const CHART_URL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${this.symbol}?serietype=line`
        // const CHART_URL = `https://financialmodelingprep.com/api/v3/historical-price-full/${this.symbol}?serietype=line&apikey=fe9adb3772e4502d2febd20ebc85da9e`

        await this.fetchChart(CHART_URL);
    }
    async fetchChart(url) {
        try {
            this.companyRefs.loader.classList.add('show');
            let res = await fetch(url);
            if (!res.ok) throw new Error(res);
            let data = await res.json();
            this.chartData = data.historical;
            this.chartData = this.chartData.slice().reverse()
            this.fillChart(this.chartData);
        } catch (error) {
            console.log(error);
        }
        setTimeout(() => {
            this.companyRefs.loader.classList.remove('show');
        }, 300);
    }

    fillChart(arr) {
        let selectChildrenArr = this.companyRefs.chart.filter.childNodes;
        let selectedFilter;
        for (let i = 0; i < selectChildrenArr.length; i++) {
            if (selectChildrenArr[i].selected) {
                selectedFilter = selectChildrenArr[i];
                break;
            }
        }
        let i;
        switch (selectedFilter.value) {
            case ('Week'):
                this.historicalPriceChart.data.labels = [];
                this.historicalPriceChart.data.datasets[0].data = [];
                this.historicalPriceChart.update();
                if (arr.length - 7 < 0) i = 0;
                else i = arr.length - 7;
                for (i; i < arr.length; i++) {
                    this.historicalPriceChart.data.labels.push(arr[i].date);
                    this.historicalPriceChart.data.datasets[0].data.push(arr[i].close);
                }
                this.historicalPriceChart.update();
                break;
            case ('Month'):
                this.historicalPriceChart.data.labels = [];
                this.historicalPriceChart.data.datasets[0].data = [];
                this.historicalPriceChart.update();
                if (arr.length - 31 < 0) i = 0;
                else i = arr.length - 31;
                for (i; i < arr.length; i++) {
                    this.historicalPriceChart.data.labels.push(arr[i].date);
                    this.historicalPriceChart.data.datasets[0].data.push(arr[i].close);
                }
                this.historicalPriceChart.update();
                break;
            case ('Three Months'):
                this.historicalPriceChart.data.labels = [];
                this.historicalPriceChart.data.datasets[0].data = [];
                this.historicalPriceChart.update();
                if (arr.length - 93 < 0) i = 0;
                else i = arr.length - 93;
                for (i; i < arr.length; i++) {
                    this.historicalPriceChart.data.labels.push(arr[i].date);
                    this.historicalPriceChart.data.datasets[0].data.push(arr[i].close);
                }
                this.historicalPriceChart.update();
                break;
            case ('Year'):
                this.historicalPriceChart.data.labels = [];
                this.historicalPriceChart.data.datasets[0].data = [];
                this.historicalPriceChart.update();
                if (arr.length - 365 < 0) i = 0;
                else i = arr.length - 365;
                for (i; i < arr.length; i++) {
                    this.historicalPriceChart.data.labels.push(arr[i].date);
                    this.historicalPriceChart.data.datasets[0].data.push(arr[i].close);
                }
                this.historicalPriceChart.update();
                break;
            case ('Weekly'):
                this.historicalPriceChart.data.labels = [];
                this.historicalPriceChart.data.datasets[0].data = [];
                for (let i = 0; i < arr.length; i += 7) {
                    this.historicalPriceChart.data.labels.push(arr[i].date);
                    this.historicalPriceChart.data.datasets[0].data.push(arr[i].close);
                }
                this.historicalPriceChart.update();
                break;
            case ('Monthly'):
                this.historicalPriceChart.data.labels = [];
                this.historicalPriceChart.data.datasets[0].data = [];
                for (let i = 0; i < arr.length; i += 31) {
                    this.historicalPriceChart.data.labels.push(arr[i].date);
                    this.historicalPriceChart.data.datasets[0].data.push(arr[i].close);
                }
                this.historicalPriceChart.update();
                break;
            case ('Yearly'):
                this.historicalPriceChart.data.labels = [];
                this.historicalPriceChart.data.datasets[0].data = [];
                for (let i = 0; i < arr.length; i += 365) {
                    this.historicalPriceChart.data.labels.push(arr[i].date);
                    this.historicalPriceChart.data.datasets[0].data.push(arr[i].close);
                }
                this.historicalPriceChart.update();
                break;
        }
    }

    // *******************************************
    // *******************************************
    // LAYOUT CREATION
    // *******************************************
    // *******************************************

    createLayout() {
        this.createLoader();
        this.createHeader();
        this.createInfo();
        this.createMetrics();
        this.createChart();
        this.createDesc();
    }

    createLoader() {
        let loader = document.createElement("div");
        loader.classList.add("lds-ellipsis");
        loader.classList.add("loader");
        loader.classList.add("company__loader");
        for (let i = 0; i < 4; i++) {
            let d = document.createElement("div");
            loader.appendChild(d);
        }
        this.companyRefs.loader = loader;
        this.ref.appendChild(loader);
    }

    createHeader() {
        let header = document.createElement("div");
        header.classList.add("header");

        let h1 = document.createElement("h1");
        h1.classList.add("company--name");
        let sp = document.createElement("span");
        sp.classList.add("company--symbol");

        let img = document.createElement("img");
        img.src = "#";
        img.alt = "Company Image";
        img.classList.add("company--image");


        header.appendChild(h1);
        header.appendChild(sp);
        this.ref.appendChild(header);
        this.ref.appendChild(img);

        this.companyRefs.header = {};
        this.companyRefs.header.img = img;
        this.companyRefs.header.companyName = h1;
        this.companyRefs.header.companySymbol = sp;
    }

    createInfo() {
        let h3 = document.createElement("h3");
        h3.classList.add("company--ceo");

        let h4 = document.createElement("h4");
        h4.classList.add("company--location");

        this.ref.appendChild(h3);
        this.ref.appendChild(h4);

        this.companyRefs.info = {};

        this.companyRefs.info.ceo = h3;
        this.companyRefs.info.location = h4;
    }

    createMetrics() {
        let metrics = document.createElement("div");
        metrics.classList.add("company__metrics");

        let price = document.createElement("p");
        price.classList.add("company__metrics--price");

        let changes = document.createElement("p");
        changes.classList.add("company__metrics--changes");

        let perc = document.createElement("p");
        perc.classList.add("company__metrics--perc");

        metrics.appendChild(price);
        metrics.appendChild(changes);
        metrics.appendChild(perc);
        this.ref.appendChild(metrics);

        this.companyRefs.metrics = {};
        this.companyRefs.metrics.metrics = metrics;
        this.companyRefs.metrics.price = price;
        this.companyRefs.metrics.changes = changes;
        this.companyRefs.metrics.perc = perc;
    }

    createChart() {
        let selectBox = document.createElement("select");
        selectBox.name = "dates";
        selectBox.id = "dates";
        selectBox.class = "select-dates";

        let opt1 = document.createElement("option");
        opt1.value = "Week";
        opt1.classList.add("week");
        opt1.innerHTML = "Week";
        opt1.selected = true;
        selectBox.appendChild(opt1);

        let opt2 = document.createElement("option");
        opt2.value = "Month";
        opt2.classList.add("month");
        opt2.innerHTML = "Month";
        selectBox.appendChild(opt2);

        let opt3 = document.createElement("option");
        opt3.value = "Three Months";
        opt3.classList.add("threeMonths");
        opt3.innerHTML = "Three Months";
        selectBox.appendChild(opt3);

        let opt4 = document.createElement("option");
        opt4.value = "Year";
        opt4.classList.add("year");
        opt4.innerHTML = "Year";
        selectBox.appendChild(opt4);

        let opt5 = document.createElement("option");
        opt5.value = "divider";
        opt5.disabled = true;
        opt5.innerHTML = "- - - -";
        selectBox.appendChild(opt5);

        let opt6 = document.createElement("option");
        opt6.value = "Weekly";
        opt6.classList.add("weekly");
        opt6.innerHTML = "Weekly";
        selectBox.appendChild(opt6);

        let opt7 = document.createElement("option");
        opt7.value = "Monthly";
        opt7.classList.add("monthly");
        opt7.innerHTML = "Monthly";
        selectBox.appendChild(opt7);

        let opt8 = document.createElement("option");
        opt8.value = "Yearly";
        opt8.classList.add("yearly");
        opt8.innerHTML = "Yearly";
        selectBox.appendChild(opt8);

        this.ref.appendChild(selectBox);

        let chartDiv = document.createElement("div");
        chartDiv.classList.add("company__chart");

        let chartCanvas = document.createElement("canvas");
        chartCanvas.classList.add("company__chart--chart");

        chartDiv.appendChild(chartCanvas);
        this.ref.appendChild(chartDiv);

        this.companyRefs.chart = {};
        this.companyRefs.chart.filter = selectBox;
        this.companyRefs.chart.chart = chartCanvas;
    }

    createDesc() {
        let showBtn = document.createElement("button");
        showBtn.classList.add("company__show-desc");
        showBtn.innerHTML = "Show More";
        showBtn.onclick = this.showOrHideDesc.bind(this);

        let wrapper = document.createElement("div");
        wrapper.classList.add("company__desc");
        wrapper.classList.add("hide");

        let sector = document.createElement("h4");
        sector.classList.add("company__desc--sector");

        let website = document.createElement("a");
        website.classList.add("company__desc--website");

        let desc = document.createElement("p");
        desc.classList.add("company__desc--desc");


        wrapper.appendChild(sector);
        wrapper.appendChild(website);
        wrapper.appendChild(desc);
        this.ref.appendChild(showBtn);
        this.ref.appendChild(wrapper);

        this.companyRefs.showDescBtn = showBtn;
        this.companyRefs.desc = {};
        this.companyRefs.desc.wrapper = wrapper;
        this.companyRefs.desc.sector = sector;
        this.companyRefs.desc.website = website;
        this.companyRefs.desc.desc = desc;
    }

    showOrHideDesc() {
        if (this.companyRefs.showDescBtn.innerHTML === "Show More") this.companyRefs.showDescBtn.innerHTML = "Show Less";
        else this.companyRefs.showDescBtn.innerHTML = "Show More";

        this.companyRefs.desc.wrapper.classList.toggle("hide");
    }
}