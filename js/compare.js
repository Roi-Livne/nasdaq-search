(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const SYMBOLS = urlParams.get('symbols');
    const SYMBOLS_LIST = SYMBOLS.split(",");
    console.log(SYMBOLS_LIST);
    let companiesArr = [];
    for (let i = 0; i < SYMBOLS_LIST.length; i++) {
        let compDiv = document.createElement("div");
        compDiv.classList.add(`company`);
        // compDiv.classList.add(`compare`)
        document.querySelector(".compare-list").appendChild(compDiv)
        let compInfo = new CompanyInfo(document.querySelectorAll(`.company`)[i], SYMBOLS_LIST[i]);
        await compInfo.load();
        await compInfo.addChart();
        companiesArr.push(compInfo);
    }

})();