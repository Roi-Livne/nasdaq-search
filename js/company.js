(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const SYMBOL = urlParams.get('symbol');
    const compInfo = new CompanyInfo(document.querySelector(".company"), SYMBOL);
    await compInfo.load();
    await compInfo.addChart();
})();