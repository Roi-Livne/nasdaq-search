(() => {
    const COMPARE = new Compare(document.querySelector('.compare'));

    const MARQUEE = new Marquee(document.querySelector('.marquee'));
    MARQUEE.createMarquee();

    const RESULTS_LIST = new Results(document.querySelector('.results'));
    RESULTS_LIST.onCompare((company) => {
        COMPARE.addCompany(company);
    })
    RESULTS_LIST.companyCompareList = COMPARE.companyList;
    COMPARE.onRemove(() => {
        RESULTS_LIST.updateCompareButtons();
    })

    const SEARCHBAR = new Searchbar(document.querySelector('.searchbar'));
    SEARCHBAR.createSearchbar();
    SEARCHBAR.onSearch((list, searchInput) => {
        RESULTS_LIST.displayResults(list, searchInput)
    });

})();
